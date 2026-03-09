"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import { HeroDashboard } from "@/components/magicui/HeroDashboard";

export function ProblemSection() {
    return (
        <section className="bg-white py-24 px-6 overflow-hidden relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
                        <BlurFade delay={0.2} className="w-full flex justify-center">
                            <HeroDashboard />
                        </BlurFade>
                    </div>

                    <div className="order-1 lg:order-2 max-w-3xl">
                        <BlurFade delay={0.05}>
                            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                                The Problem
                            </span>
                        </BlurFade>

                        <BlurFade delay={0.12}>
                            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-8">
                                TikTok Shop Fails When No One Owns It
                            </h2>
                        </BlurFade>

                        <BlurFade delay={0.22}>
                            <p className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mb-6">
                                Most brands approach TikTok Shop as a content initiative.
                                They test creators. They attempt lives. They experiment with ads.
                            </p>
                        </BlurFade>

                        <BlurFade delay={0.32}>
                            <p className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mb-6">
                                But without operational ownership, performance becomes inconsistent —
                                and internal teams lose focus.
                            </p>
                        </BlurFade>

                        <BlurFade delay={0.42}>
                            <div className="border-l-2 border-[#2F80ED] pl-5 mb-6">
                                <p className="text-[#0B1F3B] font-semibold text-base md:text-lg leading-snug mb-2">
                                    TikTok Shop is not a visibility problem.
                                </p>
                                <p className="text-[#0B1F3B] font-semibold text-base md:text-lg leading-snug">
                                    It is an execution and accountability problem.
                                </p>
                            </div>
                        </BlurFade>

                        <BlurFade delay={0.52}>
                            <p className="text-[#1A1A1A]/50 text-base md:text-lg leading-relaxed">
                                When no one owns the system, revenue stalls.
                            </p>
                        </BlurFade>
                    </div>
                </div>
            </div>
        </section>
    );
}
