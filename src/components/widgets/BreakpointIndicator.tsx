"use client";
 
import { useBreakpoint } from "@/hooks/useBreakpoint"; 
 
export const BreakpointIndicator = () => {
  const { breakpoint } = useBreakpoint();
  return (
    <>
      {/* breakpoint indicator  */}
      <div className="fixed right-5 bottom-5 z-[500] aspect-square w-10 rounded-full bg-yellow-400">
        {/* breakpoint indicator */}
        <div className="mx-auto w-fit p-2 text-center">{breakpoint}</div>
      </div>
    </>
  );
};
