"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";
import {
    Search,
    Map,
    Zap,
    TrendingUp,
    AreaChart,
} from "lucide-react";

const STEPS = [
    {
        number: "01",
        icon: Search,
        title: "Audit",
        description:
            "We review your TikTok Shop, existing content, and growth goals to identify the gaps.",
    },
    {
        number: "02",
        icon: Map,
        title: "Strategy",
        description:
            "We design a tailored live commerce and affiliate growth plan aligned to your brand.",
    },
    {
        number: "03",
        icon: Zap,
        title: "Launch",
        description:
            "We implement live and creator operations — structuring your show flow and activating your affiliate network.",
    },
    {
        number: "04",
        icon: TrendingUp,
        title: "Optimize",
        description:
            "We continuously analyze data and improve conversion, efficiency, and creator performance.",
    },
    {
        number: "05",
        icon: AreaChart,
        title: "Scale",
        description:
            "We grow predictable, compounding TikTok Shop revenue as a serious channel for your business.",
    },
];

export function ProcessSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <section id="how-we-work" className="bg-white py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-2xl mb-16">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            The Process
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-3">
                            How we work
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed">
                            TikTok Shop success is iterative. We work with brands step-by-step,
                            improving performance as data accumulates.
                        </p>
                    </BlurFade>
                </div>

                {/* Steps — horizontal desktop / vertical mobile */}
                <div ref={ref} className="relative">
                    {/* Desktop connector line */}
                    <div className="hidden lg:block absolute top-[33px] left-[33px] right-[33px] h-px bg-gradient-to-r from-[#E8ECF2] via-[#2F80ED]/30 to-[#E8ECF2]" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={step.number}
                                    className="relative group"
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.12,
                                        ease: [0.21, 0.47, 0.32, 0.98],
                                    }}
                                >
                                    {/* Step circle + connector */}
                                    <div className="flex items-center gap-4 lg:block mb-5">
                                        <motion.div
                                            className="relative z-10 w-[66px] h-[66px] rounded-full border border-[#E8ECF2] bg-white flex flex-col items-center justify-center gap-0.5 shrink-0 group-hover:border-[#2F80ED]/40 group-hover:shadow-md transition-all duration-300"
                                            whileHover={{ scale: 1.06 }}
                                        >
                                            <Icon
                                                size={18}
                                                className="text-[#2F80ED] group-hover:text-[#2570d4] transition-colors"
                                            />
                                            <span className="text-[#0B1F3B]/40 text-[9px] font-bold tracking-wide">
                                                {step.number}
                                            </span>
                                        </motion.div>

                                        {/* Mobile connector line */}
                                        <div className="flex-1 h-px bg-gradient-to-r from-[#E8ECF2] to-transparent lg:hidden" />
                                    </div>

                                    <div className="lg:mt-5">
                                        <h3 className="text-[#0B1F3B] font-semibold text-base mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-[#1A1A1A]/50 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
