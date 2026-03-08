export function Footer() {
  return (
    <footer className="bg-[#0B1F3B] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-1 text-lg font-bold tracking-[0.15em] uppercase">
              STACKD
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Revenue operations for direct-to-consumer brands scaling on TikTok
              Shop.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#2F80ED] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2570d4]"
            >
              Book a Strategy Call →
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} Stackd. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/privacy"
                className="text-xs text-white/30 underline decoration-white/10 underline-offset-4 transition-colors hover:text-white/60"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-xs text-white/30 underline decoration-white/10 underline-offset-4 transition-colors hover:text-white/60"
              >
                Terms of Service
              </a>
            </div>
          </div>
          <p className="text-xs text-white/30">
            TikTok Shop Revenue Operations Partner
          </p>
        </div>
      </div>
    </footer>
  );
}
