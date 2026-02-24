import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ProviderCompose } from "@/providers/ProviderCompose";
import { BreakpointIndicator } from "@/components/widgets/BreakpointIndicator";
import { configs } from "@/configs/configs";
import { NavbarDebugging } from "@/components/widgets/NavbarDebugging";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Stackd",
  description:
    "Stackd is a revenue operations partner for direct-to-consumer brands scaling on TikTok Shop. We build and manage live commerce systems, creator networks, and performance infrastructure.",
  keywords: [
    "TikTok Shop",
    "revenue operations",
    "live commerce",
    "direct-to-consumer",
    "DTC brands",
    "affiliate management",
  ],
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
        <body className={`${inter.variable} antialiased`}>
          {isDev && <NavbarDebugging />}
          {children}
          {isDev && <BreakpointIndicator />}
        </body>
      </html>
    </ProviderCompose>
  );
}
