import type { MetadataRoute } from "next";
import { siteConfig } from "@/configs/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/book", "/team", "/privacy", "/terms"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes];
}
