import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/debug", "/api/debug/", "/app"],
    },
    sitemap: "https://seoairegent.com/sitemap.xml",
  };
}
