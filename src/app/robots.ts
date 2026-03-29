import type { MetadataRoute } from "next";
import { siteConfig } from "@/configs/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/_next/static/"],
      disallow: ["/cms/", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
