import "source-map-support/register";
import { GuRoot } from "@guardian/cdk/lib/constructs/root";
import { ContentAggregation } from "../lib/content-aggregation";

const app = new GuRoot();
new ContentAggregation(app, "ContentAggregation-euwest-1-CODE", { stack: "flexible", stage: "CODE", env: { region: "eu-west-1" } });
new ContentAggregation(app, "ContentAggregation-euwest-1-PROD", { stack: "flexible", stage: "PROD", env: { region: "eu-west-1" } });
