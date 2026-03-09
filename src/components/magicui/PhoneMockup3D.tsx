"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, MouseEvent } from "react";

const METRICS = [
  { label: "Monthly Revenue", value: "$247K", change: "+34%", positive: true },
  { label: "Live Sessions", value: "48", suffix: "/mo" },
  { label: "Creator Network", value: "124", suffix: " active" },
  { label: "Conversion", value: "6.2%", change: "+1.1%", positive: true },
];

const BARS = [38, 52, 44, 67, 58, 79, 95];

export function PhoneMockup3D() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Base rotation: rotateY(-24), rotateX(12)
  const rotateX = useTransform(smoothY, [0, 1], [16, 8]);
  const rotateY = useTransform(smoothX, [0, 1], [-18, -30]);

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
    <div
      ref={ref}
      className="relative flex w-full items-center justify-center select-none scale-100 origin-center"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient glow behind phone */}
      <div
        className="absolute -inset-[150px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(47,128,237,0.15) 0%, transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
        style={{
          perspective: "1200px",
        }}
      >
        {/* Floating loop */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{
            rotateY,
            rotateX,
            rotateZ: 4,
            scale: 1.3,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Phone shell */}
          <div
            className="relative w-[248px] rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)]"
            style={{
              background: "linear-gradient(160deg, #1a1a2e 0%, #0d0d1a 100%)",
              padding: "10px",
            }}
          >
            {/* Side buttons — left */}
            <div className="absolute -left-[3px] top-[88px] w-[3px] h-[28px] bg-white/10 rounded-l-sm" />
            <div className="absolute -left-[3px] top-[124px] w-[3px] h-[44px] bg-white/10 rounded-l-sm" />
            <div className="absolute -left-[3px] top-[176px] w-[3px] h-[44px] bg-white/10 rounded-l-sm" />
            {/* Side button — right */}
            <div className="absolute -right-[3px] top-[132px] w-[3px] h-[60px] bg-white/10 rounded-r-sm" />

            {/* Screen */}
            <div
              className="rounded-[32px] overflow-hidden relative"
              style={{
                background: "#0B1F3B",
                aspectRatio: "9 / 19.5",
              }}
            >
              {/* Subtle grid overlay on screen */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Status bar */}
              <div className="flex items-center justify-between px-5 pt-3 pb-1">
                <span className="text-white/40 text-[9px] font-medium">9:41</span>
                <div className="w-[60px] h-[14px] bg-black rounded-full" />
                <div className="flex items-center gap-1">
                  <div className="flex gap-[2px] items-end">
                    {[3, 5, 7, 9].map((h, i) => (
                      <div
                        key={i}
                        className="w-[3px] bg-white/40 rounded-sm"
                        style={{ height: h }}
                      />
                    ))}
                  </div>
                  <div className="w-3 h-3 rounded-sm border border-white/40 relative">
                    <div className="absolute inset-[2px] bg-white/40 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* App header */}
              <div className="px-4 pt-2 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/40 text-[8px] uppercase tracking-widest font-medium">
                      Stackd Ops
                    </div>
                    <div className="text-white text-[12px] font-bold mt-0.5">
                      Revenue Dashboard
                    </div>
                  </div>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-[#2FB7A8]"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Primary metric */}
              <div className="mx-4 mb-3 bg-white/[0.05] border border-white/[0.08] rounded-xl px-3 py-2.5">
                <div className="text-white/35 text-[8px] uppercase tracking-widest mb-1">
                  Monthly Revenue
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-white text-[22px] font-bold leading-none">
                    $247K
                  </span>
                  <span className="text-[#2FB7A8] text-[10px] font-semibold">
                    ↑ 34%
                  </span>
                </div>
              </div>

              {/* Bar chart */}
              <div className="mx-4 mb-3">
                <div className="text-white/30 text-[8px] mb-1.5 uppercase tracking-widest">
                  Revenue Trend
                </div>
                <div className="flex items-end gap-[4px] h-[36px]">
                  {BARS.map((h, i) => (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-sm"
                      initial={{ scaleY: 0 }}
                      animate={inView ? { scaleY: 1 } : {}}
                      transition={{
                        duration: 0.5,
                        delay: 0.6 + i * 0.07,
                        ease: [0.21, 0.47, 0.32, 0.98],
                      }}
                      style={{
                        height: `${h}%`,
                        background:
                          i === BARS.length - 1
                            ? "#2F80ED"
                            : "rgba(47,128,237,0.25)",
                        transformOrigin: "bottom",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Mini stats grid */}
              <div className="mx-4 grid grid-cols-2 gap-1.5">
                {[
                  { label: "Live Sessions", value: "48/mo" },
                  { label: "Active Creators", value: "124" },
                  { label: "Avg. Conversion", value: "6.2%" },
                  { label: "Affiliate Orders", value: "1,847" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="bg-white/[0.04] border border-white/[0.07] rounded-lg px-2.5 py-2"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                  >
                    <div className="text-white/30 text-[7px] uppercase tracking-wider mb-0.5">
                      {s.label}
                    </div>
                    <div className="text-white text-[11px] font-bold">{s.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Live indicator strip */}
              <div className="mx-4 mt-3 flex items-center gap-2 bg-[#2FB7A8]/10 border border-[#2FB7A8]/20 rounded-lg px-2.5 py-1.5">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-[#2FB7A8] shrink-0"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <span className="text-[#2FB7A8] text-[8px] font-semibold tracking-wide uppercase">
                  Live session active
                </span>
              </div>

              {/* Bottom home indicator */}
              <div className="flex justify-center mt-4 pb-3">
                <div className="w-[80px] h-[4px] bg-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
