import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseHostname = new URL(supabaseUrl).hostname;

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Enforce canonical domain: always redirect non-www → www
  // This fixes "Redirect error" in Google Search Console when Googlebot
  // crawls http://stackdpartners.com/ and encounters a broken redirect chain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "stackdpartners.com" }],
        destination: "https://www.stackdpartners.com/:path*",
        permanent: true, // 308 — tells Google to update its index permanently
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
};

export default withSerwist(nextConfig);
