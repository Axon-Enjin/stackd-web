"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { HeroDashboard } from "@/components/magicui/HeroDashboard";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen bg-[#0B1F3B] flex items-center overflow-hidden pt-16">
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
                className="absolute top-1/2 left-0 -translate-y-1/2 w-[50vw] h-[70vh] opacity-8 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse at left center, #2F80ED 0%, transparent 65%)",
                    opacity: 0.08,
                }}
            />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 lg:py-28 w-full">
                {/* Two-column layout on desktop */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* ── Left: Content ── */}
                    <div>
                        {/* Badge */}
                        <BlurFade delay={0.05}>
                            <div className="inline-flex items-center gap-2 bg-white/[0.07] border border-white/[0.12] rounded-full px-4 py-1.5 mb-8">
                                <motion.span
                                    className="w-1.5 h-1.5 rounded-full bg-[#2FB7A8] shrink-0"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <span className="text-white/70 text-sm font-medium">
                                    TikTok Shop Revenue Operations
                                </span>
                            </div>
                        </BlurFade>

                        {/* Headline */}
                        <BlurFade delay={0.15}>
                            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-bold text-white leading-[1.12] tracking-tight mb-6">
                                We scale TikTok Shop revenue for brands through live commerce
                                operations, creator networks and performance optimization.
                            </h1>
                        </BlurFade>

                        {/* Sub-headline */}
                        <BlurFade delay={0.28}>
                            <p className="text-base md:text-lg text-white/55 leading-relaxed mb-4">
                                Stackd operates the systems and execution behind TikTok live
                                commerce — helping brands launch, manage and scale sales without
                                building an internal team.
                            </p>
                        </BlurFade>

                        {/* Supporting line */}
                        <BlurFade delay={0.38}>
                            <p className="text-sm text-[#2FB7A8] font-medium mb-10">
                                Built for direct-to-consumer brands already selling — or ready
                                to sell — on TikTok Shop.
                            </p>
                        </BlurFade>

                        {/* CTAs */}
                        <BlurFade delay={0.48}>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.a
                                    href="#contact"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2F80ED] text-white font-semibold rounded-md text-sm tracking-wide shadow-lg shadow-[#2F80ED]/25"
                                    whileHover={{ scale: 1.03, backgroundColor: "#2570d4" }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    BOOK A STRATEGY CALL
                                    <ArrowRight size={15} />
                                </motion.a>

                                <motion.a
                                    href="#how-we-work"
                                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/20 text-white/65 hover:text-white hover:border-white/40 font-medium rounded-md text-sm transition-colors duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    How we work
                                </motion.a>
                            </div>
                        </BlurFade>

                        {/* Stats row */}
                        <BlurFade delay={0.58}>
                            <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row gap-6 sm:gap-10">
                                {[
                                    { value: "100%", label: "Performance aligned" },
                                    { value: "0", label: "Internal hires needed" },
                                    { value: "Full-stack", label: "Live commerce ops" },
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-2xl font-bold text-white">
                                            {stat.value}
                                        </div>
                                        <div className="text-white/35 text-xs mt-0.5">
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
