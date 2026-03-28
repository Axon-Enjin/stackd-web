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

export default function LandingPage() {
  return (
    <>
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
