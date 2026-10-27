"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

/**
 * A statement that "reads itself" as the visitor scrolls: each word lifts
 * from faint to full ink in turn. Tied to scroll position, not time, so
 * the reader sets the pace.
 */
export function ScrollWords({
  text,
  className,
  /** Words to set in the accent colour once lit. */
  highlight = [],
}: {
  text: string;
  className?: string;
  highlight?: string[];
}) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  if (reduce) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const clean = word.replace(/[^\w/]/g, "");
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            accent={highlight.includes(clean)}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [6, 0]);
  return (
    <motion.span
      aria-hidden="true"
      style={{ opacity, y }}
      className={cn("mr-[0.25em] inline-block", accent && "text-accent")}
    >
      {children}
    </motion.span>
  );
}
