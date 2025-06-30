import { fetchEntities } from "./api.js";
import { getApiKey, getApiUrl, getPageSize, getSnsTopicArn } from "./params.js";
import { ResultKind } from "./result.js";
import { publishEntityCountsToSNS as pushEntityCountsToSns } from "./sns.js";

type StepFnInput = {
  currentPage: number | undefined;
};

export const handler = async ({ currentPage: _currentPage }: StepFnInput) => {
  const apiUrl = getApiUrl();
  const apiKey = getApiKey();
  const pageSize = getPageSize();
  const snsTopic = getSnsTopicArn();

  const currentPage = _currentPage ?? 1;

  const maybeEntities = await fetchEntities({
    apiUrl,
    apiKey,
    pageSize,
    currentPage,
  });

  if (maybeEntities.kind === ResultKind.Err) {
    return {
      status: "error",
      reason: maybeEntities.err,
    };
  }

  const { value: entityToCountMap } = maybeEntities;

  await pushEntityCountsToSns(entityToCountMap, snsTopic);
};
