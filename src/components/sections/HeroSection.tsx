"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { PhoneMockup3D } from "@/components/magicui/PhoneMockup3D";
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
                        {/* Headline */}
                        <BlurFade delay={0.1}>
                            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-bold text-white leading-[1.08] tracking-tight mb-6">
                                Own TikTok Shop as a revenue channel —{" "}
                                <span className="text-white/60">not a marketing experiment.</span>
                            </h1>
                        </BlurFade>

                        {/* Sub-headline */}
                        <BlurFade delay={0.22}>
                            <p className="text-base md:text-lg text-white/55 leading-relaxed mb-5">
                                Stackd partners with established consumer brands to build and
                                operate the live commerce, creator and performance systems behind
                                TikTok Shop — as a fully accountable revenue function.
                            </p>
                        </BlurFade>

                        {/* Qualification line */}
                        <BlurFade delay={0.32}>
                            <p className="text-sm text-[#2FB7A8] font-medium italic mb-10">
                                Best suited for growing consumer brands ready to treat TikTok
                                Shop as a serious revenue channel.
                            </p>
                        </BlurFade>

                        {/* CTA */}
                        <BlurFade delay={0.42}>
                            <motion.a
                                href="#contact"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2F80ED] text-white font-semibold rounded-md text-sm tracking-wide shadow-lg shadow-[#2F80ED]/30"
                                whileHover={{ scale: 1.03, backgroundColor: "#2570d4" }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                                Request a Strategy Conversation
                                <ArrowRight size={15} />
                            </motion.a>
                        </BlurFade>
                    </div>

                    {/* ── Right: 3D Phone Mockup ── */}
                    <PhoneMockup3D />
                </div>
            </div>
        </section>
    );
}
