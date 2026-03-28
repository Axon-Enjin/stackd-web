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
          className="absolute z-20 top-6 -left-4 lg:top-32 lg:-left-4 xl:left-8 w-fit"
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      style={{ perspective: 1000 }}
    >
      <BlurFade delay={0.8}>
        <motion.div
          ref={ref}
          className="flex flex-col h-8 w-8 lg:h-24 lg:w-24 items-center justify-center rounded-full bg-[#0d0d1a] border border-white/[0.08] pointer-events-auto cursor-default"
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
            <TikTokIcon className="h-3.5 w-3.5 lg:h-12 lg:w-12 text-white" />
          </motion.div>
        </motion.div>
      </BlurFade>
    </motion.div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex overflow-hidden bg-[#0B1F3B] pt-24 pb-14 sm:pb-20 lg:min-h-screen lg:items-center lg:pt-16 lg:pb-0 px-6">
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

      <div className="relative z-10 mx-auto w-full max-w-6xl lg:py-28">
        {/* Grid layout */}
        <div className="relative flex flex-col lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 xl:gap-16">

          {/* ── Left: all content ── */}
          <div className="relative z-10 lg:col-span-7">

            {/* Headline */}
            <BlurFade delay={0.1}>
              <h1 className="text-[32px] leading-[1.15] font-normal tracking-tight text-white sm:text-5xl lg:text-[64px]">
                Own TikTok Shop as a <span className="text-[#2F80ED] font-semibold">revenue channel</span>
              </h1>
            </BlurFade>

            {/* Phone mockup — mobile only, sits between headline and body */}
            <div className="lg:hidden my-8 flex justify-center">
              <div className="relative w-[115px] h-[245px]">
                <TikTokLogo3D />
                <div className="absolute top-0 left-0 origin-top-left scale-[0.465] pointer-events-auto">
                  <PhoneMockup3D />
                </div>
              </div>
            </div>

            {/* Body text */}
            <BlurFade delay={0.22}>
              <p className="mt-4 mb-0 text-base leading-relaxed text-white/55 lg:mt-6 lg:mb-5 lg:text-lg">
                Stackd partners with established consumer brands to build and
                operate the live commerce, creator and performance systems
                behind TikTok Shop — as a fully accountable revenue function.
              </p>
            </BlurFade>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 lg:mt-12">
              <BlurFade delay={0.42}>
                <motion.a
                  href="/book"
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-[#2F80ED] px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#2F80ED]/30 sm:px-8 sm:py-4 lg:inline-flex lg:w-auto lg:justify-start"
                  whileHover={{ scale: 1.03, backgroundColor: "#2570d4" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  Request a Strategy Conversation
                  <ArrowRight size={15} />
                </motion.a>
              </BlurFade>

              <BlurFade delay={0.48}>
                <motion.a
                  href="https://www.canva.com/design/DAHEezFFd7I/fuSVhCFEQtHNttuhJ717Cw/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-6 py-3 text-sm font-semibold tracking-wide text-[#0B1F3B] shadow-md border border-[#E8ECF2] sm:px-8 sm:py-4 lg:inline-flex lg:w-auto lg:justify-start"
                  whileHover={{ scale: 1.03, backgroundColor: "#f8fafc" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  View Case Study
                </motion.a>
              </BlurFade>
            </div>

            {/* Stats row */}
            <BlurFade delay={0.58}>
              <div className="mt-8 flex flex-row gap-4 border-t border-white/[0.08] pt-6 sm:mt-12 sm:gap-10">
                {[
                  { value: "100%", label: "Performance aligned" },
                  { value: "0", label: "Internal hires needed" },
                  { value: "Full-stack", label: "Live commerce ops" },
                ].map((stat) => (
                  <div key={stat.label} className="flex-1">
                    <div className="text-lg font-bold text-white sm:text-2xl">
                      {stat.value}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/35 sm:text-xs">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </BlurFade>

          </div>

          {/* ── Right: Phone + TikTok Logo — desktop only ── */}
          <div className="relative z-10 hidden lg:flex lg:col-span-5 lg:w-full lg:justify-center lg:items-center pointer-events-auto">
            <TikTokLogo3D />
            <div className="w-full pointer-events-auto">
              <PhoneMockup3D />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
