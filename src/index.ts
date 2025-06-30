import { SNSClient } from "@aws-sdk/client-sns";
import { createHandler } from "./handler.ts";

const snsClient = new SNSClient({ region: "eu-west-1" });

export const handler = createHandler(snsClient);
