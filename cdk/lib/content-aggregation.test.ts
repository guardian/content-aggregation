import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { ContentAggregation } from "./content-aggregation";

describe("The ContentAggregation stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new ContentAggregation(app, "ContentAggregation", { stack: "flexible", stage: "TEST" });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
