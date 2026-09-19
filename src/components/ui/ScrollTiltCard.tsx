"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * A screenshot that starts tilted back in 3D and settles flat as it
 * scrolls into view.
 *
 * Built on the project's own motion package rather than adding
 * framer-motion (same library, older name), and it wraps whatever it is
 * given — so the card keeps the site's BrowserFrame chrome instead of
 * bringing its own border and shadow.
 *
 * The transform is scoped to this wrapper. rotateX creates a containing
 * block, which would break position: sticky on any descendant, so
 * nothing sticky may live inside it.
 */
export function ScrollTiltCard({
  children,
  /** Starting tilt in degrees. Kept shallow on purpose. */
  tilt = 14,
}: {
  children: ReactNode;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  /* Spring the progress so the settle eases out instead of tracking the
     scroll wheel one-to-one, which reads mechanical. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const rotateX = useTransform(progress, [0, 1], [tilt, 0]);
  const scale = useTransform(progress, [0, 1], [0.94, 1]);
  const opacity = useTransform(progress, [0, 0.4], [0.55, 1]);

  if (reduce) return <>{children}</>;

  return (
    <div ref={ref} style={{ perspective: "1600px" }}>
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          transformOrigin: "50% 0%",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
