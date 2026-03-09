"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import { MagicCard } from "@/components/magicui/magic-card";
import { Linkedin } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Jay Buenaflor",
    role: "CEO",
    bio: [
      "Jay Buenaflor is a leadership coach and business operator with nearly two decades of experience helping organizations scale through stronger teams, clearer decisions and disciplined execution.",
      "Before founding Stackd, Jay spent ten years in leadership roles within a fast-growing e-commerce cosmetics company, including four years as Chief Operating Officer.",
      "During that time, he helped build the operational systems and leadership structure needed to support growth across multiple channels, including the early adoption of TikTok commerce.",
      "Jay founded Stackd to bring structured revenue operations to TikTok Shop — helping brands move beyond experimentation and operate live commerce as a serious business channel.",
    ],
    highlights: null as string[] | null,
    linkedin: "#",
  },
  {
    name: "Dette Tejada",
    role: "Commerce Operations",
    bio: [
      "Dette specializes in building the operational systems behind successful TikTok Shop growth.",
      "With more than five years of hands-on experience in the TikTok ecosystem, she has led e-commerce and TikTok Shop operations for multiple consumer brands across beauty, apparel and general e-commerce categories.",
      "In previous roles as E-Commerce Head, she oversaw both marketing strategy and operational execution, helping brands transform TikTok from a marketing channel into a primary revenue driver.",
      "Her expertise lies in designing the infrastructure required to scale TikTok Shop consistently — including creator ecosystems, affiliate activation, live selling operations and performance tracking systems.",
    ],
    highlights: [
      "5+ years working within the TikTok ecosystem",
      "Led TikTok Shop growth for multiple consumer brands",
      "Built affiliate and creator ecosystems from scratch",
      "Designed live selling operations and inventory workflows",
      "Implemented ROAS and performance tracking systems",
    ],
    linkedin: "#",
  },
];

const COMBINED_STATS = [
  "29 years of combined leadership and operational experience",
  "Leadership roles across e-commerce and digital commerce environments",
  "Hands-on experience supporting TikTok-based commerce operations",
  "Executive coaching and advisory work with founders and leadership teams",
  "Specialized focus on operational systems behind live commerce",
];

export function TeamSection() {
    return (
        <section id="team" className="bg-[#F7F9FC] py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="max-w-3xl mb-14">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            Our Team
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-5">
                            The Team Behind Stackd
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.2}>
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed mb-2">
                            Stackd is built by operators who believe TikTok Shop succeeds
                            when execution is owned, structured and consistent.
                        </p>
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed">
                            Our team combines leadership experience, operational discipline
                            and hands-on knowledge of live commerce systems.
                        </p>
                    </BlurFade>
                </div>

                {/* Profiles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {TEAM_MEMBERS.map((member, i) => (
                        <BlurFade key={member.name} delay={0.15 + i * 0.12}>
                            <MagicCard
                                className="bg-white border border-[#E8ECF2] rounded-xl p-8 h-full cursor-default hover:shadow-md transition-shadow duration-300"
                                gradientColor="#2F80ED08"
                                gradientSize={300}
                            >
                                {/* Photo + name row */}
                                <div className="flex items-start gap-5 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0B1F3B]/10 to-[#2F80ED]/10 border border-[#E8ECF2] flex items-center justify-center shrink-0">
                                        <span className="text-[#0B1F3B]/30 text-xl font-bold">
                                            {member.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-[#0B1F3B] font-bold text-xl leading-snug">
                                            {member.name}
                                        </h3>
                                        <p className="text-[#2F80ED] text-sm font-medium mt-0.5">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Bio paragraphs */}
                                <div className="space-y-3 mb-5">
                                    {member.bio.map((para, j) => (
                                        <p key={j} className="text-[#1A1A1A]/60 text-sm leading-relaxed">
                                            {para}
                                        </p>
                                    ))}
                                </div>

                                {/* Experience highlights (Dette only) */}
                                {member.highlights && (
                                    <div className="mt-6 pt-5 border-t border-[#E8ECF2]">
                                        <p className="text-[#0B1F3B] text-xs font-semibold tracking-[0.12em] uppercase mb-3">
                                            Experience Highlights
                                        </p>
                                        <ul className="space-y-1.5">
                                            {member.highlights.map((h) => (
                                                <li key={h} className="flex items-start gap-2.5 text-[#1A1A1A]/60 text-sm">
                                                    <span className="mt-2 w-1 h-1 rounded-full bg-[#2FB7A8] shrink-0" />
                                                    {h}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* LinkedIn */}
                                <div className="mt-6 pt-4 border-t border-[#E8ECF2]">
                                    <a
                                        href={member.linkedin}
                                        className="inline-flex items-center gap-2 text-[#0B1F3B]/40 hover:text-[#2F80ED] text-xs font-medium transition-colors duration-200"
                                        aria-label={`${member.name} on LinkedIn`}
                                    >
                                        <Linkedin size={13} />
                                        LinkedIn
                                    </a>
                                </div>
                            </MagicCard>
                        </BlurFade>
                    ))}
                </div>

                {/* Combined credentials block */}
                <BlurFade delay={0.4}>
                    <div className="bg-[#0B1F3B] rounded-xl p-8 mb-8">
                        <p className="text-white/40 text-xs font-semibold tracking-[0.16em] uppercase mb-5">
                            Stackd Leadership Experience
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2">
                            {COMBINED_STATS.map((stat) => (
                                <div key={stat} className="flex items-start gap-3">
                                    <span className="mt-2 w-1 h-1 rounded-full bg-[#2FB7A8] shrink-0" />
                                    <span className="text-white/55 text-sm leading-relaxed">{stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </BlurFade>

                {/* Closing line */}
                <BlurFade delay={0.5}>
                    <p className="text-[#1A1A1A]/50 text-sm leading-relaxed text-center">
                        Stackd operates with a small senior team supported by specialized
                        contributors across performance, creator management and operations.
                    </p>
                </BlurFade>
            </div>
        </section>
    );
}
