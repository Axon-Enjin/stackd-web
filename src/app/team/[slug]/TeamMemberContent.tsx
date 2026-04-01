"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlurFade } from "@/components/magicui/BlurFade";
import { FaLinkedin } from "react-icons/fa";

// ── Types ────────────────────────────────────────────────────────────────────

interface Member {
  id: string;
  imageUrl?: string;
  imageUrl64?: string | null;
  imageUrl256?: string | null;
  imageUrl512?: string | null;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  role: string;
  bio: string;
  linkedinProfile?: string | null;
  achievements?: string[];
}

interface Props {
  member: Member;
  slug: string;
}

function getFullName(member: Member) {
  const middle = member.middleName ? `${member.middleName.charAt(0)}.` : "";
  return `${member.firstName} ${middle} ${member.lastName}`
    .replace(/\s+/g, " ")
    .trim();
}

// ── Component ────────────────────────────────────────────────────────────────
// Marked "use client" only because BlurFade uses framer-motion (client-only).
// All data arrives as props from the Server Component parent — no client-side
// fetching needed, which means no loading spinner for Googlebot.

export function TeamMemberContent({ member, slug }: Props) {
  const fullName = getFullName(member);

  return (
    <div className="bg-soft-white flex min-h-screen flex-col">
      <Navbar />
      <main className="grow px-6 pt-28 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <BlurFade delay={0.05}>
            <Link
              href="/#team"
              className="text-navy/50 hover:text-brand-blue mb-10 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            >
              <ArrowLeft size={15} />
              Back to Team
            </Link>
          </BlurFade>

          <div className="flex flex-col items-start gap-10 md:flex-row">
            {/* Left Column (Avatar + Achievements) */}
            <div className="relative flex w-full shrink-0 flex-col gap-8 md:w-64 md:rounded-3xl md:bg-[#0B1F3B] md:p-4 md:pb-8">
              <BlurFade delay={0.1}>
                <div className="bg-navy/5 mx-auto aspect-[4/5] w-full max-w-64 overflow-hidden rounded-2xl md:mx-0 relative">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl512 || member.imageUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="from-navy/10 to-brand-blue/10 flex h-full w-full items-center justify-center bg-linear-to-br">
                      <span className="text-navy/30 text-5xl font-bold uppercase">
                        {member.firstName.charAt(0)}
                      </span>
                    </div>
                  )}

                  {member.linkedinProfile && (
                    <div className="absolute right-2 bottom-2 cursor-pointer text-3xl text-[#4cbcf8] transition-transform duration-300 hover:scale-115">
                      <a
                        href={member.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${fullName} on LinkedIn`}
                      >
                        <FaLinkedin />
                      </a>
                    </div>
                  )}
                </div>
              </BlurFade>

              {/* Achievements (Desktop) */}
              {member.achievements && member.achievements.length > 0 && (
                <BlurFade delay={0.27}>
                  <div className="hidden border-l-2 border-white/20 pl-5 md:block">
                    <ul className="space-y-2.5">
                      {member.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-sm leading-relaxed text-white md:text-xs md:font-normal"
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </BlurFade>
              )}
            </div>

            {/* Details */}
            <div className="grow">
              <BlurFade delay={0.15}>
                <h1 className="text-navy mb-2 text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-[42px]">
                  {fullName}
                </h1>
                <p className="text-brand-blue mb-6 text-sm font-semibold tracking-wider uppercase">
                  {member.role}
                </p>
              </BlurFade>

              <BlurFade delay={0.22}>
                <div className="prose prose-sm mb-8 max-w-none leading-relaxed whitespace-pre-wrap text-[#1A1A1A]/70">
                  {member.bio}
                </div>
              </BlurFade>

              {/* Achievements (Mobile) */}
              {member.achievements && member.achievements.length > 0 && (
                <BlurFade delay={0.27}>
                  <div className="border-brand-blue/30 mb-8 border-l-2 pl-5 md:hidden">
                    <ul className="space-y-2.5">
                      {member.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-sm leading-relaxed text-[#1A1A1A]/70"
                        >
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </BlurFade>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
