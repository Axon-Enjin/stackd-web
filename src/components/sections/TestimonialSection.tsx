import { BlurFade } from "@/components/magicui/BlurFade";
import { testimonialsModuleController } from "@/features/Testimonials/TestimonialsModule";
import { Quote } from "lucide-react";
import Image from "next/image";

export async function TestimonialSection() {
    // Fetch all testimonials server-side
    const testimonials = await testimonialsModuleController.listAllTestimonials();

    if (!testimonials || testimonials.length === 0) {
        return null; // Don't show the section if there are no testimonials
    }

    return (
        <section className="bg-gray-50 py-24 px-6 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                {/* Header Sequence */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <BlurFade delay={0.05}>
                        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2F80ED] mb-4 block">
                            Client Success
                        </span>
                    </BlurFade>
                    <BlurFade delay={0.15}>
                        <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0B1F3B] leading-tight tracking-tight mb-6 mt-2">
                            What our partners say
                        </h2>
                    </BlurFade>
                    <BlurFade delay={0.25}>
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed">
                            Don't just take our word for it. Hear from the brands that have rapidly scaled their direct-to-consumer revenue using our live commerce system.
                        </p>
                    </BlurFade>
                </div>

                {/* Testimonial Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <BlurFade key={testimonial.id} delay={0.35 + i * 0.1}>
                            <div className="h-full relative bg-white rounded-2xl p-8 border border-[#E8ECF2] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col group">
                                <Quote
                                    size={42}
                                    className="absolute top-6 right-6 text-[#2F80ED]/10 rotate-180 transition-colors duration-300 group-hover:text-[#2F80ED]/20"
                                />

                                <div className="flex-1 mb-8 relative z-10">
                                    <p className="text-[#1A1A1A]/80 text-base leading-relaxed italic">
                                        "{testimonial.body}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 mt-auto relative z-10 pt-6 border-t border-[#E8ECF2]/60">
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden shrink-0 border border-[#E8ECF2]">
                                        <img
                                            src={testimonial.imageUrl}
                                            alt={testimonial.title}
                                            // fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[#0B1F3B] text-sm">
                                            {testimonial.title}
                                        </h4>
                                        <p className="text-[#2F80ED] text-xs font-medium mt-0.5">
                                            {testimonial.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </BlurFade>
                    ))}
                </div>
            </div>
        </section>
    );
}
