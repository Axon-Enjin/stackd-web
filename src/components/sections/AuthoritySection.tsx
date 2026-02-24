import { BlurFade } from "@/components/magicui/BlurFade";
import { Marquee } from "@/components/magicui/Marquee";

const PARTNER_LOGOS = [
    "TikTok Shop Partner",
    "Live Commerce",
    "Creator Network",
    "Affiliate Management",
    "Revenue Tracking",
    "DTC Growth",
    "Performance Analytics",
];

export function AuthoritySection() {
    return (
        <section className="bg-white py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl mb-14">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            Our Expertise
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-4">
                            Focused exclusively on TikTok Shop
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.22}>
                        <p className="text-[#1A1A1A]/65 text-base md:text-lg leading-relaxed">
                            Stackd focuses exclusively on TikTok Shop live commerce
                            operations. We combine platform understanding, creator management
                            and performance analytics to help brands turn attention into sales.
                        </p>
                    </BlurFade>
                </div>

                {/* Tags / certifications marquee */}
                <BlurFade delay={0.32}>
                    <Marquee className="py-2">
                        {PARTNER_LOGOS.map((label) => (
                            <div
                                key={label}
                                className="flex items-center gap-2 shrink-0 px-5 py-2.5 border border-[#E8ECF2] rounded-full bg-[#F7F9FC]"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-[#2FB7A8]" />
                                <span className="text-[#0B1F3B] text-sm font-medium whitespace-nowrap">
                                    {label}
                                </span>
                            </div>
                        ))}
                    </Marquee>
                </BlurFade>
            </div>
        </section>
    );
}
