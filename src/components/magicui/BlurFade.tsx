"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

export function BlurFade({
    children,
    className,
    delay = 0,
    duration = 0.5,
}: BlurFadeProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            className={cn(className)}
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={
                isInView
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : { opacity: 0, y: 18, filter: "blur(8px)" }
            }
            transition={{
                duration,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            {children}
        </motion.div>
    );
}
