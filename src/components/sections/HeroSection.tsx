"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { HeroDashboard } from "@/components/magicui/HeroDashboard";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0B1F3B] pt-16">
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 lg:py-28">
        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Left: Content ── */}
          <div>
            {/* Badge */}
            <BlurFade delay={0.05}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.07] px-4 py-1.5">
                <motion.span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2FB7A8]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-white/70">
                  TikTok Shop Revenue Operations
                </span>
              </div>
            </BlurFade>

            {/* Headline */}
            <BlurFade delay={0.15}>
              <h1 className="mb-6 text-3xl leading-[1.12] font-bold tracking-tight text-white sm:text-4xl lg:text-[48px]">
                We scale TikTok Shop revenue for brands through live commerce
                operations, creator networks and performance optimization.
              </h1>
            </BlurFade>

            {/* Sub-headline */}
            <BlurFade delay={0.28}>
              <p className="mb-4 text-base leading-relaxed text-white/55 md:text-lg">
                Stackd operates the systems and execution behind TikTok live
                commerce — helping brands launch, manage and scale sales without
                building an internal team.
              </p>
            </BlurFade>

            {/* Supporting line */}
            <BlurFade delay={0.38}>
              <p className="mb-10 text-sm font-medium text-[#2FB7A8]">
                Built for direct-to-consumer brands already selling — or ready
                to sell — on TikTok Shop.
              </p>
            </BlurFade>

            {/* CTAs */}
            <BlurFade delay={0.48}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <motion.a
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2F80ED] px-7 py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#2F80ED]/25"
                  whileHover={{ scale: 1.03, backgroundColor: "#2570d4" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  BOOK A STRATEGY CALL
                  <ArrowRight size={15} />
                </motion.a>

                <motion.a
                  href="/#how-we-work"
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-7 py-3.5 text-sm font-medium text-white/65 transition-colors duration-200 hover:border-white/40 hover:text-white"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  How we work
                </motion.a>
              </div>
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

          {/* ── Right: Animated Dashboard ── */}
          <HeroDashboard />
        </div>
      </div>
    </section>
  );
}
