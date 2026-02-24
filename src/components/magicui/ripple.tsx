"use client";

import { cn } from "@/lib/utils";

interface RippleProps {
    mainCircleSize?: number;
    mainCircleOpacity?: number;
    numCircles?: number;
    className?: string;
    color?: string;
}

export function Ripple({
    mainCircleSize = 180,
    mainCircleOpacity = 0.18,
    numCircles = 6,
    className,
    color = "47, 128, 237",
}: RippleProps) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden",
                className,
            )}
        >
            {Array.from({ length: numCircles }, (_, i) => {
                const size = mainCircleSize + i * 90;
                const opacity = mainCircleOpacity - i * 0.025;
                const delay = `${i * 0.4}s`;
                const border = i === 0 ? "solid" : i % 2 === 0 ? "solid" : "dashed";

                return (
                    <div
                        key={i}
                        className="absolute rounded-full animate-ripple"
                        style={{
                            width: `${size}px`,
                            height: `${size}px`,
                            opacity: Math.max(opacity, 0),
                            animationDelay: delay,
                            borderWidth: "1px",
                            borderStyle: border,
                            borderColor: `rgba(${color}, ${Math.max(0.08 + i * 0.04, 0.06)})`,
                            backgroundColor: i === 0 ? `rgba(${color}, 0.04)` : "transparent",
                        }}
                    />
                );
            })}
        </div>
    );
}
