import type { MetadataRoute } from "next";
import { siteConfig } from "@/configs/seo";

// Use stable dates — "always today" signals are ignored/penalized by Google.
// Update these when you meaningfully change a page's content.
const ROUTE_META: { path: string; lastModified: string; priority: number }[] =
  [
    { path: "", lastModified: "2026-04-01", priority: 1.0 },
    { path: "/book", lastModified: "2026-04-01", priority: 0.9 },
    { path: "/team", lastModified: "2026-03-01", priority: 0.7 },
    { path: "/privacy", lastModified: "2026-01-01", priority: 0.3 },
    { path: "/terms", lastModified: "2026-01-01", priority: 0.3 },
  ];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTE_META.map(({ path, lastModified, priority }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: (path === "" || path === "/book"
      ? "weekly"
      : "monthly") as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority,
  }));
}
