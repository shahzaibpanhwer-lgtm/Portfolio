"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Words rise out of a mask, one after another. Splitting by word rather
 * than by letter keeps it legible mid-animation and keeps the DOM small.
 *
 * The full string stays in an sr-only span; the animated copies are
 * aria-hidden, so a screen reader hears the sentence once, not word-salad.
 */
export function SplitText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
  /** "mount" plays on load (hero); "view" plays on first scroll into view. */
  trigger = "view",
  accent = [],
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "view";
  /** Words to set in the accent colour. */
  accent?: string[];
}) {
  const reduce = usePrefersReducedMotion();
  const words = text.split(" ");

  if (reduce) return <span className={className}>{text}</span>;

  const play =
    trigger === "mount"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          viewport: { once: true, margin: "-60px" },
        };

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        {...play}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            // pb/-mb give descenders room inside the clip without
            // changing the line box.
            className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
          >
            <motion.span
              className={cn(
                "inline-block will-change-transform",
                wordClassName,
                accent.includes(word) && "text-accent",
              )}
              variants={{
                hidden: { y: "110%", rotate: 4 },
                show: {
                  y: "0%",
                  rotate: 0,
                  transition: { duration: 1, ease: EASE },
                },
              }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
