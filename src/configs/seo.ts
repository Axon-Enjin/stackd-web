/**
 * Central SEO configuration.
 *
 * NEXT_PUBLIC_SITE_URL must be set in your environment variables:
 *   - Development:  http://localhost:3000
 *   - Production:   https://yourdomain.com  (no trailing slash)
 */
export const siteConfig = {
  name: "Stackd",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.stackdpartners.com",
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.stackdpartners.com"}/logo-navyblue.png`,
  description:
    "Stackd is a revenue operations partner for direct-to-consumer brands scaling on TikTok Shop. We build and manage live commerce systems, creator networks, and performance infrastructure.",
  keywords: [
    "TikTok Shop",
    "revenue operations",
    "live commerce",
    "direct-to-consumer",
    "DTC brands",
    "TikTok Shop agency",
    "creator management",
    "affiliate management",
    "TikTok Shop revenue",
    "live shopping",
    "ecommerce operations",
  ],
};

export type SiteConfig = typeof siteConfig;
