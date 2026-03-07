"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    question: "Do you guarantee revenue?",
    answer:
      "No. We guarantee disciplined execution and structured operations. Revenue is the outcome of consistent, well-managed systems — and building that is exactly what we do.",
  },
  {
    question: "Do you provide creators?",
    answer:
      "We build and manage structured creator ecosystems. We do not rely on one-off influencer blasts. Our approach is systematic — outreach, onboarding, coordination and performance tracking built as infrastructure.",
  },
  {
    question: "What markets do you support?",
    answer:
      "US-first. Additional markets selectively, based on brand fit and operational readiness.",
  },
  {
    question: "Who are you best suited for?",
    answer:
      "Brands already generating revenue and ready to commit to structured execution. We are not a fit for early-stage testing or short-term campaign work.",
  },
];

function FAQItem({
  faq,
  index,
}: {
  faq: (typeof FAQS)[0];
  index: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <BlurFade delay={0.1 + index * 0.08}>
      <div className="border-b border-[#E8ECF2] last:border-b-0">
        <button
          className="w-full flex items-center justify-between gap-4 py-5 text-left group"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span className="text-[#0B1F3B] font-medium text-base leading-snug group-hover:text-[#2F80ED] transition-colors duration-200">
            {faq.question}
          </span>
          <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full border border-[#E8ECF2] text-[#0B1F3B]/40 group-hover:border-[#2F80ED]/30 group-hover:text-[#2F80ED] transition-all duration-200">
            {open ? <Minus size={13} /> : <Plus size={13} />}
          </span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="answer"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden"
            >
              <p className="text-[#1A1A1A]/60 text-sm leading-relaxed pb-5 pr-12">
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlurFade>
  );
}

export function FAQSection() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          {/* Left label */}
          <div>
            <BlurFade delay={0.05}>
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                FAQs
              </span>
            </BlurFade>
            <BlurFade delay={0.12}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3B] leading-tight tracking-tight">
                Common Questions
              </h2>
            </BlurFade>
          </div>

          {/* Right accordion */}
          <div className="divide-y divide-[#E8ECF2] border-t border-[#E8ECF2]">
            {FAQS.map((faq, i) => (
              <FAQItem key={faq.question} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
