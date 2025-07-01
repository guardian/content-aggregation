import { SNSClient } from "@aws-sdk/client-sns";
import { fetchEntities } from "./api.ts";
import { getApiKey, getApiUrl, getPageSize, getSnsTopicArn } from "./params.ts";
import { ResultKind } from "./result.ts";
import { publishEntityCountsToSNS as pushEntityCountsToSns } from "./sns.ts";

type StepFnInput = {
  nextPage: number | undefined;
};

type LambdaOutput = {
  nextPage: number;
  resultCount: number;
  entityToCountMap: Record<string, number>;
};

export const createHandler =
  (snsClient: SNSClient) =>
  async ({ nextPage: _nextPage }: StepFnInput): Promise<LambdaOutput> => {
    if (_nextPage === undefined) {
      throw new Error(
        "The lambda was invoked without a value for `currentPage`"
      );
    }

    const apiUrl = getApiUrl();
    const apiKey = getApiKey();
    const pageSize = getPageSize();
    const snsTopic = getSnsTopicArn();
    const currentPage = _nextPage ?? 1;

    const maybeEntities = await fetchEntities({
      apiUrl,
      apiKey,
      pageSize,
      currentPage,
    });

    if (maybeEntities.kind === ResultKind.Err) {
      throw new Error(maybeEntities.err);
    }

    const { value: entityToCountMap } = maybeEntities;
    const nextPage = currentPage + 1;

    if (Object.keys(entityToCountMap).length === 0) {
      return { nextPage, resultCount: 0, entityToCountMap: {} };
    }

    const maybeSnsResult = await pushEntityCountsToSns(
      entityToCountMap,
      snsTopic,
      snsClient
    );

    if (maybeSnsResult.kind === ResultKind.Err) {
      throw new Error(maybeSnsResult.err);
    }

    return {
      nextPage,
      resultCount: Object.keys(entityToCountMap).length,
      entityToCountMap,
    };
  };
