"use client";

import Link from "next/link";

export function AdminFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0B1F3B] text-white">
      <div className="mx-auto max-w-screen-2xl px-6 py-8 md:px-8">
        {/* Main row */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          {/* Left: Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#2F80ED] to-[#2FB7A8] text-[10px] font-black text-white shadow-md">
                S
              </div>
              <span className="text-base font-bold tracking-[0.12em] text-white uppercase select-none">
                STACKD
              </span>
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Content management system for your digital storefront.
            </p>
          </div>

          {/* Right: Links-style info */}
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Platform
              </span>
              <span className="text-sm text-white/60">Stackd CMS v1.0</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-white/30">
                Powered by
              </span>
              <span className="text-sm text-white/60">Axon Enjin</span>
            </div>
          </div>
        </div>

        {/* Divider + bottom */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30">
            &copy; {year} Stackd. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            TikTok Shop Revenue Operations Partner
          </p>
        </div>
      </div>
    </footer>
  );
}
