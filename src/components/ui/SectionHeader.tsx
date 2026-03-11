"use client"

import { motion, type Variants } from "motion/react"
import { BlurFade } from "@/components/magicui/BlurFade"
import { cn } from "@/lib/utils"

const underlineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.25, ease: "easeInOut" as const },
  },
}

interface SectionHeaderProps {
  /** Small eyebrow label rendered above the heading */
  eyebrow?: string
  /** Main heading text */
  heading: string
  /** Additional class names for the wrapper */
  className?: string
  /** Override classes for the eyebrow element */
  eyebrowClassName?: string
  /** Override classes for the heading element */
  headingClassName?: string
  /** Additional class names applied to each word's underline bar */
  underlineClassName?: string
  /** BlurFade base delay in seconds */
  baseDelay?: number
}

export function SectionHeader({
  eyebrow,
  heading,
  className,
  eyebrowClassName,
  headingClassName,
  underlineClassName,
  baseDelay = 0.05,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {eyebrow && (
        <BlurFade delay={baseDelay}>
          <span
            className={cn(
              "text-xs font-semibold tracking-[0.18em] uppercase text-brand-teal mb-4 block",
              eyebrowClassName
            )}
          >
            {eyebrow}
          </span>
        </BlurFade>
      )}
      <BlurFade delay={baseDelay + 0.07}>
        <motion.h2
          className={cn(
            "text-3xl md:text-4xl lg:text-[40px] font-bold text-navy leading-tight tracking-tight cursor-pointer",
            headingClassName
          )}
          initial="hidden"
          whileHover="visible"
        >
          {heading.split(" ").map((word, i, arr) => (
            <span key={i} className="relative inline-block">
              {/* trailing non-breaking space fills the gap between words so underlines connect */}
              {i < arr.length - 1 ? `${word}\u00A0` : word}
              <motion.span
                className={cn("absolute inset-x-0 bg-current block", underlineClassName)}
                style={{ height: "0.08em", bottom: "-0.05em", transformOrigin: "center" }}
                variants={underlineVariants}
                aria-hidden="true"
              />
            </span>
          ))}
        </motion.h2>
      </BlurFade>
    </div>
  )
}
