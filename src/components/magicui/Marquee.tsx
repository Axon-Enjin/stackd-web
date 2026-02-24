"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    speed?: "slow" | "normal" | "fast";
    pauseOnHover?: boolean;
}

export function Marquee({
    children,
    className,
    pauseOnHover = true,
}: MarqueeProps) {
    return (
        <div
            className={cn(
                "relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
                className,
            )}
        >
            <div
                className={cn(
                    "flex min-w-full shrink-0 gap-8 animate-marquee",
                    pauseOnHover && "hover:[animation-play-state:paused]",
                )}
            >
                {children}
                {/* Duplicate for seamless loop */}
                {children}
            </div>
        </div>
    );
}
