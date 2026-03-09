"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import { MagicCard } from "@/components/magicui/magic-card";
import { Linkedin, Loader2 } from "lucide-react";
import { usePaginatedTeamMembersQuery } from "@/features/TeamMembers/hooks/usePaginatedTeamMembersQuery";

// Types based on the CMS Member definition
interface Member {
    id: string;
    imageUrl?: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    role: string;
    bio: string;
}

const COMBINED_STATS = [
    "29 years of combined leadership and operational experience",
    "Leadership roles across e-commerce and digital commerce environments",
    "Hands-on experience supporting TikTok-based commerce operations",
    "Executive coaching and advisory work with founders and leadership teams",
    "Specialized focus on operational systems behind live commerce",
];

export function TeamSection() {
    const { data: response, isLoading } = usePaginatedTeamMembersQuery(1, 20);
    const members: Member[] = response?.data || [];

    const getFullName = (member: Member) => {
        const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
        return `${member.firstName} ${middle} ${member.lastName}`.replace(/\s+/g, " ").trim();
    };

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
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <Loader2 className="animate-spin text-[#2F80ED]" size={40} />
                        </div>
                    ) : (
                        members.map((member, i) => (
                            <BlurFade key={member.id} delay={0.15 + i * 0.12}>
                                <MagicCard
                                    className="bg-white border border-[#E8ECF2] rounded-xl p-8 h-full cursor-default hover:shadow-md transition-shadow duration-300 flex flex-col"
                                    gradientColor="#2F80ED08"
                                    gradientSize={300}
                                >
                                    {/* Photo + name row */}
                                    <div className="flex items-start gap-5 mb-6 shrink-0">
                                        <div className="w-16 h-16 shrink-0 rounded-full bg-[#0B1F3B]/5 border border-[#E8ECF2] flex items-center justify-center overflow-hidden">
                                            {member.imageUrl ? (
                                                <img
                                                    src={member.imageUrl}
                                                    alt={getFullName(member)}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#0B1F3B]/10 to-[#2F80ED]/10 flex items-center justify-center">
                                                    <span className="text-[#0B1F3B]/30 text-xl font-bold uppercase">
                                                        {member.firstName.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-[#0B1F3B] font-bold text-xl leading-snug">
                                                {getFullName(member)}
                                            </h3>
                                            <p className="text-[#2F80ED] text-sm font-medium mt-0.5">
                                                {member.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="mb-5 flex-grow">
                                        <p className="text-[#1A1A1A]/60 text-sm leading-relaxed whitespace-pre-wrap">
                                            {member.bio}
                                        </p>
                                    </div>

                                    {/* LinkedIn */}
                                    <div className="mt-6 pt-4 border-t border-[#E8ECF2] shrink-0">
                                        <a
                                            href="#"
                                            className="inline-flex items-center gap-2 text-[#0B1F3B]/40 hover:text-[#2F80ED] text-xs font-medium transition-colors duration-200"
                                            aria-label={`${getFullName(member)} on LinkedIn`}
                                        >
                                            <Linkedin size={13} />
                                            LinkedIn
                                        </a>
                                    </div>
                                </MagicCard>
                            </BlurFade>
                        ))
                    )}
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
