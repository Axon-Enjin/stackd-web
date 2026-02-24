"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";

const TEAM = [
    {
        initials: "TF",
        name: "Team Founder",
        role: "Chief Executive Officer",
        bio: "Leads Stackd's overall strategy and client partnerships. Deep background in live commerce operations and direct-to-consumer brand growth.",
        color: "#2F80ED",
    },
    {
        initials: "CO",
        name: "Co-Founder",
        role: "Chief Operations Officer",
        bio: "Oversees live commerce execution, creator network management, and day-to-day operational delivery for all brand partners.",
        color: "#2FB7A8",
    },
    {
        initials: "GP",
        name: "Growth Partner",
        role: "Head of Creator & Affiliates",
        bio: "Builds and manages TikTok creator and affiliate programs — from outreach and onboarding through to performance optimization.",
        color: "#0B1F3B",
    },
];

export function TeamSection() {
    const gridRef = useRef(null);
    const isInView = useInView(gridRef, { once: true, margin: "-60px" });

    return (
        <section id="team" className="bg-[#F7F9FC] py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-2xl mb-14">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            The Team
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-3">
                            The people behind the operations
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed">
                            A focused team of operators — not marketers.
                        </p>
                    </BlurFade>
                </div>

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {TEAM.map((member, i) => (
                        <motion.div
                            key={member.name}
                            className="bg-white border border-[#E8ECF2] rounded-xl p-7 hover:shadow-md transition-shadow duration-300"
                            initial={{ opacity: 0, y: 24 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.12,
                                ease: [0.21, 0.47, 0.32, 0.98],
                            }}
                        >
                            {/* Avatar */}
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg mb-5"
                                style={{ backgroundColor: member.color }}
                            >
                                {member.initials}
                            </div>

                            <div className="mb-3">
                                <p className="text-[#0B1F3B] font-semibold text-base leading-snug">
                                    {member.name}
                                </p>
                                <p className="text-[#2FB7A8] text-xs font-medium mt-0.5 tracking-wide">
                                    {member.role}
                                </p>
                            </div>

                            <p className="text-[#1A1A1A]/55 text-sm leading-relaxed">
                                {member.bio}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
