import type { Metadata } from "next";
import { CalendarBookingUI } from "@/components/booking/CalendarBookingUI";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlurFade } from "@/components/magicui/BlurFade";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { siteConfig } from "@/configs/seo";

export const metadata: Metadata = {
  title: "Book a Free TikTok Shop Revenue Review",
  description:
    "Schedule a free 30-minute TikTok Shop Revenue Review with Stackd. We'll review your brand's current approach and identify opportunities to turn TikTok Shop into a structured revenue channel.",
  alternates: {
    canonical: "/book",
  },
  openGraph: {
    title: "Book a Free TikTok Shop Revenue Review | Stackd",
    description:
      "Schedule a free 30-minute call with Stackd. We'll review your TikTok Shop approach and map out a path to structured, scalable revenue.",
    url: `${siteConfig.url}/book`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TikTok Shop Revenue Review",
  provider: {
    "@type": "Organization",
    name: "Stackd",
    url: siteConfig.url,
  },
  description:
    "A free 30-minute strategy call where Stackd reviews how your brand is currently approaching TikTok Shop and identifies revenue opportunities.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    url: `${siteConfig.url}/book`,
  },
  serviceType: "Revenue Operations Consultation",
  areaServed: "US",
};

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FC]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-[#0B1F3B] pt-28 pb-24 px-6">
        {/* Grid background */}
        <div className="absolute inset-0 z-0">
          <InteractiveGridPattern
            width={72}
            height={72}
            squares={[40, 40]}
            className="opacity-100 mix-blend-overlay"
            hoverColor="fill-white/[0.06]"
          />
        </div>

        {/* Radial glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-0 h-[70vh] w-[50vw] -translate-y-1/2"
          style={{
            background:
              "radial-gradient(ellipse at left center, #2F80ED 0%, transparent 65%)",
            opacity: 0.07,
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <BlurFade delay={0.05}>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-5 block">
              Revenue Review
            </span>
          </BlurFade>

          <BlurFade delay={0.12}>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-[54px] leading-tight">
              TikTok Shop{" "}
              <span className="text-[#2F80ED]">Revenue Review</span>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="mx-auto max-w-2xl text-lg text-white/55 leading-relaxed">
              A focused conversation where we review how your brand is
              currently approaching TikTok Shop and identify opportunities to
              turn it into a structured revenue channel.
            </p>
          </BlurFade>

          <BlurFade delay={0.32}>
            <div className="mt-12 border-t border-white/[0.08] pt-10">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-14">
                {[
                  { value: "30 min", label: "Call duration" },
                  { value: "Free", label: "No commitment" },
                  { value: "Google Meet", label: "Video conference" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center text-center">
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="mt-1 text-xs text-white/35">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ── Booking form ── */}
      <main className="mx-auto w-full max-w-5xl grow px-6 py-16">
        {/* Form intro */}
        <BlurFade delay={0.05}>
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-[#0B1F3B] mb-2">
              Schedule Your Call
            </h2>
            <p className="text-[#1A1A1A]/50 text-base">
              Pick a date and time — we&apos;ll send a Google Meet invite
              directly to your inbox.
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.1}>
          <CalendarBookingUI />
        </BlurFade>

        {/* What to expect */}
        <BlurFade delay={0.18}>
          <div className="mt-14 border-t border-[#E8ECF2] pt-12">
            <p className="text-center text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1A1A1A]/30 mb-10">
              What to expect
            </p>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-3xl mx-auto">
              {[
                {
                  num: "01",
                  title: "Current state review",
                  desc: "We look at how you&apos;re approaching TikTok Shop today — what&apos;s working and what isn&apos;t.",
                },
                {
                  num: "02",
                  title: "Opportunity mapping",
                  desc: "We identify structural gaps and outline what a revenue-focused operation would look like for your brand.",
                },
                {
                  num: "03",
                  title: "Direct conversation",
                  desc: "No pitch deck. No pressure. An honest assessment of whether we&apos;re the right fit.",
                },
              ].map((item) => (
                <div key={item.num} className="text-center">
                  <div className="text-xs font-bold tracking-[0.15em] text-[#2F80ED] mb-3">
                    {item.num}
                  </div>
                  <div className="text-sm font-semibold text-[#0B1F3B] mb-2">
                    {item.title}
                  </div>
                  <div
                    className="text-sm text-[#1A1A1A]/45 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.desc }}
                  />
                </div>
              ))}
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.28}>
          <p className="mt-12 text-center text-sm text-[#1A1A1A]/40 italic">
            Best suited for consumer brands actively exploring TikTok Shop
            growth.
          </p>
        </BlurFade>
      </main>

      <Footer />
    </div>
  );
}
