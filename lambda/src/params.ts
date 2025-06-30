import {
  createGetMandatoryNumberParameter,
  createGetMandatoryParameter,
} from "./utils.ts";

export const getApiUrl = createGetMandatoryParameter("API_URL");
export const getApiKey = createGetMandatoryParameter("API_KEY");
export const getPageSize = createGetMandatoryNumberParameter("PAGE_SIZE");
export const getSnsTopicArn = createGetMandatoryParameter("SNS_TOPIC_ARN");
