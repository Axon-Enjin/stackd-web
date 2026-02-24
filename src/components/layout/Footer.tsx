export function Footer() {
    return (
        <footer className="bg-[#0B1F3B] text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="text-lg font-bold tracking-[0.15em] uppercase mb-1">
                            STACKD
                        </div>
                        <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                            Revenue operations for direct-to-consumer brands scaling on TikTok
                            Shop.
                        </p>
                    </div>

                    <div className="flex flex-col md:items-end gap-2">
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-2 bg-[#2F80ED] hover:bg-[#2570d4] text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors duration-200"
                        >
                            Book a Strategy Call →
                        </a>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-white/30 text-xs">
                        © {new Date().getFullYear()} Stackd. All rights reserved.
                    </p>
                    <p className="text-white/30 text-xs">
                        TikTok Shop Revenue Operations Partner
                    </p>
                </div>
            </div>
        </footer>
    );
}
