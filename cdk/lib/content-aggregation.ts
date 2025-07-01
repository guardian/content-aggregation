import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack, GuStringParameter } from '@guardian/cdk/lib/constructs/core';
import { GuLambdaFunction } from '@guardian/cdk/lib/constructs/lambda';
import { type App, Duration } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import {
	Choice,
	Condition,
	CustomState,
	DefinitionBody,
	StateMachine,
	Succeed,
	TaskInput,
	Wait,
	WaitTime,
} from 'aws-cdk-lib/aws-stepfunctions';
import { LambdaInvoke } from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class ContentAggregation extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const app = 'content-aggregation';

		const paramPrefix = `/${this.stage}/${this.stack}/${app}/`;

		const apiKey = new GuStringParameter(this, 'api-key-param', {
			fromSSM: true,
			default: `${paramPrefix}content-api-key`,
		});

		const pageSize = new GuStringParameter(this, 'page-size', {
			fromSSM: true,
			default: `${paramPrefix}page-size`,
		});

		const apiUrl =
			this.stage === 'PROD'
				? 'https://content.guardianapis.com'
				: 'http://content.code.dev-guardianapis.com';

		const tagAggregationSnsTopic = new Topic(this, 'tag-aggregation-topic', {
			topicName: 'tag-aggregations',
		});

		const tagAggregationSqsDlq = new Queue(this, 'tag-aggregation-dlq', {
			queueName: 'content-aggregation-tags-dlq',
		});

		const tagAggregationSqs = new Queue(this, 'tag-aggregation-sqs', {
			enforceSSL: true,
			queueName: 'content-aggregation-tags',
			deadLetterQueue: {
				queue: tagAggregationSqsDlq,
				maxReceiveCount: 1,
			},
		});

		tagAggregationSnsTopic.addSubscription(
			new SqsSubscription(tagAggregationSqs),
		);

		const contentAggregationLambda = new GuLambdaFunction(
			this,
			'content-aggregation-lambda',
			{
				app,
				handler: 'index.handler',
				functionName: `content-aggregation-${this.stage}`,
				runtime: Runtime.NODEJS_22_X,
				fileName: `${app}.zip`,
				environment: {
					API_URL: apiUrl,
					API_KEY: apiKey.valueAsString,
					PAGE_SIZE: pageSize.valueAsString,
					SNS_TOPIC_ARN: tagAggregationSnsTopic.topicArn,
				},
				initialPolicy: [
					new PolicyStatement({
						effect: Effect.ALLOW,
						actions: ['sns:Publish'],
						resources: [tagAggregationSnsTopic.topicArn],
					}),
				],
			},
		);

		const defineDefaults = new CustomState(this, 'defineDefaults', {
			stateJson: {
				Type: 'Pass',
        Assign: {
					currentPage: 1,
        }
			},
		});

		const pollCapiAndPublishToSNS = new LambdaInvoke(this, 'poll-capi', {
			lambdaFunction: contentAggregationLambda,
			payload: TaskInput.fromObject({
				'currentPage.$': '$currentPage',
			}),
      assign: {
        "currentPage.$": "$.currentPage"
      }
		});

		const waitForThroughputAndWriteNextBatch = new Wait(
			this,
			'wait-for-throughput',
			{
				time: WaitTime.duration(Duration.seconds(1)),
			},
		).next(pollCapiAndPublishToSNS);

		const shouldContinuePolling = new Choice(this, 'ShouldContinuePolling')
			.when(
				// We cannot read the SSM param as a number here, but string
				// evaluation in JavaScipt will accomplish the same thing :')
				Condition.stringLessThan(
					'$.Payload.resultCount',
					pageSize.valueAsString,
				),
				new Succeed(this, 'Reindex complete'),
			)
			.otherwise(waitForThroughputAndWriteNextBatch);

		new StateMachine(this, 'ReindexingStateMachine', {
			definitionBody: DefinitionBody.fromChainable(
				defineDefaults
					.next(pollCapiAndPublishToSNS)
					.next(shouldContinuePolling),
			),
			stateMachineName: 'content-aggregation-state-machine-tags',
			timeout: Duration.minutes(15),
		});
	}
}
