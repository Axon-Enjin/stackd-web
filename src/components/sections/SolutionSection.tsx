"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { MagicCard } from "@/components/magicui/magic-card";
import { Tv2, Users, BarChart3, TrendingUp } from "lucide-react";

const PILLARS = [
    {
        icon: Tv2,
        title: "Live Commerce Execution",
        description:
            "We help brands structure and operate live selling — including planning schedules, preparing show flow, coordinating hosts and managing performance.",
        color: "#2F80ED",
    },
    {
        icon: Users,
        title: "Creator & Affiliate Engine",
        description:
            "We build and manage your TikTok creator and affiliate program — including outreach, onboarding, coordination and performance tracking.",
        color: "#2FB7A8",
    },
    {
        icon: BarChart3,
        title: "Content & Performance Optimization",
        description:
            "We analyze performance data and align content and advertising with live commerce to improve conversion and efficiency over time.",
        color: "#2F80ED",
    },
    {
        icon: TrendingUp,
        title: "Revenue Operations",
        description:
            "We track performance, identify opportunities and guide brands toward sustainable TikTok Shop growth.",
        color: "#2FB7A8",
    },
];

export function SolutionSection() {
    const gridRef = useRef(null);
    const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

    return (
        <section className="bg-white py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="max-w-2xl mb-14">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            The Stackd System
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight">
                            How Stackd grows revenue
                        </h2>
                    </BlurFade>
                </div>

                {/* Pillars grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                >
                    {PILLARS.map((pillar, i) => {
                        const Icon = pillar.icon;
                        return (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: 24 }}
                                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.5,
                                    delay: i * 0.1,
                                    ease: [0.21, 0.47, 0.32, 0.98],
                                }}
                                whileHover={{ y: -3 }}
                            >
                                <MagicCard
                                    className="h-full bg-[#F7F9FC] border border-[#E8ECF2] rounded-xl p-7 cursor-default transition-shadow duration-300 hover:shadow-lg hover:border-[#d0d9e8]"
                                    gradientColor={`${pillar.color}10`}
                                    gradientSize={260}
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center mb-5"
                                        style={{ backgroundColor: `${pillar.color}15` }}
                                    >
                                        <Icon size={20} style={{ color: pillar.color }} />
                                    </div>
                                    <h3 className="text-[#0B1F3B] font-semibold text-lg mb-3 leading-snug">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-[#1A1A1A]/55 text-sm leading-relaxed">
                                        {pillar.description}
                                    </p>
                                </MagicCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
