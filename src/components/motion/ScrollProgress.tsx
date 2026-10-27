"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** Hairline under the navbar that fills as the page is read. */
export function ScrollProgress() {
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
      style={{ scaleX }}
    />
  );
}
