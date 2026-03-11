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
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
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
                  <p className="text-[#1A1A1A]/50 text-base leading-relaxed line-through decoration-[#0B1F3B]/20">
                    {line}
                  </p>
                </BlurFade>
              ))}
            </div>

            <BlurFade delay={0.5}>
              <p className="text-[#1A1A1A]/70 text-base md:text-lg leading-relaxed mt-8 mb-3">
                We partner with brands to build and operate the full live
                commerce system:
              </p>
            </BlurFade>

            <BlurFade delay={0.58}>
              <div className="mt-4 pt-4 border-t border-[#E8ECF2]">
                <p className="text-[#0B1F3B] font-semibold text-base">
                  TikTok Shop becomes a managed revenue function — not a side
                  initiative.
                </p>
              </div>
            </BlurFade>
          </div>

          {/* Right — structured service list */}
          <div ref={listRef}>
            <motion.div
              className="bg-[#0B1F3B] rounded-xl overflow-hidden border border-[#0B1F3B]/10 w-full"
              style={{
                boxShadow: "0 4px 12px rgba(11,31,59,0.08), 0 16px 40px rgba(11,31,59,0.10)",
              }}
              whileHover={{
                y: -6,
                boxShadow: "0 8px 20px rgba(11,31,59,0.12), 0 28px 56px rgba(11,31,59,0.22)",
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Card header */}
              <div className="px-6 py-4 border-b border-white/20 bg-white/[0.04] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#2FB7A8]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <span className="text-white/75 text-xs font-medium tracking-wide uppercase">
                    Revenue Operations
                  </span>
                </div>
                <span className="text-white/40 text-[10px]">Full-system</span>
              </div>

              {/* Services */}
              <div className="divide-y divide-white/[0.06]">
                {SERVICES.map((service, i) => (
                  <motion.div
                    key={service}
                    className="flex items-center gap-4 px-6 py-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={listInView ? { opacity: 1, x: 0 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2F80ED] shrink-0" />
                    <span className="text-white/75 text-sm leading-relaxed">
                      {service}
                    </span>
                    <div className="ml-auto shrink-0">
                      <span className="text-[10px] text-[#2FB7A8] font-semibold tracking-wide bg-[#2FB7A8]/10 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
