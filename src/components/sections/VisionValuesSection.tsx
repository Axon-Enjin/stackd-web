"use client";

import { BlurFade } from "@/components/magicui/BlurFade";

const VALUES = [
  { title: "Proactive Execution", description: "We move before we are asked. Accountability is built into how we operate." },
  { title: "Clear & Consistent Communication", description: "No ambiguity. No gaps. Every partner knows exactly where things stand." },
  { title: "Transparency & Accountability", description: "We report what is real — performance, challenges and outcomes — without spin." },
  { title: "Integrity in Commitments", description: "We only commit to what we can deliver. And we deliver what we commit to." },
  { title: "Commitment to Excellence", description: "Every system we build is designed to perform — not to satisfy a scope of work." },
];

export function VisionValuesSection() {
  return (
    <section className="relative bg-[#0B1F3B] py-24 px-6 overflow-hidden">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Vision */}
        <div className="max-w-3xl mb-20">
          <BlurFade delay={0.05}>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
              Vision
            </span>
          </BlurFade>
          <BlurFade delay={0.14}>
            <p className="text-2xl md:text-3xl lg:text-[36px] font-bold text-white leading-[1.3] tracking-tight">
              To become the world&apos;s most trusted commerce operations
              partner for brands building revenue through live and social
              commerce.
            </p>
          </BlurFade>
        </div>

        {/* Divider */}
        <BlurFade delay={0.22}>
          <div className="w-full h-px bg-white/[0.08] mb-20" />
        </BlurFade>

        {/* Core Values */}
        <div>
          <BlurFade delay={0.28}>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-8 block">
              Core Values
            </span>
          </BlurFade>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((value, i) => (
              <BlurFade key={value.title} delay={0.3 + i * 0.08}>
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 h-full hover:bg-white/[0.06] transition-colors duration-300">
                  <div className="w-1 h-6 bg-[#2FB7A8] rounded-full mb-5" />
                  <h3 className="text-white font-semibold text-base mb-2.5 leading-snug">
                    {value.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
