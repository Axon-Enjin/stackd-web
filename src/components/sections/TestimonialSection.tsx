"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { useAllTestimonialsQuery, type TestimonialItem } from "@/features/Testimonials/hooks/useAllTestimonialsQuery";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTO_SCROLL_MS = 5000;

const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
};

function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
    return (
        <div className="rounded-2xl overflow-hidden relative group bg-[#0f2a4a] h-[340px] sm:h-[380px] lg:h-[420px]">
            {/* Background image */}
            <div className="absolute inset-0 z-0">
                {testimonial.imageUrl ? (
                    <img
                        src={testimonial.imageUrl}
                        alt={testimonial.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-linear-to-br from-navy to-navy/80 flex items-center justify-center">
                        <span className="text-white/10 text-8xl font-bold uppercase">
                            {testimonial.title.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-navy via-navy/80 via-40% to-navy/10 opacity-90 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none" />

            {/* Shine sweep on hover */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/8 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end translate-y-3 transition-transform duration-300 group-hover:translate-y-0 z-30 pointer-events-none">
                <span className="text-brand-blue text-5xl font-serif leading-none mb-3 select-none">&ldquo;</span>
                <p className="text-white/85 text-sm leading-relaxed line-clamp-4 mb-5">
                    {testimonial.body}
                </p>
                <div className="w-10 h-px bg-brand-blue/60 mb-4" />
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-white/20">
                        <img src={testimonial.imageUrl} alt={testimonial.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">{testimonial.title}</p>
                        <p className="text-brand-blue text-xs font-bold uppercase tracking-widest mt-0.5">{testimonial.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TestimonialSection() {
    const { data: testimonials, isLoading, isError } = useAllTestimonialsQuery();
    const { isBreakpoint } = useBreakpoint();

    const perPage = isBreakpoint("lg") ? 3 : isBreakpoint("md") ? 2 : 1;

    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevPerPage = useRef(perPage);

    const totalPages = testimonials ? Math.ceil(testimonials.length / perPage) : 0;

    // Reset to page 0 when perPage changes (responsive resize)
    useEffect(() => {
        if (prevPerPage.current !== perPage) {
            prevPerPage.current = perPage;
            setPage(0);
        }
    }, [perPage]);

    const go = useCallback(
        (dir: 1 | -1) => {
            setDirection(dir);
            setPage((prev) => (prev + dir + totalPages) % totalPages);
        },
        [totalPages],
    );

    useEffect(() => {
        if (paused || totalPages <= 1) return;
        timerRef.current = setTimeout(() => go(1), AUTO_SCROLL_MS);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [page, paused, go, totalPages]);

    const gridCols =
        perPage === 3
            ? "grid-cols-3"
            : perPage === 2
              ? "grid-cols-2"
              : "grid-cols-1";

    if (isLoading) {
        return (
            <section className="bg-soft-white py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className={`grid ${gridCols} gap-6`}>
                        {[...Array(perPage)].map((_, i) => (
                            <div key={i} className="rounded-2xl bg-navy/10 h-[340px] sm:h-[380px] lg:h-[420px] animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !testimonials || testimonials.length === 0) {
        return null;
    }

    const visibleCards = testimonials.slice(page * perPage, page * perPage + perPage);

    const navBtnClass =
        "w-11 h-11 rounded-full border border-[#E8ECF2] bg-white shadow-sm flex items-center justify-center text-navy/50 hover:text-brand-blue hover:border-brand-blue hover:shadow-md transition-all duration-200 shrink-0";

    return (
        <section className="bg-soft-white py-24 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <BlurFade delay={0.05}>
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-blue mb-4">
                        Client Success
                    </p>
                </BlurFade>
                <BlurFade delay={0.1}>
                    <h2 className="text-3xl md:text-4xl font-bold text-navy leading-tight tracking-tight mb-5">
                        What our partners say.
                    </h2>
                </BlurFade>
                <div className="max-w-3xl mb-12">
                    <BlurFade delay={0.2}>
                        <p className="text-[#1A1A1A]/60 text-base md:text-lg leading-relaxed">
                            Don&apos;t just take our word for it. Hear from the brands that have rapidly
                            scaled their direct-to-consumer revenue using our live commerce system.
                        </p>
                    </BlurFade>
                </div>

                {/* Carousel */}
                <BlurFade delay={0.3}>
                    <div
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >
                        {/* Arrows flanking the cards */}
                        <div className="flex items-center gap-3 sm:gap-4">
                            {totalPages > 1 && (
                                <button onClick={() => go(-1)} aria-label="Previous testimonials" className={navBtnClass}>
                                    <ChevronLeft size={18} />
                                </button>
                            )}

                            <div className="flex-1 overflow-hidden">
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={`${page}-${perPage}`}
                                        custom={direction}
                                        variants={slideVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        className={`grid ${gridCols} gap-4 sm:gap-6`}
                                    >
                                        {visibleCards.map((testimonial) => (
                                            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {totalPages > 1 && (
                                <button onClick={() => go(1)} aria-label="Next testimonials" className={navBtnClass}>
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </div>

                        {/* Dot indicators — centered below */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDirection(i > page ? 1 : -1);
                                            setPage(i);
                                        }}
                                        aria-label={`Go to page ${i + 1}`}
                                        className={`rounded-full transition-all duration-300 ${
                                            i === page
                                                ? "w-6 h-2.5 bg-navy"
                                                : "w-2.5 h-2.5 bg-navy/20 hover:bg-navy/40"
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}



