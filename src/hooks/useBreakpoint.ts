import { useState, useEffect } from "react";

export function useBreakpoint() {
  type Breakpoint = "2xs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  const breakpoints: Record<Breakpoint, number> = {
    "2xs": 0,
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  };

  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      const current = (Object.keys(breakpoints) as Breakpoint[])
        .reverse()
        .find((key) => width >= breakpoints[key]) as Breakpoint;

      setBreakpoint(current || "xs");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isBreakpoint = (bp: Breakpoint) => {
    const keys = Object.keys(breakpoints) as Breakpoint[];
    const currentIndex = keys.indexOf(breakpoint);
    const checkIndex = keys.indexOf(bp);
    return currentIndex >= checkIndex;
  };

  return { breakpoint, isBreakpoint };
}
