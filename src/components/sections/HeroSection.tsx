"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { PhoneMockup3D } from "@/components/magicui/PhoneMockup3D";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0B1F3B] pt-16 px-6">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
        }}
      />

      {/* Radial gradient glow — left */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-[70vh] w-[50vw] -translate-y-1/2 opacity-8"
        style={{
          background:
            "radial-gradient(ellipse at left center, #2F80ED 0%, transparent 65%)",
          opacity: 0.08,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl py-24 lg:py-28">
        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: Content ── */}
          <div>
            {/* Headline */}
            <BlurFade delay={0.1}>
              <h1 className="mb-6 text-3xl leading-[1.08] font-bold tracking-tight text-white sm:text-4xl lg:text-[50px]">
                Own TikTok Shop as a revenue channel —{" "}
                <span className="text-white/60">
                  not a marketing experiment.
                </span>
              </h1>
            </BlurFade>

            {/* Sub-headline */}
            <BlurFade delay={0.22}>
              <p className="mb-5 text-base leading-relaxed text-white/55 md:text-lg">
                Stackd partners with established consumer brands to build and
                operate the live commerce, creator and performance systems
                behind TikTok Shop — as a fully accountable revenue function.
              </p>
            </BlurFade>

            {/* Qualification line */}
            <BlurFade delay={0.32}>
              <p className="mb-10 text-sm font-medium text-[#2FB7A8] italic">
                Best suited for growing consumer brands ready to treat TikTok
                Shop as a serious revenue channel.
              </p>
            </BlurFade>

            {/* CTA */}
            <BlurFade delay={0.42}>
              <motion.a
                href="/book"
                className="inline-flex items-center gap-2 rounded-md bg-[#2F80ED] px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#2F80ED]/30"
                whileHover={{ scale: 1.03, backgroundColor: "#2570d4" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Request a Strategy Conversation
                <ArrowRight size={15} />
              </motion.a>
            </BlurFade>

            {/* Stats row */}
            <BlurFade delay={0.58}>
              <div className="mt-12 flex flex-col gap-6 border-t border-white/[0.08] pt-8 sm:flex-row sm:gap-10">
                {[
                  { value: "100%", label: "Performance aligned" },
                  { value: "0", label: "Internal hires needed" },
                  { value: "Full-stack", label: "Live commerce ops" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-xs text-white/35">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>

          {/* ── Right: 3D Phone Mockup ── */}
          <PhoneMockup3D />
        </div>
      </div>
    </section>
  );
}
