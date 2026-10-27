import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * The slot every hero visual sits in: right half of the hero from md up,
 * hidden below it where it would collide with the headline.
 */
const PLACEMENT = {
  center: "lg:right-[-2%] xl:right-[3%] top-1/2",
  /* Sits lower, under the end of the headline — for solid shapes that
     must not overlap the type. */
  low: "lg:right-[2%] xl:right-[4%] top-1/2 lg:top-[62%]",
  /* Bleeds off the right edge — for wide shapes. */
  bleed: "lg:right-[-7%] xl:right-[-4%] top-1/2",
};

export function HeroVisualFrame({
  children,
  placement = "center",
}: {
  children: ReactNode;
  placement?: keyof typeof PLACEMENT;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -translate-y-1/2",
        "hidden md:block",
        "md:right-[-18%] md:h-[380px] md:w-[380px] md:opacity-70",
        "lg:h-[560px] lg:w-[560px] lg:opacity-100",
        PLACEMENT[placement],
      )}
    >
      {children}
    </div>
  );
}
