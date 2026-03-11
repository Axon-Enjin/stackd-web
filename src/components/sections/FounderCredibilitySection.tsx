"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import Link from "next/link";
import { usePaginatedTeamMembersQuery } from "@/features/TeamMembers/hooks/usePaginatedTeamMembersQuery";
import { toTeamSlug } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Types based on the CMS Member definition
interface Member {
  id: string;
  imageUrl?: string;
  imageUrl64?: string | null;
  imageUrl256?: string | null;
  imageUrl512?: string | null;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  bio: string;
}

export function FounderCredibilitySection() {
  const { data: response, isLoading } = usePaginatedTeamMembersQuery(1, 4);
  const members: Member[] = response?.data || [];

  // We want to show up to the first 4 team members
  const displayMembers = members.slice(0, 4);

  const getFullName = (member: Member) => {
    const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
    return `${member.firstName} ${middle} ${member.lastName}`.replace(/\s+/g, " ").trim();
  };

  return (
    <section className="bg-[#F7F9FC] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <BlurFade delay={0.05}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4">
            Leadership
          </p>
        </BlurFade>
        <BlurFade delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3B] leading-tight tracking-tight mb-5">
            Built by Operators, Not Marketers.
          </h2>
        </BlurFade>
        <div className="max-w-3xl mb-12">
          <BlurFade delay={0.2}>
            <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed mb-2">
              Stackd is built by operators who believe TikTok Shop succeeds when execution is owned, structured and consistent.
            </p>
            <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed">
              Our team combines leadership experience, operational discipline and hands-on knowledge of live commerce systems.
            </p>
          </BlurFade>
        </div>

        <div className={`grid grid-cols-1 ${displayMembers.length === 1 ? 'md:grid-cols-1 max-w-xl mx-auto' : displayMembers.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : displayMembers.length === 4 ? 'md:grid-cols-2 lg:grid-cols-4 max-w-full' : 'lg:grid-cols-3 md:grid-cols-2 max-w-full'} gap-6`}>
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="animate-spin text-[#2F80ED]" size={40} />
            </div>
          ) : (
            displayMembers.map((member, i) => (
              <BlurFade key={member.id} delay={0.15 + i * 0.12} className="h-full">
                <Link href={`/team/${toTeamSlug(member.firstName, member.lastName)}`} className="block sm:flex sm:flex-row md:block w-full aspect-[4/5] sm:aspect-auto sm:h-[360px] md:h-auto md:aspect-[3/4] lg:h-[400px] lg:aspect-auto rounded-2xl overflow-hidden relative group bg-[#0f2a4a]">
                  {/* Image Container */}
                  <div className="absolute inset-0 sm:relative sm:w-[45%] md:absolute md:w-full h-full shrink-0 overflow-hidden z-0">
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl512 || member.imageUrl}
                        alt={getFullName(member)}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0B1F3B] to-[#0B1F3B]/80 flex items-center justify-center">
                        <span className="text-white/20 text-7xl font-bold uppercase">
                          {member.firstName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Container XS and MD+ */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2a4a] via-[#0f2a4a]/80 via-[45%] to-[#0f2a4a]/0 opacity-90 transition-opacity duration-300 group-hover:opacity-100 sm:hidden md:block pointer-events-none z-10" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 transition-transform duration-300 group-hover:translate-y-0 sm:hidden md:flex md:w-full md:p-8 md:justify-end md:translate-y-4 z-20 pointer-events-none">
                    <h3 className="text-white font-bold text-2xl leading-snug mb-1">
                      {getFullName(member)}
                    </h3>
                    <p className="text-[#2F80ED] text-xs font-bold uppercase tracking-widest mb-4">
                      {member.role}
                    </p>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3 md:line-clamp-3">
                      {member.bio}
                    </p>
                  </div>

                  {/* Content Container SM Only */}
                  <div className="relative p-6 sm:px-8 flex flex-col justify-center sm:w-[55%] hidden sm:flex md:hidden z-20 pointer-events-none">
                    <h3 className="text-white font-bold text-2xl leading-snug mb-1">
                      {getFullName(member)}
                    </h3>
                    <p className="text-[#2F80ED] text-xs font-bold uppercase tracking-widest mb-4">
                      {member.role}
                    </p>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
                      {member.bio}
                    </p>
                  </div>
                </Link>
              </BlurFade>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
