"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * An endless ribbon that drifts on its own and speeds up — or reverses —
 * with the page's scroll velocity, so it feels attached to the scroll
 * rather than playing beside it.
 *
 * The item list is rendered four times and wrapped at -25%, which keeps
 * the seam invisible at any viewport width the list itself covers.
 */
export function Marquee({
  items,
  baseVelocity = -2.2,
  className,
}: {
  items: readonly string[];
  /** Percent of one copy's width per second; sign sets direction. */
  baseVelocity?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    let move = direction.current * baseVelocity * (delta / 1000);
    move += direction.current * move * Math.abs(f);
    baseX.set(baseX.get() + move);
  });

  const copy = (key: number) => (
    <span key={key} className="flex shrink-0 items-center" aria-hidden={key > 0}>
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 md:px-10">{item}</span>
          <span className="text-accent" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden whitespace-nowrap",
        "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]",
        className,
      )}
    >
      <motion.div className="flex" style={{ x: reduce ? 0 : x }}>
        {[0, 1, 2, 3].map(copy)}
      </motion.div>
    </div>
  );
}
