"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import { MagicCard } from "@/components/magicui/magic-card";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";

const CRITERIA = [
  {
    label: "Established Investment",
    description:
      "Brands already investing in creators or paid acquisition — with proven product-market fit.",
  },
  {
    label: "Structural Readiness",
    description:
      "Teams prepared for structured, multi-month execution — not a short-term campaign sprint.",
  },
  {
    label: "Strategic Commitment",
    description:
      "Leadership willing to treat TikTok Shop as a strategic growth channel — with resources to match.",
  },
];

export function WhoWeWorkWithSection() {
  return (
    <section className="bg-[#0B1F3B] py-24 px-6 relative overflow-hidden">
      {/* Interactive grid */}
      <div className="absolute inset-0 z-0">
        <InteractiveGridPattern
          width={72}
          height={72}
          squares={[40, 40]}
          className="opacity-100 mix-blend-overlay"
          hoverColor="fill-white/[0.08]"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <BlurFade delay={0.05}>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
              Who We Work With
            </span>
          </BlurFade>
          <BlurFade delay={0.12}>
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight tracking-tight mb-5">
              Selective Partnerships
            </h2>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="text-white/55 text-base md:text-lg leading-relaxed">
              Stackd works with a limited number of brands each year.
              We are best suited for:
            </p>
          </BlurFade>
        </div>

        {/* Criteria cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {CRITERIA.map((item, i) => (
            <BlurFade key={item.label} delay={0.18 + i * 0.1}>
              <MagicCard
                className="bg-white/[0.04] border border-white/[0.09] rounded-xl p-7 h-full cursor-default"
                gradientColor="#2F80ED18"
                gradientSize={220}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#2FB7A8] mb-5" />
                <h3 className="text-white font-semibold text-base mb-3 leading-snug">
                  {item.label}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {item.description}
                </p>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        {/* Closing declaration */}
        <BlurFade delay={0.5}>
          <div className="border-t border-white/[0.08] pt-10 max-w-2xl">
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-2">
              We do not engage in short-term experiments.
            </p>
            <p className="text-white font-semibold text-base md:text-lg leading-relaxed">
              We build sustained revenue systems.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
