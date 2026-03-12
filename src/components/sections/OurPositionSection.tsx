"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { SectionHeader } from "@/components/ui/SectionHeader";

const SERVICES = [
  "Structured live programming",
  "Creator ecosystem management",
  "Affiliate activation and coordination",
  "Performance optimization and reporting",
  "Cross-functional alignment with internal teams",
];

export function OurPositionSection() {
  const listRef = useRef(null);
  const listInView = useInView(listRef, { once: true, margin: "-40px" });

  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — positioning copy */}
          <div>
            <SectionHeader
              eyebrow="Our Position"
              heading="Stackd Operates TikTok Shop as a Revenue Department"
              baseDelay={0.05}
            />

            <div className="space-y-4">
              {[
                "We do not provide campaign support.",
                "We do not run influencer blasts.",
                'We do not "manage social."',
              ].map((line, i) => (
                <BlurFade key={line} delay={0.2 + i * 0.08}>
                  <p className="text-base leading-relaxed text-[#1A1A1A]/50 decoration-[#0B1F3B]/20">
                    {line}
                  </p>
                </BlurFade>
              ))}
            </div>

            <BlurFade delay={0.5}>
              <p className="mt-8 mb-3 text-base leading-relaxed text-[#1A1A1A]/70 md:text-lg">
                We partner with brands to build and operate the full live
                commerce system:
              </p>
            </BlurFade>

            <BlurFade delay={0.58}>
              <div className="mt-4 border-t border-[#E8ECF2] pt-4">
                <p className="text-base font-semibold text-[#0B1F3B]">
                  TikTok Shop becomes a managed revenue function
                </p>
                <p className="text-base font-semibold text-[#0B1F3B]">
                  — not a side initiative.
                </p>
              </div>
            </BlurFade>
          </div>

          {/* Right — structured service list */}
          <div ref={listRef}>
            <motion.div
              className="w-full overflow-visible rounded-xl border border-[#0B1F3B]/10 bg-[#0B1F3B]"
              style={{
                boxShadow:
                  "0 4px 12px rgba(11,31,59,0.08), 0 16px 40px rgba(11,31,59,0.10)",
              }}
              whileHover={{
                boxShadow:
                  "0 8px 20px rgba(11,31,59,0.12), 0 28px 56px rgba(11,31,59,0.22)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between border-b border-white/20 bg-white/[0.04] px-6 py-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2 w-2 rounded-full bg-[#2FB7A8]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="text-xs font-medium tracking-wide text-white/75 uppercase">
                    Revenue Operations
                  </span>
                </div>
                <span className="text-[10px] text-white/40">Full-system</span>
              </div>

              {/* Services */}
              <div className="overflow-visible">
                {SERVICES.map((service, i) => (
                  <motion.div
                    key={service}
                    className="relative z-10 flex cursor-default items-center gap-4 border-b border-white/[0.06] px-6 py-4 last:border-b-0 bg-[#0B1F3B]"
                    initial={{ opacity: 0, x: 20 }}
                    animate={listInView ? { opacity: 1, x: 0 } : {}}
                    whileHover={{
                      y: -4,
                      scale: 1.03,
                      boxShadow: "0 8px 24px rgba(47, 128, 237, 0.18), 0 0 0 1px rgba(47, 128, 237, 0.15)",
                      // background: "#1B2F4B"
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.21, 0.47, 0.32, 0.98],
                      y: { duration: 0.2, delay: 0, ease: "easeOut" },
                      scale: { duration: 0.2, delay: 0, ease: "easeOut" },
                      boxShadow: { duration: 0.2, delay: 0 },
                    }}
                    style={{ borderRadius: 8 }}
                  >
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2F80ED]" />
                    <span className="text-sm leading-relaxed text-white/75">
                      {service}
                    </span>
                    <div className="ml-auto shrink-0">
                      <span className="rounded-full bg-[#2FB7A8]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#2FB7A8]">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Card header */}
              <div className="flex items-center justify-between bg-white/[0.04] px-6 py-4">
                <div className="flex items-center gap-2"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
