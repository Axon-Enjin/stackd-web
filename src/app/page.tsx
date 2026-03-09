import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { PainPointsSection } from "@/components/sections/PainPointsSection";
import { FounderCredibilitySection } from "@/components/sections/FounderCredibilitySection";
import { WhyStackdExistsSection } from "@/components/sections/WhyStackdExistsSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { OurPositionSection } from "@/components/sections/OurPositionSection";
import { WhoWeWorkWithSection } from "@/components/sections/WhoWeWorkWithSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { VisionValuesSection } from "@/components/sections/VisionValuesSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
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
        <FounderCredibilitySection />
        {/* <TeamSection /> */}
        <section id="faq">
          <FAQSection />
        </section>
        <VisionValuesSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
