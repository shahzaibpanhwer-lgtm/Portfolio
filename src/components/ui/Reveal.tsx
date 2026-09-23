"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Tuple, not number[] — motion's Transition type requires the former. */
const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds of delay before this element animates in. */
  delay?: number;
  /** Distance travelled on the y-axis, in px. */
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "span";
  /**
   * "fade" lifts the block into place — right for text.
   * "wipe" uncovers it from the bottom edge, which suits a screenshot:
   * the image is revealed rather than slid around.
   */
  variant?: "fade" | "wipe";
};

/**
 * Fade-up on first scroll into view. Once only — re-animating on every
 * scroll pass is the fastest way to make a site feel cheap.
 * Fully disabled under prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = "div",
  variant = "fade",
}: RevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  /**
   * The wipe is a curtain that retracts, not a clip on the content.
   * Clipping the container made the browser resolve srcset before layout
   * settled, so Next served 3840px variants into 647px slots. Covering
   * and uncovering leaves the image fully laid out the whole time.
   */
  if (variant === "wipe") {
    const Tag = as;
    return (
      <Tag className={cn("relative", className)}>
        {children}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 block bg-bg"
          initial={{ scaleY: 1 }}
          whileInView={{ scaleY: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          style={{ transformOrigin: "bottom" }}
          transition={{ duration: 0.95, delay, ease: EASE }}
        />
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */

const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

/** Wraps a list whose children should animate in sequence. */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

/** Direct child of <Stagger>. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}
