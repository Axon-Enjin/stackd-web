"use client";

import { motion } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { Ripple } from "@/components/magicui/ripple";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
    return (
        <section id="contact" className="relative bg-[#F7F9FC] py-32 px-6 overflow-hidden">
            {/* Ripple visual centered behind content */}
            <div className="absolute inset-0 flex items-center justify-start pointer-events-none">
                <div className="relative w-[520px] h-[520px] -ml-20 opacity-60">
                    <Ripple
                        mainCircleSize={130}
                        mainCircleOpacity={0.15}
                        numCircles={7}
                        color="11, 31, 59"
                    />
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="max-w-2xl">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            Let&apos;s Talk
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.14}>
                        <h2 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-5">
                            If TikTok Shop is a channel you want to take seriously this year,
                            let&apos;s have a conversation.
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.24}>
                        <p className="text-[#1A1A1A]/55 text-base md:text-lg leading-relaxed mb-10">
                            No commitments, no pitch deck. Just a direct conversation about
                            whether Stackd is the right operations partner for your brand.
                        </p>
                    </BlurFade>
                    <BlurFade delay={0.34}>
                        <motion.a
                            href="https://calendly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0B1F3B] text-white font-semibold rounded-md text-sm tracking-wide shadow-xl shadow-[#0B1F3B]/15"
                            whileHover={{ scale: 1.03, backgroundColor: "#0f2a4d" }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            BOOK A STRATEGY CALL
                            <ArrowRight size={15} />
                        </motion.a>
                    </BlurFade>
                </div>
            </div>
        </section>
    );
}
