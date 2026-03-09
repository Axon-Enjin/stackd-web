"use client";

import { BlurFade } from "@/components/magicui/BlurFade";

export function WhyStackdExistsSection() {
  return (
    <section className="relative bg-[#0B1F3B] py-24 px-6 overflow-hidden">
      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Dot accent — top right */}
      <div
        className="absolute top-0 right-0 w-[360px] h-[360px] pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <BlurFade delay={0.05}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-8">
            Our Conviction
          </p>
        </BlurFade>

        <BlurFade delay={0.12}>
          <h2 className="text-3xl md:text-4xl lg:text-[46px] font-bold text-white leading-tight tracking-tight mb-10">
            Why Stackd Exists
          </h2>
        </BlurFade>

        <div className="space-y-0">
          <BlurFade delay={0.22}>
            <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed">
              TikTok Shop is not a content problem.
            </p>
            <p className="text-xl md:text-2xl text-white font-bold leading-relaxed mb-8">
              It&apos;s an ownership problem.
            </p>
          </BlurFade>

          <BlurFade delay={0.34}>
            <div className="w-12 h-px bg-white/15 mx-auto mb-8" />
          </BlurFade>

          <BlurFade delay={0.42}>
            <p className="text-lg text-white/55 leading-relaxed mb-2">
              Most brands treat it like a social experiment.
            </p>
            <p className="text-lg text-white font-semibold leading-relaxed">
              We treat it like a revenue department.
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
