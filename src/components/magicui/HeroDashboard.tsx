"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

const BARS = [38, 52, 44, 67, 58, 79, 95];
const MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

const MINI_STATS = [
    { label: "Live Sessions", value: "48/mo" },
    { label: "Active Creators", value: "124" },
    { label: "Avg. Conversion", value: "6.2%" },
    { label: "Affiliate Orders", value: "1,847" },
];

export function HeroDashboard() {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="relative hidden lg:flex items-center justify-center">
            {/* Main dashboard card */}
            <motion.div
                className="relative w-full max-w-sm bg-white/[0.04] border border-white/[0.1] rounded-2xl p-6 shadow-2xl backdrop-blur-sm"
                initial={{ opacity: 0, x: 40, y: 10 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
                {/* Card header */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 rounded-full bg-[#2FB7A8]"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="text-white/60 text-xs font-medium tracking-wide">
                            Live Operations
                        </span>
                    </div>
                    <span className="text-white/25 text-[10px]">Updated now</span>
                </div>

                {/* Primary metric */}
                <div className="mb-6">
                    <div className="text-white/35 text-[11px] mb-1 tracking-wide uppercase">
                        Monthly Revenue
                    </div>
                    <div className="flex items-baseline gap-2.5">
                        <span className="text-white text-[32px] font-bold tracking-tight leading-none">
                            $247K
                        </span>
                        <span className="text-[#2FB7A8] text-sm font-semibold">↑ 34%</span>
                    </div>
                </div>

                {/* Bar chart */}
                <div className="mb-2">
                    <div className="flex items-end gap-[5px] h-[68px]">
                        {BARS.map((h, i) => (
                            <motion.div
                                key={i}
                                className="flex-1 rounded-t relative overflow-hidden"
                                style={{ height: `${h}%`, transformOrigin: "bottom" }}
                                initial={{ scaleY: 0 }}
                                animate={inView ? { scaleY: 1 } : {}}
                                transition={{
                                    duration: 0.45,
                                    delay: 0.55 + i * 0.07,
                                    ease: [0.21, 0.47, 0.32, 0.98],
                                }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            i === BARS.length - 1
                                                ? "#2F80ED"
                                                : "rgba(47,128,237,0.25)",
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex gap-[5px] mt-1.5">
                        {MONTHS.map((m) => (
                            <div
                                key={m}
                                className="flex-1 text-center text-white/25 text-[9px]"
                            >
                                {m}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-white/[0.07]" />

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                    {MINI_STATS.map((s) => (
                        <div key={s.label}>
                            <div className="text-white/30 text-[10px] tracking-wide uppercase mb-0.5">
                                {s.label}
                            </div>
                            <div className="text-white/85 font-semibold text-sm">{s.value}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Floating notification card */}
            <motion.div
                className="absolute -bottom-8 -left-4 bg-[#0f2a4a] border border-white/[0.1] rounded-xl px-4 py-3 shadow-xl max-w-[200px]"
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.85 }}
            >
                <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-[#2FB7A8]/15 flex items-center justify-center shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[#2FB7A8]" />
                    </div>
                    <div>
                        <div className="text-white/35 text-[9px] uppercase tracking-wide mb-0.5">
                            Affiliate
                        </div>
                        <div className="text-white text-xs font-medium leading-snug">
                            12 new creators activated this week
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating revenue badge */}
            <motion.div
                className="absolute -top-6 -right-4 bg-[#2F80ED]/10 border border-[#2F80ED]/25 rounded-lg px-3 py-2 shadow-lg"
                initial={{ opacity: 0, y: -12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.65 }}
            >
                <div className="text-[10px] text-white/40 mb-0.5">Live session</div>
                <div className="text-white font-semibold text-sm">🔴 LIVE · 2.4K viewers</div>
            </motion.div>
        </div>
    );
}
