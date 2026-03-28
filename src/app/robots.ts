import type { MetadataRoute } from "next";
import { siteConfig } from "@/configs/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cms/", "/api/", "/_next/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
