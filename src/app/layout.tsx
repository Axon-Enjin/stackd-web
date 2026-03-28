import type { Metadata } from "next";
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

  // ── Canonical / alternate ────────────────────────────────────────────
  alternates: {
    canonical: "/",
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

  // ── App / Icons ──────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },

  // ── Search-engine verification tokens (add your own) ────────────────
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  //   yandex: "YOUR_YANDEX_TOKEN",
  // },
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
