import type { TagsResponse } from "@guardian/content-api-models/v1/tagsResponse.js";
import type { SearchResponse } from "@guardian/content-api-models/v1/searchResponse.js";
import type { Result } from "./result.ts";
import { logFetch } from "./utils.ts";
import { err, ok } from "./result.ts";

export const fetchEntities = async ({
  currentPage,
  pageSize,
  apiUrl,
  apiKey,
}: {
  currentPage: number;
  pageSize: number;
  apiUrl: string;
  apiKey: string;
}): Promise<Result<string, Record<string, number>>> => {
  const iterationTimerId = "fetch-tags-and-iterate-for-page";

  console.time(iterationTimerId);

  const urlParams = new URLSearchParams({
    "api-key": apiKey,
    "page-size": pageSize.toString(),
    page: currentPage.toString(),
  });

  const tagPageUrl = `${apiUrl}/tags?${urlParams.toString()}`;
  const response = await logFetch(`${apiUrl}/tags?${urlParams.toString()}`);

  if (response.status > 399) {
    return err(
      `Error fetching tag page from ${tagPageUrl}: ${
        response.status
      }, ${await response.text()}`
    );
  }

  const bodyJson = (await response.json()).response as TagsResponse;

  const tags = bodyJson.results;
  if (!tags.length) {
    return ok({});
  }

  const hitsPerTag: Record<string, number> = {};

  for (const tag of tags) {
    const tagId = tag.id;
    const urlParams = new URLSearchParams({
      tag: tagId,
      "api-key": apiKey,
    });

    const url = `${apiUrl}/search?${urlParams}`;
    const hitsResponse = await logFetch(url);
    if (hitsResponse.status > 399) {
      console.error(`Error getting total for ${tagId}`, hitsResponse);
      throw new Error(hitsResponse.statusText);
    }

    const hitsJson = (await hitsResponse.json()).response as SearchResponse;
    const hits = hitsJson.total;
    hitsPerTag[tag.id] = hits;
  }

  console.timeEnd(iterationTimerId);

  return ok(hitsPerTag);
};
