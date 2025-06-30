import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack, GuStringParameter } from '@guardian/cdk/lib/constructs/core';
import { GuLambdaFunction } from '@guardian/cdk/lib/constructs/lambda';
import type { App } from 'aws-cdk-lib';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { SqsSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Queue } from 'aws-cdk-lib/aws-sqs';

export class ContentAggregation extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const app = 'content-aggregation';

		const paramPrefix = `${this.stage}/${this.stack}/${app}/`;
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

		const tagAggregationSqsDlq = new Queue(this, 'DLQ');
		const tagAggregationSqs = new Queue(this, 'Connection', {
			enforceSSL: true,
			deadLetterQueue: {
				queue: tagAggregationSqsDlq,
				maxReceiveCount: 1,
			},
		});
		tagAggregationSnsTopic.addSubscription(
			new SqsSubscription(tagAggregationSqs),
		);

		new GuLambdaFunction(this, 'content-aggregation-lambda', {
			app,
			handler: 'index.handler',
			functionName: `content-aggregation-${this.stage}`,
			runtime: Runtime.NODEJS_22_X,
			fileName: 'src/index.ts',
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
		});
	}
}
