import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProviderCompose } from "@/providers/ProviderCompose";
import { BreakpointIndicator } from "@/components/widgets/BreakpointIndicator";
import { configs } from "@/configs/configs";
import { siteConfig } from "@/configs/seo";
import { DebugNavigator } from "@/components/widgets/DebugNavigator";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: "#0B1F3B",
};

export const metadata: Metadata = {
  // ── Base URL for resolving relative URLs in metadata ────────────────
  metadataBase: new URL(siteConfig.url),

  // ── Title template: child pages set `title` as a string and get
  //    "Page Title | Stackd" automatically.
  title: {
    default: "Stackd | TikTok Shop Revenue Operations",
    template: "%s | Stackd",
  },

  description: siteConfig.description,
  keywords: siteConfig.keywords,

  // ── Canonical: set per-page in each page.tsx, NOT here in root layout.
  // Setting canonical: "/" here would bleed onto all child pages and
  // override their own correct per-page canonicals.

  applicationName: siteConfig.name,
  appleWebApp: {
    title: siteConfig.name,
    statusBarStyle: "default",
    capable: true,
  },

  // ── Robots ───────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph ───────────────────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "Stackd | TikTok Shop Revenue Operations",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Stackd — TikTok Shop Revenue Operations",
      },
    ],
  },

  // ── Twitter / X ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Stackd | TikTok Shop Revenue Operations",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },

  // ── Icons are auto-detected by Next.js App Router from src/app/:
  //    favicon.ico, icon.svg, icon.png, apple-icon.png
  // ── Manifest is linked via <head> below ─────────────────────────────

  // ── Search-engine verification tokens ───────────────────────────────
  verification: {
    google: "8Qn7UtynOUUSZu4d3TykhaXyffKY_zTZ0Ikl8Y842Q0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = configs.environment === "DEVELOPMENT";

  return (
    <ProviderCompose>
      <html lang="en">
        <head>
          {/* Theme colour for browser UI chrome */}
          <meta name="theme-color" content="#0B1F3B" />
          <meta name="color-scheme" content="light dark" />
          {/* PWA Web App Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={`${inter.variable} ${inter.className} antialiased`}>
          {children}
          {isDev && <BreakpointIndicator />}
          {isDev && <DebugNavigator />}
          <Analytics />
        </body>
      </html>
    </ProviderCompose>
  );
}
