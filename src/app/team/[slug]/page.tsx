"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Linkedin, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlurFade } from "@/components/magicui/BlurFade";
import { usePaginatedTeamMembersQuery } from "@/features/TeamMembers/hooks/usePaginatedTeamMembersQuery";
import { toTeamSlug } from "@/lib/utils";

interface Member {
  id: string;
  imageUrl?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: string;
  bio: string;
  linkedinProfile?: string | null;
  achievements?: string[];
}

function getFullName(member: Member) {
  const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
  return `${member.firstName} ${middle} ${member.lastName}`.replace(/\s+/g, " ").trim();
}

export default function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: response, isLoading } = usePaginatedTeamMembersQuery(1, 100);
  const members: Member[] = response?.data || [];

  const member = members.find(
    (m) => toTeamSlug(m.firstName, m.lastName) === slug
  );

  return (
    <div className="min-h-screen flex flex-col bg-soft-white">
      <Navbar />
      <main className="grow pt-28 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back link */}
          <BlurFade delay={0.05}>
            <Link
              href="/#team"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy/50 hover:text-brand-blue transition-colors duration-200 mb-10"
            >
              <ArrowLeft size={15} />
              Back to Team
            </Link>
          </BlurFade>

          {isLoading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="animate-spin text-brand-blue" size={48} />
            </div>
          ) : !member ? (
            <BlurFade delay={0.1}>
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="text-navy font-semibold text-xl mb-3">Member not found</p>
                <p className="text-[#1A1A1A]/50 text-sm mb-8">
                  This team member profile doesn&apos;t exist or may have been removed.
                </p>
                <Link
                  href="/#team"
                  className="rounded-md bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2570d4] transition-colors duration-200"
                >
                  View the team
                </Link>
              </div>
            </BlurFade>
          ) : (
            <>
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Avatar */}
                <BlurFade delay={0.1}>
                  <div className="shrink-0 flex justify-center w-full md:w-auto">
                    <div className="w-48 h-48 md:w-64 md:h-80 rounded-2xl bg-navy/5 border border-[#E8ECF2] overflow-hidden">
                      {member.imageUrl ? (
                        <img
                          src={member.imageUrl}
                          alt={getFullName(member)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-navy/10 to-brand-blue/10 flex items-center justify-center">
                          <span className="text-navy/30 text-5xl font-bold uppercase">
                            {member.firstName.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </BlurFade>

                {/* Details */}
                <div className="grow">
                  <BlurFade delay={0.15}>
                    <span className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-teal mb-3 block">
                      Stackd Team
                    </span>
                    <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-navy leading-tight tracking-tight mb-2">
                      {getFullName(member)}
                    </h1>
                    <p className="text-brand-blue text-sm font-semibold uppercase tracking-wider mb-6">
                      {member.role}
                    </p>
                  </BlurFade>

                  <BlurFade delay={0.22}>
                    <div className="prose prose-sm max-w-none text-[#1A1A1A]/70 leading-relaxed whitespace-pre-wrap mb-8">
                      {member.bio}
                    </div>
                  </BlurFade>

                  {/* Achievements */}
                  {member.achievements && member.achievements.length > 0 && (
                    <BlurFade delay={0.27}>
                      <div className="mb-8 border-l-2 border-brand-blue/30 pl-5">
                        <ul className="space-y-2.5">
                          {member.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-[#1A1A1A]/70 leading-relaxed">
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </BlurFade>
                  )}

                  {/* LinkedIn */}
                  {member.linkedinProfile && (
                    <BlurFade delay={0.32}>
                      <div className="pt-6 border-t border-[#E8ECF2]">
                        <a
                          href={member.linkedinProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-navy/50 hover:text-brand-blue text-sm font-semibold uppercase tracking-widest transition-colors duration-200"
                          aria-label={`${getFullName(member)} on LinkedIn`}
                        >
                          <Linkedin size={16} />
                          LinkedIn Profile
                        </a>
                      </div>
                    </BlurFade>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
