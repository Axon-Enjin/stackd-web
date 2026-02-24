"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";

const POINTS = [
    {
        label: "Operational experience",
        text: "Our team has operated within advanced live-commerce environments and applies those learnings to brands entering TikTok Shop today.",
    },
    {
        label: "Revenue partner, not vendor",
        text: "Stackd is not a marketing agency. We are a revenue operations partner focused on outcomes, not impressions.",
    },
    {
        label: "Built for scale",
        text: "We handle live execution, affiliate coordination, optimization, and revenue tracking — so you can grow TikTok Shop without building an internal team.",
    },
];

const METRICS = [
    { value: "Live", label: "Commerce ops" },
    { value: "Affiliate", label: "Network mgmt" },
    { value: "Analytics", label: "Revenue tracking" },
];

export function DifferentiatorSection() {
    const metricsRef = useRef(null);
    const metricsInView = useInView(metricsRef, { once: true, margin: "-60px" });

    return (
        <section className="bg-[#0B1F3B] py-24 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Left */}
                    <div>
                        <BlurFade delay={0.05}>
                            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                                Why Stackd
                            </span>
                        </BlurFade>
                        <BlurFade delay={0.14}>
                            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight tracking-tight mb-10">
                                We run the engine behind revenue.
                            </h2>
                        </BlurFade>

                        <div className="space-y-8">
                            {POINTS.map((point, i) => (
                                <BlurFade key={point.label} delay={0.1 + i * 0.12}>
                                    <div className="border-l border-white/15 pl-6">
                                        <p className="text-white font-semibold text-base mb-1.5">
                                            {point.label}
                                        </p>
                                        <p className="text-white/50 text-sm leading-relaxed">
                                            {point.text}
                                        </p>
                                    </div>
                                </BlurFade>
                            ))}
                        </div>
                    </div>

                    {/* Right — visual operations stack */}
                    <div className="relative" ref={metricsRef}>
                        {/* Background glow */}
                        <div
                            className="absolute inset-0 rounded-2xl pointer-events-none"
                            style={{
                                background:
                                    "radial-gradient(ellipse at 50% 50%, rgba(47,128,237,0.12) 0%, transparent 70%)",
                            }}
                        />

                        <div className="relative space-y-3">
                            {[
                                {
                                    label: "Live Commerce Execution",
                                    status: "Active",
                                    pct: 92,
                                    color: "#2F80ED",
                                },
                                {
                                    label: "Creator & Affiliate Network",
                                    status: "Active",
                                    pct: 78,
                                    color: "#2FB7A8",
                                },
                                {
                                    label: "Performance Analytics",
                                    status: "Active",
                                    pct: 85,
                                    color: "#2F80ED",
                                },
                                {
                                    label: "Revenue Operations",
                                    status: "Active",
                                    pct: 70,
                                    color: "#2FB7A8",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    className="bg-white/[0.04] border border-white/[0.09] rounded-xl px-5 py-4"
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={metricsInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.12,
                                        ease: [0.21, 0.47, 0.32, 0.98],
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-white/80 text-sm font-medium">
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] text-[#2FB7A8] font-semibold tracking-wide bg-[#2FB7A8]/10 px-2 py-0.5 rounded-full">
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: item.color }}
                                            initial={{ width: 0 }}
                                            animate={
                                                metricsInView ? { width: `${item.pct}%` } : {}
                                            }
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.3 + i * 0.1,
                                                ease: [0.21, 0.47, 0.32, 0.98],
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            ))}

                            {/* Uptime badge */}
                            <motion.div
                                className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl px-5 py-3"
                                initial={{ opacity: 0 }}
                                animate={metricsInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.65 }}
                            >
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-[#2FB7A8] shrink-0"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.6, repeat: Infinity }}
                                />
                                <span className="text-white/40 text-xs">
                                    All systems operational · Updated continuously
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
