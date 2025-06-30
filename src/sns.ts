import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { err, ok } from "./result.js";

export const publishEntityCountsToSNS = async (
  entityToCountMap: Record<string, number>,
  TopicArn: string
) => {
  console.log(`Pushing ${JSON.stringify(entityToCountMap)} to ${TopicArn}`);
  const client = new SNSClient({ region: "eu-west-1" });
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
