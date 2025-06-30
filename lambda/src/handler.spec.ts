import { afterEach, describe, it, mock } from "node:test";
import assert from "node:assert";
import { SNSClient } from "@aws-sdk/client-sns";
import { createHandler } from "./handler.ts";
import { httpFixtures } from "./fixtures/http.ts";

const MessageID = "example-message-id";
const snsClient = new SNSClient({});
const snsSendSpy = mock.fn(() => ({
  MessageID,
}));
mock.method(snsClient, "send", snsSendSpy);

mock.method(global, "fetch", (url: string) => {
  const fixture = httpFixtures[url];
  if (!fixture) {
    throw new Error(`No fixture for url: ${url}`);
  }

  return { json: async () => fixture, status: 200 };
});

describe("Lambda handler", () => {
  afterEach(() => snsSendSpy.mock.resetCalls());
  it("should throw if the necessary input is not present", async () => {
    const handler = createHandler(snsClient);
    const throws = () => handler({} as any);

    await assert.rejects(throws);
  });

  it("should get a page's worth of tag counts, write them to SNS, and give the output", async () => {
    const handler = createHandler(snsClient);
    const result = await handler({ currentPage: 1 });

    assert.equal(snsSendSpy.mock.callCount(), 1);
    assert.deepEqual(result, {
      resultCount: 1,
      entityToCountMap: {
        "2019-family-gift-guide/2019-family-gift-guide": 1,
      },
    });
  });

  it("should pass back an empty object if there are no results, and not make a call the SNS", async () => {
    const handler = createHandler(snsClient);
    const result = await handler({ currentPage: 2 });

    assert.equal(snsSendSpy.mock.callCount(), 0);
    assert.deepEqual(result, { resultCount: 0, entityToCountMap: {} });
  });
});
