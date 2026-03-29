"use client";

import Link from "next/link";
import Image from "next/image";

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
              <Image
                src="/logo-white.png"
                alt="Stackd Logo"
                width={100}
                height={20}
                className="h-2.5 w-auto object-contain"
              />
            </Link>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              Content management system for your digital storefront.
            </p>
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
