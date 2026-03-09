"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import { AlertCircle } from "lucide-react";

const PAIN_POINTS = [
    "Lives are inconsistent or poorly structured",
    "Creators don’t convert into real revenue",
    "Affiliate programs go unmanaged",
    "Ad spend is disconnected from live selling",
    "Internal teams lack live commerce experience",
];

export function PainPointsSection() {
    return (
        <section className="bg-white py-16 px-6 border-b border-black/[0.04]">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-center">
                    {/* Left Column: Heading and Copy */}
                    <div className="lg:col-span-5">
                        <BlurFade delay={0.1}>
                            <span className="mb-4 block text-xs font-semibold tracking-[0.18em] uppercase text-[#F0002A]">
                                The Problem
                            </span>
                        </BlurFade>
                        <BlurFade delay={0.2}>
                            <h2 className="mb-6 text-3xl md:text-4xl lg:text-[42px] font-bold leading-[1.12] tracking-tight text-[#0B1F3B]">
                                Why TikTok Shop fails for most brands
                            </h2>
                        </BlurFade>
                        <BlurFade delay={0.3}>
                            <p className="mb-6 text-base md:text-lg leading-relaxed text-[#1A1A1A]/70">
                                Many brands enter TikTok expecting it to behave like paid ads or traditional e-commerce. <span className="font-semibold text-[#0B1F3B]">It doesn’t.</span>
                            </p>
                        </BlurFade>
                        <BlurFade delay={0.4}>
                            <div className="border-l-2 border-[#2F80ED] pl-5">
                                <p className="text-base md:text-lg font-medium leading-relaxed text-[#0B1F3B]">
                                    TikTok is a live commerce platform that depends on execution, consistency and coordination.
                                </p>
                            </div>
                        </BlurFade>
                    </div>

                    {/* Right Column: Pain Points */}
                    <div className="lg:col-span-7 lg:pl-10">
                        <div className="flex flex-col gap-3">
                            {PAIN_POINTS.map((point, index) => (
                                <BlurFade key={index} delay={0.3 + index * 0.1}>
                                    <div className="group flex items-center gap-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 px-5 py-3.5 transition-all duration-300 hover:border-[#F0002A]/20 hover:shadow-[0_8px_30px_rgba(240,0,42,0.06)] hover:bg-white max-w-md">
                                        <div className="flex shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-black/[0.04] p-2 text-[#F0002A] group-hover:bg-[#F0002A]/10 transition-colors">
                                            <AlertCircle size={18} strokeWidth={2.5} />
                                        </div>
                                        <h3 className="text-[15px] font-medium text-[#0B1F3B] leading-tight">
                                            {point}
                                        </h3>
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
