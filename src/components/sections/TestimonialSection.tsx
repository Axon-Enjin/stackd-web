"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BlurFade } from "@/components/magicui/BlurFade";
import {
    useAllTestimonialsQuery,
    type TestimonialItem,
} from "@/features/Testimonials/hooks/useAllTestimonialsQuery";
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
        <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-navy p-10 shadow-xl transition-all duration-300 hover:border-brand-blue/30 hover:shadow-brand-blue/10">
            {/* Top Row: Logo (if exists) & Quote Icon */}
            <div className="mb-8 flex items-start justify-between">
                <div className="flex h-14 w-auto items-center overflow-hidden">
                    {testimonial.companyLogoUrl ? (
                        <img
                            src={testimonial.companyLogoUrl256 || testimonial.companyLogoUrl}
                            alt="Company logo"
                            className="h-full w-full object-contain object-left transition-opacity"
                        />
                    ) : (
                        <div className="h-px w-16 bg-white/20" />
                    )}
                </div>
                <span className="font-serif text-5xl leading-none text-brand-blue/30">
                    &ldquo;
                </span>
            </div>

            {/* Quote Body */}
            <div className="mb-10 flex-1">
                <p className="text-base leading-relaxed text-white/90 md:text-lg">
                    {testimonial.body}
                </p>
            </div>

            {/* Attribution: Large Avatar & Info */}
            <div className="mt-auto flex items-center gap-5 pt-8 border-t border-white/10">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-brand-blue/30 bg-white/5 shadow-inner transition-transform duration-300">
                    <img
                        src={testimonial.imageUrl256 || testimonial.imageUrl}
                        alt={testimonial.title}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <h4 className="truncate text-lg font-bold text-white">
                        {testimonial.title}
                    </h4>
                    <p className="truncate text-xs font-bold tracking-[0.12em] uppercase text-brand-blue/80">
                        {testimonial.description}
                        {testimonial.description && testimonial.company && " — "}
                        {testimonial.company}
                    </p>
                </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-brand-blue/5 blur-3xl" />
        </div>
    );
}

export function TestimonialSection() {
    const { data: testimonials, isLoading, isError } = useAllTestimonialsQuery();
    const { isBreakpoint } = useBreakpoint();

    // Changed to 2 cards per row on large screens for a wider layout
    const perPage = isBreakpoint("lg") ? 2 : 1;

    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevPerPage = useRef(perPage);

    const totalPages = testimonials
        ? Math.ceil(testimonials.length / perPage)
        : 0;

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
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [page, paused, go, totalPages]);

    const gridCols = perPage === 2 ? "grid-cols-2" : "grid-cols-1";

    if (isLoading) {
        return (
            <section className="bg-soft-white px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className={`grid ${gridCols} gap-6`}>
                        {[...Array(perPage)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-navy/10 h-[340px] animate-pulse rounded-2xl sm:h-[380px] lg:h-[420px]"
                            />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !testimonials || testimonials.length === 0) {
        return null;
    }

    const visibleCards = testimonials.slice(
        page * perPage,
        page * perPage + perPage,
    );

    const navBtnClass =
        "w-11 h-11 rounded-full border border-[#E8ECF2] bg-white shadow-sm flex items-center justify-center text-navy/50 hover:text-brand-blue hover:border-brand-blue hover:shadow-md transition-all duration-200 shrink-0";

    return (
        <section className="bg-soft-white px-6 py-24">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <BlurFade delay={0.05}>
                    <p className="text-brand-blue mb-4 text-xs font-semibold tracking-[0.18em] uppercase">
                        Client Success
                    </p>
                </BlurFade>
                <BlurFade delay={0.1}>
                    <h2 className="text-navy mb-5 text-3xl leading-tight font-bold tracking-tight md:text-4xl">
                        What our partners say.
                    </h2>
                </BlurFade>
                <div className="mb-12 max-w-3xl">
                    <BlurFade delay={0.2}>
                        <p className="text-base leading-relaxed text-[#1A1A1A]/60 md:text-lg">
                            Don&apos;t just take our word for it. Hear from the brands that
                            have rapidly scaled their direct-to-consumer revenue using our
                            live commerce system.
                        </p>
                    </BlurFade>
                </div>

                {/* Carousel */}
                <BlurFade delay={0.3}>
                    <div
                        onMouseEnter={() => setPaused(true)}
                        onMouseLeave={() => setPaused(false)}
                    >
                        {/* Container for cards - no side arrows here */}
                        <div className="overflow-hidden">
                            <AnimatePresence mode="wait" custom={direction}>
                                <motion.div
                                    key={`${page}-${perPage}`}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        duration: 0.22,
                                        ease: [0.25, 0.46, 0.45, 0.94],
                                    }}
                                    className={`grid ${gridCols} gap-6`}
                                >
                                    {visibleCards.map((testimonial) => (
                                        <TestimonialCard
                                            key={testimonial.id}
                                            testimonial={testimonial}
                                        />
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Pagination Controls — Arrows flanking dots */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-8">
                                <button
                                    onClick={() => go(-1)}
                                    aria-label="Previous testimonials"
                                    className={navBtnClass}
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="flex items-center gap-2.5">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setDirection(i > page ? 1 : -1);
                                                setPage(i);
                                            }}
                                            aria-label={`Go to page ${i + 1}`}
                                            className={`rounded-full transition-all duration-300 ${i === page
                                                ? "bg-navy h-2 w-8"
                                                : "bg-navy/20 hover:bg-navy/40 h-2 w-2"
                                                }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => go(1)}
                                    aria-label="Next testimonials"
                                    className={navBtnClass}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </BlurFade>
            </div>
        </section>
    );
}
