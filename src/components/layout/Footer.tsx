"use client";

import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B1F3B] px-6 py-12 text-white">
      <div className="absolute inset-0 z-0">
        <InteractiveGridPattern
          width={72}
          height={72}
          squares={[40, 40]}
          className="opacity-100 mix-blend-overlay"
          hoverColor="fill-white/[0.08]"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-4 flex items-center">
              <Image
                src="/logo-white.png"
                alt="Stackd Logo"
                width={100}
                height={24}
                className="h-3 w-auto object-contain"
              />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Revenue operations for consumer brands scaling through TikTok
              Shop.
            </p>
          </div>

         
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Stackd. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/#how-we-work" className="text-xs text-white/30 transition-colors hover:text-white/60">
              How We Work
            </Link>
            <Link href="/#team" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Our Team
            </Link>
            <Link href="/#faq" className="text-xs text-white/30 transition-colors hover:text-white/60">
              FAQ
            </Link>
            <Link href="/terms" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Terms
            </Link>
            <Link href="/privacy" className="text-xs text-white/30 transition-colors hover:text-white/60">
              Privacy
            </Link>
            <p className="text-xs text-white/30">
              TikTok Shop Revenue Operations Partner
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
