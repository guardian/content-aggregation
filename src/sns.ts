import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { err, ok } from "./result.ts";

export const publishEntityCountsToSNS = async (
  entityToCountMap: Record<string, number>,
  TopicArn: string,
  client: SNSClient
) => {
  console.log(`Pushing ${JSON.stringify(entityToCountMap)} to ${TopicArn}`);
  const command = new PublishCommand({
    Message: JSON.stringify(entityToCountMap),
    TopicArn,
  });
  try {
    const result = await client.send(command);
    console.log(`Pushed to ${TopicArn} with message ID ${result.MessageId}`);
    return ok(result.MessageId);
  } catch (e) {
    return err(JSON.stringify(e));
  }
};
