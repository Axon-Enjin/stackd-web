"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

export default function OurTeamPage() {
    // Fetches the first 100 team members to show the entire team
    const { data: response, isLoading } = usePaginatedTeamMembersQuery(1, 100);
    const members: Member[] = response?.data || [];

    const getFullName = (member: Member) => {
        const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
        return `${member.firstName} ${middle} ${member.lastName}`.replace(/\s+/g, " ").trim();
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F7F9FC]">
            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="max-w-3xl mb-16 text-center mx-auto">
                        <BlurFade delay={0.05}>
                            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                                Stackd Leadership & Team
                            </span>
                        </BlurFade>
                        <BlurFade delay={0.12}>
                            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-6">
                                Meet the Operators
                            </h1>
                        </BlurFade>
                        <BlurFade delay={0.2}>
                            <p className="text-[#1A1A1A]/60 text-lg md:text-xl leading-relaxed">
                                Our team combines deep leadership experience, operational discipline, and hands-on knowledge of live commerce systems.
                            </p>
                        </BlurFade>
                    </div>

                    {/* Team Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-24">
                            <Loader2 className="animate-spin text-[#2F80ED]" size={48} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {members.map((member, i) => (
                                <BlurFade key={member.id} delay={0.15 + (i * 0.08)}>
                                    <MagicCard
                                        className="bg-white border border-[#E8ECF2] rounded-xl p-8 cursor-default hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-8 items-start group/card"
                                        gradientColor="#2F80ED08"
                                        gradientSize={300}
                                    >
                                        <div className="shrink-0 flex justify-center w-full md:w-auto">
                                            {/* Profile Avatar */}
                                            <div className="w-40 h-40 md:w-56 md:h-72 rounded-full md:rounded-2xl bg-[#0B1F3B]/5 border border-[#E8ECF2] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover/card:scale-[1.03] group-hover/card:-translate-y-1 group-hover/card:border-[#2F80ED]/30 group-hover/card:shadow-xl relative z-10">
                                                {member.imageUrl ? (
                                                    <img
                                                        src={member.imageUrl}
                                                        alt={getFullName(member)}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-[#0B1F3B]/10 to-[#2F80ED]/10 flex items-center justify-center">
                                                        <span className="text-[#0B1F3B]/30 text-4xl font-bold uppercase">
                                                            {member.firstName.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-grow flex flex-col text-center md:text-left">
                                            {/* Name & Role */}
                                            <h3 className="text-[#0B1F3B] font-bold text-2xl leading-snug">
                                                {getFullName(member)}
                                            </h3>
                                            <p className="text-[#2F80ED] text-sm font-semibold mt-1 mb-4 uppercase tracking-wider">
                                                {member.role}
                                            </p>

                                            {/* Bio */}
                                            <div className="mb-6 flex-grow">
                                                <p className="text-[#1A1A1A]/80 text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                                                    {member.bio}
                                                </p>
                                            </div>

                                            {/* LinkedIn Action */}
                                            <div className="shrink-0 mt-auto pt-5 border-t border-[#E8ECF2]/50 flex justify-center md:justify-start">
                                                <a
                                                    href="#"
                                                    className="inline-flex items-center gap-2 text-[#0B1F3B]/50 hover:text-[#2F80ED] text-sm font-semibold uppercase tracking-widest transition-colors duration-200"
                                                    aria-label={`${getFullName(member)} on LinkedIn`}
                                                >
                                                    <Linkedin size={16} />
                                                    LinkedIn Profile
                                                </a>
                                            </div>
                                        </div>
                                    </MagicCard>
                                </BlurFade>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
