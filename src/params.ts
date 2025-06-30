import {
  createGetMandatoryNumberParameter,
  createGetMandatoryParameter,
} from "./utils.js";

export const getApiUrl = createGetMandatoryParameter("API_URL");
export const getApiKey = createGetMandatoryParameter("API_URL");
export const getPageSize = createGetMandatoryNumberParameter("PAGE_SIZE");
export const getSnsTopicArn = createGetMandatoryParameter("SNS_TOPIC_ARN");
