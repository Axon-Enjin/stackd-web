"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect, useId } from "react";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    squares?: [number, number]; // [horizontal_count, vertical_count]
    className?: string;
    squaresClassName?: string;
    hoverColor?: string;
}

/**
 * An interactive grid pattern where random grid squares
 * subtly light up and fade out.
 */
export function InteractiveGridPattern({
    width = 64,
    height = 64,
    squares = [40, 40],
    className,
    squaresClassName,
    hoverColor = "fill-white/[0.06]",
    ...props
}: InteractiveGridPatternProps) {
    const [activeSquares, setActiveSquares] = useState<number[]>([]);

    const horizontalSquares = squares[0];
    const verticalSquares = squares[1];

    const patternId = useId();

    useEffect(() => {
        // Randomly select a few squares to light up out of the grid
        const interval = setInterval(() => {
            const numSquaresToLight = Math.floor(Math.random() * 5) + 3; // 3 to 7 squares at a time
            const totalSquares = horizontalSquares * verticalSquares;

            const newSquares = Array.from({ length: numSquaresToLight }).map(() =>
                Math.floor(Math.random() * totalSquares)
            );

            setActiveSquares(newSquares);
        }, 2000); // Changes every 2s

        return () => clearInterval(interval);
    }, [horizontalSquares, verticalSquares]);

    return (
        <svg
            width="100%"
            height="100%"
            className={cn("absolute inset-0 h-full w-full", className)}
            {...props}
        >
            <defs>
                <pattern
                    id={patternId}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    x="-1"
                    y="-1"
                >
                    <path
                        d={`M.5 ${height}V.5H${width}`}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.04)"
                        strokeWidth="1"
                    />
                </pattern>
            </defs>

            {/* Background Grid Lines */}
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />

            {/* Interactive Overlay Grid */}
            <svg x="-1" y="-1" className="overflow-visible">
                {Array.from({ length: horizontalSquares * verticalSquares }).map((_, i) => {
                    const x = (i % horizontalSquares) * width;
                    const y = Math.floor(i / horizontalSquares) * height;
                    return (
                        <rect
                            key={i}
                            x={x}
                            y={y}
                            width={width - 1}
                            height={height - 1}
                            className={cn(
                                "transition-all duration-[2000ms] ease-in-out cursor-default",
                                activeSquares.includes(i) ? hoverColor : "fill-transparent",
                                squaresClassName
                            )}
                        />
                    );
                })}
            </svg>
        </svg>
    );
}
