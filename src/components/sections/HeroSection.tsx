"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, MouseEvent } from "react";
import { BlurFade } from "@/components/magicui/BlurFade";
import { PhoneMockup3D } from "@/components/magicui/PhoneMockup3D";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { ArrowRight } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 448 512"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
  </svg>
);

function TikTokLogo3D() {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [0, 1], [25, -25]);
  const rotateY = useTransform(smoothX, [0, 1], [-25, 25]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      className="absolute z-20 top-24 left-[25%] lg:top-32 lg:-left-4 xl:left-8 max-lg:hidden w-fit"
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 1000 }}
    >
      <BlurFade delay={0.8}>
        <motion.div
          ref={ref}
          className="flex flex-col h-28 w-28 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-[#0d0d1a] border border-white/[0.08] pointer-events-auto cursor-default"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileHover={{
            scale: 1.15,
            boxShadow: "0 25px 50px rgba(0,0,0,0.6), 0 0 80px rgba(47,128,237,0.6)"
          }}
          // The base shadow needs to be applied when not hovering
          initial={{ boxShadow: "0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(47,128,237,0.3)" }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Apply counter-rotation to icon so it pops out of the 3D surface */}
          <motion.div
            style={{ translateZ: 20 }}
          >
            <TikTokIcon className="h-14 w-14 lg:h-12 lg:w-12 text-white" />
          </motion.div>
        </motion.div>
      </BlurFade>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-start lg:items-center overflow-hidden bg-[#0B1F3B] pt-24 lg:pt-16 px-6">
      {/* Interactive grid background */}
      <div className="absolute inset-0 z-0">
        <InteractiveGridPattern
          width={72}
          height={72}
          squares={[40, 40]}
          className="opacity-100 mix-blend-overlay"
          hoverColor="fill-white/[0.08]"
        />
      </div>

      {/* Radial gradient glow — left */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-[70vh] w-[50vw] -translate-y-1/2 opacity-8"
        style={{
          background:
            "radial-gradient(ellipse at left center, #2F80ED 0%, transparent 65%)",
          opacity: 0.08,
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl pt-8 pb-32 md:py-20 lg:py-28">
        {/* Grid layout on desktop, overlapping background on mobile */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">
          {/* ── Left: Content ── */}
          <div className="relative z-10 w-[85%] sm:w-[70%] lg:w-full lg:col-span-7">
            {/* Headline */}
            <BlurFade delay={0.1}>
              <h1 className="mb-4 sm:mb-6 text-[38px] leading-[1.1] font-normal tracking-tight text-white sm:text-5xl lg:text-[64px]">
                Own TikTok Shop as a <span className="text-[#2F80ED] font-semibold">revenue channel</span>
              </h1>
            </BlurFade>

            {/* Sub-headline */}
            <BlurFade delay={0.22}>
              <p className="mb-5 text-base leading-relaxed text-white/55 md:text-lg">
                Stackd partners with established consumer brands to build and
                operate the live commerce, creator and performance systems
                behind TikTok Shop — as a fully accountable revenue function.
              </p>
            </BlurFade>

            {/* Qualification line */}
            {/* <BlurFade delay={0.32}>
              <p className="mb-10 text-sm font-medium text-[#2FB7A8] italic">
                Best suited for growing consumer brands ready to treat TikTok
                Shop as a serious revenue channel.
              </p>
            </BlurFade> */}

            {/* CTA */}
            <BlurFade delay={0.42}>
              <motion.a
                href="/book"
                className="mt-6 sm:mt-8 lg:mt-12 inline-flex items-center gap-2 rounded-md bg-[#2F80ED] px-6 py-3 sm:px-8 sm:py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#2F80ED]/30"
                whileHover={{ scale: 1.03, backgroundColor: "#2570d4" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Request a Strategy Conversation
                <ArrowRight size={15} />
              </motion.a>
            </BlurFade>

            {/* Stats row */}
            <BlurFade delay={0.58}>
              <div className="mt-8 sm:mt-12 flex flex-col gap-6 border-t border-white/[0.08] pt-8 md:flex-row sm:gap-10">
                {[
                  { value: "100%", label: "Performance aligned" },
                  { value: "0", label: "Internal hires needed" },
                  { value: "Full-stack", label: "Live commerce ops" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-xs text-white/35">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </BlurFade>
          </div>

          {/* ── Right: Visuals (Phone + TikTok Logo) ── */}
          <div className="absolute right-[-35%] md:right-[-30%] top-[280px] md:top-[280px] z-0 flex w-[110%] sm:w-[100%] lg:col-span-5 lg:relative lg:right-auto lg:top-auto lg:z-10 lg:w-full lg:justify-center items-center justify-end pointer-events-none lg:pointer-events-auto">
            {/* Floating TikTok Logo */}
            <TikTokLogo3D />

            {/* 3D Phone Mockup */}
            <div className="w-full pointer-events-auto">
              <PhoneMockup3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
