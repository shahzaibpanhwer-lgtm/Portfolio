"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { booking } from "@/data/site";
import { formatTime } from "@/lib/booking";
import { getLenis } from "@/lib/smoothScroll";
import { useHydrated } from "@/lib/useHydrated";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/** "Local time 4:12 PM" — the host's clock, ticking. */
export function LocalTime() {
  const hydrated = useHydrated();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="tabular-nums">
      {hydrated ? formatTime(now, booking.timeZone) : "—"} in {booking.zoneLabel}
    </span>
  );
}

export function BackToTop() {
  const reduce = usePrefersReducedMotion();
  return (
    <button
      type="button"
      onClick={() => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
      className="group/top inline-flex min-h-11 items-center gap-2 text-ink-faint transition-colors duration-300 hover:text-ink"
    >
      Back to top
      <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-line transition-colors duration-300 group-hover/top:border-accent">
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3 w-3 transition-transform duration-500 ease-out group-hover/top:-translate-y-0.5">
          <path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}

/**
 * The name, set as large as the viewport allows, rising letter by letter
 * as the footer comes into view. A sign-off rather than navigation.
 */
export function Wordmark({ text }: { text: string }) {
  const reduce = usePrefersReducedMotion();
  return (
    <p
      aria-hidden="true"
      className="select-none whitespace-nowrap text-center font-display text-[clamp(2.25rem,10.4vw,12.5rem)] font-bold leading-[0.8] tracking-[-0.06em] text-transparent [-webkit-text-stroke:1px_var(--color-line)]"
    >
      {text.split("").map((ch, i) =>
        reduce ? (
          <span key={i}>{ch === " " ? " " : ch}</span>
        ) : (
          <motion.span
            key={i}
            className="inline-block transition-colors duration-500 hover:text-accent"
            initial={{ y: "60%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ),
      )}
    </p>
  );
}
