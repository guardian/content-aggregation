export const httpFixtures: Record<string, unknown> = {
  "https://api-url.com/tags?api-key=api-key&page-size=1&page=1": {
    response: {
      status: "ok",
      userTier: "internal",
      total: 71412,
      startIndex: 1,
      pageSize: 1,
      currentPage: 1,
      pages: 71412,
      results: [
        {
          id: "2019-family-gift-guide/2019-family-gift-guide",
          type: "paid-content",
          webTitle: "2019 family gift guide",
          webUrl:
            "https://www.theguardian.com/2019-family-gift-guide/2019-family-gift-guide",
          apiUrl:
            "https://content.guardianapis.com/2019-family-gift-guide/2019-family-gift-guide",
          activeSponsorships: [
            {
              sponsorshipType: "paid-content",
              sponsorName: "Google",
              sponsorLogo:
                "https://static.theguardian.com/commercial/sponsor/11/Nov/2019/522e3225-cc9f-4aca-b779-1885b95b2241-GoogleNest_Logo_Horizontal-280 copy-v2.png",
              sponsorLink: "https://nest.com/",
              sponsorLogoDimensions: { width: 280, height: 97 },
            },
          ],
          paidContentType: "Topic",
          internalName: "mic: 2019 family gift guide",
        },
      ],
    },
  },
  "https://api-url.com/search?tag=2019-family-gift-guide%2F2019-family-gift-guide&api-key=api-key":
    {
      response: {
        status: "ok",
        userTier: "internal",
        total: 1,
        startIndex: 1,
        pageSize: 10,
        currentPage: 1,
        pages: 1,
        orderBy: "newest",
        tag: {
          id: "2019-family-gift-guide/2019-family-gift-guide",
          type: "paid-content",
          webTitle: "2019 family gift guide",
          webUrl:
            "https://www.theguardian.com/2019-family-gift-guide/2019-family-gift-guide",
          apiUrl:
            "https://content.guardianapis.com/2019-family-gift-guide/2019-family-gift-guide",
          activeSponsorships: [
            {
              sponsorshipType: "paid-content",
              sponsorName: "Google",
              sponsorLogo:
                "https://static.theguardian.com/commercial/sponsor/11/Nov/2019/522e3225-cc9f-4aca-b779-1885b95b2241-GoogleNest_Logo_Horizontal-280 copy-v2.png",
              sponsorLink: "https://nest.com/",
              sponsorLogoDimensions: { width: 280, height: 97 },
            },
          ],
          paidContentType: "Topic",
          internalName: "mic: 2019 family gift guide",
        },
        results: [
          {
            id: "2019-family-gift-guide/2019/nov/12/family-holiday-gift-guide",
            type: "article",
            sectionId: "2019-family-gift-guide",
            sectionName: "2019 family gift guide",
            webPublicationDate: "2019-11-12T15:30:44Z",
            webTitle:
              "Holiday gift guide: 15 creative ideas for the whole family",
            webUrl:
              "https://www.theguardian.com/2019-family-gift-guide/2019/nov/12/family-holiday-gift-guide",
            apiUrl:
              "https://content.guardianapis.com/2019-family-gift-guide/2019/nov/12/family-holiday-gift-guide",
            isHosted: false,
          },
        ],
        leadContent: [
          {
            id: "2019-family-gift-guide/2019/nov/12/family-holiday-gift-guide",
            type: "article",
            sectionId: "2019-family-gift-guide",
            sectionName: "2019 family gift guide",
            webPublicationDate: "2019-11-12T15:30:44Z",
            webTitle:
              "Holiday gift guide: 15 creative ideas for the whole family",
            webUrl:
              "https://www.theguardian.com/2019-family-gift-guide/2019/nov/12/family-holiday-gift-guide",
            apiUrl:
              "https://content.guardianapis.com/2019-family-gift-guide/2019/nov/12/family-holiday-gift-guide",
            tags: [],
            references: [],
            isHosted: false,
          },
        ],
      },
    },
  "https://api-url.com/tags?api-key=api-key&page-size=1&page=2": {
    response: {
      status: "ok",
      userTier: "internal",
      total: 0,
      startIndex: 0,
      pageSize: 1,
      currentPage: 1,
      pages: 0,
      results: [],
    },
  },
};
