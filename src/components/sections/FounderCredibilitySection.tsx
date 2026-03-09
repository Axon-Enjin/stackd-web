"use client";

import { BlurFade } from "@/components/magicui/BlurFade";
import { MagicCard } from "@/components/magicui/magic-card";
import { Linkedin } from "lucide-react";

const FOUNDERS = [
  {
    name: "Jay Buenaflor",
    role: "CEO",
    bio: "Nearly two decades helping organizations scale through stronger teams, clearer decisions and disciplined execution. Former COO of a fast-growing e-commerce cosmetics company — with hands-on experience building the operational systems behind multi-channel growth, including early TikTok commerce adoption.",
    linkedin: "#",
  },
  {
    name: "Dette Tejada",
    role: "Commerce Operations",
    bio: "5+ years operating within the TikTok ecosystem. Former E-Commerce Head across beauty, apparel and general e-commerce brands. Specializes in building the creator ecosystems, affiliate infrastructure and live selling systems that convert TikTok visibility into predictable revenue.",
    linkedin: "#",
  },
];

export function FounderCredibilitySection() {
  return (
    <section className="bg-[#F7F9FC] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <BlurFade delay={0.05}>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4">
            Leadership
          </p>
        </BlurFade>
        <BlurFade delay={0.1}>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3B] leading-tight tracking-tight mb-12">
            Built by Operators, Not Marketers.
          </h2>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FOUNDERS.map((founder, i) => (
            <BlurFade key={founder.name} delay={0.15 + i * 0.12}>
              <MagicCard
                className="bg-white border border-[#E8ECF2] rounded-xl p-8 h-full cursor-default hover:shadow-md transition-shadow duration-300"
                gradientColor="#2F80ED10"
                gradientSize={240}
              >
                {/* Photo placeholder */}
                <div className="w-16 h-16 rounded-full bg-[#0B1F3B]/08 border border-[#E8ECF2] mb-5 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-[#0B1F3B]/10 to-[#2F80ED]/10 flex items-center justify-center">
                    <span className="text-[#0B1F3B]/30 text-xl font-bold">
                      {founder.name.charAt(0)}
                    </span>
                  </div>
                </div>

                <div className="mb-1">
                  <h3 className="text-[#0B1F3B] font-bold text-lg leading-snug">
                    {founder.name}
                  </h3>
                  <p className="text-[#2F80ED] text-sm font-medium mt-0.5">
                    {founder.role}
                  </p>
                </div>

                <div className="w-8 h-px bg-[#E8ECF2] my-4" />

                <p className="text-[#1A1A1A]/60 text-sm leading-relaxed mb-6">
                  {founder.bio}
                </p>

                <a
                  href={founder.linkedin}
                  className="inline-flex items-center gap-2 text-[#0B1F3B]/50 hover:text-[#2F80ED] text-xs font-medium transition-colors duration-200"
                  aria-label={`${founder.name} on LinkedIn`}
                >
                  <Linkedin size={14} />
                  LinkedIn
                </a>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
