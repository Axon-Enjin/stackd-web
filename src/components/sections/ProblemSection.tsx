"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";

const PAIN_POINTS = [
    "Lives are inconsistent or poorly structured",
    "Creators don't convert into real revenue",
    "Affiliate programs go unmanaged",
    "Ad spend is disconnected from live selling",
    "Internal teams lack live commerce experience",
];

export function ProblemSection() {
    const listRef = useRef(null);
    const listInView = useInView(listRef, { once: true, margin: "-40px" });

    return (
        <section className="bg-[#F7F9FC] py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl">
                    {/* Label */}
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            The Problem
                        </span>
                    </BlurFade>

                    {/* Heading */}
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-6">
                            Why TikTok Shop fails for most brands
                        </h2>
                    </BlurFade>

                    {/* Opening copy */}
                    <BlurFade delay={0.22}>
                        <p className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mb-4">
                            Many brands enter TikTok expecting it to behave like paid ads or
                            traditional e-commerce. It doesn&apos;t.
                        </p>
                        <p className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mb-8">
                            TikTok is a live commerce platform that depends on execution,
                            consistency and coordination.
                        </p>
                    </BlurFade>

                    {/* Animated bullet list */}
                    <div ref={listRef} className="space-y-3 mb-10">
                        {PAIN_POINTS.map((point, i) => (
                            <motion.div
                                key={point}
                                className="flex items-start gap-3"
                                initial={{ opacity: 0, x: -16 }}
                                animate={
                                    listInView
                                        ? { opacity: 1, x: 0 }
                                        : { opacity: 0, x: -16 }
                                }
                                transition={{
                                    duration: 0.45,
                                    delay: 0.1 + i * 0.1,
                                    ease: [0.21, 0.47, 0.32, 0.98],
                                }}
                            >
                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#2FB7A8] shrink-0" />
                                <span className="text-[#1A1A1A]/80 text-base md:text-[17px] leading-relaxed">
                                    {point}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Closing callout */}
                    <BlurFade delay={0.7}>
                        <div className="border-l-2 border-[#2FB7A8] pl-5">
                            <p className="text-[#0B1F3B] font-semibold text-base md:text-lg leading-snug mb-1">
                                TikTok is not an ad platform. It is an operations platform.
                            </p>
                            <p className="text-[#1A1A1A]/60 text-sm md:text-base leading-relaxed">
                                Success on TikTok Shop depends less on viral moments and more on
                                consistent execution, coordination and management.
                            </p>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </section>
    );
}
