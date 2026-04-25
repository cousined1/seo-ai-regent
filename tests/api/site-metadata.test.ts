import { describe, expect, it } from "vitest";

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("site metadata routes", () => {
  it("publishes a crawl policy with the sitemap location", () => {
    const policy = robots();

    expect(policy).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/debug", "/api/debug/", "/app"],
      },
      sitemap: "https://seoairegent.com/sitemap.xml",
    });
  });

  it("publishes only public crawl targets in the sitemap", () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://seoairegent.com/",
        }),
        expect.objectContaining({
          url: "https://seoairegent.com/demo",
        }),
        expect.objectContaining({
          url: "https://seoairegent.com/privacy",
        }),
        expect.objectContaining({
          url: "https://seoairegent.com/terms",
        }),
      ]),
    );
    expect(entries).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://seoairegent.com/app/editor",
        }),
      ]),
    );
  });
});
