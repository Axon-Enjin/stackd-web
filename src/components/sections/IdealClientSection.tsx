import { BlurFade } from "@/components/magicui/BlurFade";

export function IdealClientSection() {
    return (
        <section className="bg-[#0B1F3B] py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            Ideal Partnership
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.14}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight tracking-tight mb-6">
                            Who we work best with
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.24}>
                        <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10">
                            We partner best with direct-to-consumer brands generating
                            approximately{" "}
                            <span className="text-white font-semibold">$3M–$50M annually</span>{" "}
                            that are ready to invest in TikTok Shop as a real revenue channel.
                        </p>
                    </BlurFade>

                    {/* Criteria */}
                    <BlurFade delay={0.34}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Direct-to-consumer brand",
                                "$3M–$50M in annual revenue",
                                "Ready to invest in TikTok Shop",
                                "Wants a long-term growth partner",
                                "Not looking for a short-term campaign",
                                "Open to live commerce operations",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#2FB7A8] shrink-0" />
                                    <span className="text-white/70 text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </BlurFade>
                </div>
            </div>
        </section>
    );
}
