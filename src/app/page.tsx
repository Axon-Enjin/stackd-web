import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { FounderCredibilitySection } from "@/components/sections/FounderCredibilitySection";
import { WhyStackdExistsSection } from "@/components/sections/WhyStackdExistsSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { OurPositionSection } from "@/components/sections/OurPositionSection";
import { WhoWeWorkWithSection } from "@/components/sections/WhoWeWorkWithSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { VisionValuesSection } from "@/components/sections/VisionValuesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { siteConfig } from "@/configs/seo";

// ── Page-level metadata (inherits template from root layout) ──────────────────
export const metadata: Metadata = {
  title: "TikTok Shop Revenue Operations",
  description:
    "Stackd partners with established consumer brands to build and operate the live commerce, creator, and performance systems behind TikTok Shop — as a fully accountable revenue function.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Stackd | TikTok Shop Revenue Operations",
    description:
      "Stackd partners with established consumer brands to build and operate the live commerce, creator, and performance systems behind TikTok Shop — as a fully accountable revenue function.",
    url: siteConfig.url,
    type: "website",
  },
};

// ── Structured Data (JSON-LD) ─────────────────────────────────────────────────

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Stackd",
  url: siteConfig.url,
  logo: `${siteConfig.url}/logo-navyblue.png`,
  description: siteConfig.description,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Business Inquiries",
    url: `${siteConfig.url}/book`,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Stackd",
  url: siteConfig.url,
  description: siteConfig.description,
  potentialAction: {
    "@type": "ReadAction",
    target: [`${siteConfig.url}/book`],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you guarantee revenue?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. We guarantee disciplined execution and structured operations. Revenue is the outcome of consistent, well-managed systems — and building that is exactly what we do.",
      },
    },
    {
      "@type": "Question",
      name: "Do you provide creators?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We build and manage structured creator ecosystems. We do not rely on one-off influencer blasts. Our approach is systematic — outreach, onboarding, coordination and performance tracking built as infrastructure.",
      },
    },
    {
      "@type": "Question",
      name: "What markets do you support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "US-first. Additional markets selectively, based on brand fit and operational readiness.",
      },
    },
    {
      "@type": "Question",
      name: "Who are you best suited for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Brands already generating revenue and ready to commit to structured execution. We are not a fit for early-stage testing or short-term campaign work.",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />
      <main>
        <HeroSection />
        <section id="team">
          <FounderCredibilitySection />
        </section>
        {/* <PainPointsSection /> */}
        {/* <FounderCredibilitySection /> */}
        <ProblemSection />
        <section id="why-stackd">
          <WhyStackdExistsSection />
        </section>
        <section id="our-position">
          <OurPositionSection />
        </section>
        <WhoWeWorkWithSection />
        {/* <TeamSection /> */}
        <section id="how-we-work">
          <ProcessSection />
        </section>
        <section id="faq">
          <FAQSection />
        </section>
        <VisionValuesSection />
        <TestimonialSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
