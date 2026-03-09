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
              Revenue operations for consumer brands scaling through TikTok
              Shop.
            </p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#2F80ED] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2570d4]"
            >
              Request a Strategy Conversation →
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Stackd. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            TikTok Shop Revenue Operations Partner
          </p>
        </div>
      </div>
    </footer>
  );
}
