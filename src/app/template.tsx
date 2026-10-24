"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { ReactNode } from "react";

/**
 * Route transition. Opacity only — animating transform here would make
 * this a containing block and break the sticky headings inside case
 * studies. A short fade is enough to soften navigation.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
