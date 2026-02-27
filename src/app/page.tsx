import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProblemSection } from "@/components/sections/ProblemSection";
import { SolutionSection } from "@/components/sections/SolutionSection";
import { DifferentiatorSection } from "@/components/sections/DifferentiatorSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { IdealClientSection } from "@/components/sections/IdealClientSection";
import { FinalCTASection } from "@/components/sections/FinalCTASection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <DifferentiatorSection />
        <ProcessSection />
        <IdealClientSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
