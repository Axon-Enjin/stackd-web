import { BlurFade } from "@/components/magicui/BlurFade";

const MODEL_ITEMS = [
    {
        title: "Retainer",
        text: "A fixed monthly engagement covering operations, live management, and creator coordination.",
    },
    {
        title: "+",
        text: "",
        isSeparator: true,
    },
    {
        title: "Performance",
        text: "Results-based upside tied directly to revenue growth — our success is your success.",
    },
];

export function BusinessModelSection() {
    return (
        <section className="bg-[#F7F9FC] py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="max-w-3xl">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
                            How We Charge
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.12}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-4">
                            Aligned incentives
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.22}>
                        <p className="text-[#1A1A1A]/65 text-base md:text-lg leading-relaxed mb-12">
                            We work on a retainer plus performance structure. Our incentives
                            are aligned with yours — our goal is long-term growth, not
                            short-term campaigns. This allows brands to partner with a
                            dedicated operations team without building an internal department.
                        </p>
                    </BlurFade>

                    {/* Model display */}
                    <BlurFade delay={0.32}>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                            {MODEL_ITEMS.map((item) =>
                                item.isSeparator ? (
                                    <div
                                        key="sep"
                                        className="text-4xl font-light text-[#0B1F3B]/30 shrink-0"
                                    >
                                        +
                                    </div>
                                ) : (
                                    <div
                                        key={item.title}
                                        className="flex-1 bg-white border border-[#E8ECF2] rounded-xl p-6"
                                    >
                                        <div className="text-[#0B1F3B] font-bold text-xl mb-2">
                                            {item.title}
                                        </div>
                                        <p className="text-[#1A1A1A]/55 text-sm leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                ),
                            )}
                        </div>
                    </BlurFade>
                </div>
            </div>
        </section>
    );
}
