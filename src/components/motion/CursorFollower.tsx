"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * A soft ring that trails the pointer and swells over anything clickable.
 * Elements can name what a click will do with data-cursor="View", which
 * the ring then shows as a label.
 *
 * The native cursor stays: this decorates the pointer, it does not replace
 * it, so precision and OS accessibility settings are untouched. Mouse only.
 */
export function CursorFollower() {
  const reduce = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<"idle" | "link" | "label">("idle");
  const [label, setLabel] = useState("");

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (reduce) return;
    const mql = window.matchMedia("(pointer: fine) and (hover: hover)");
    if (!mql.matches) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a media query once, on mount
    setEnabled(true);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);

      const target = e.target as Element | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setMode("label");
        setLabel(labelled.dataset.cursor ?? "");
        return;
      }
      const clickable = target?.closest("a, button, [role='button'], label, select");
      setMode(clickable ? "link" : "idle");
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, x, y]);

  if (!enabled || reduce) return null;

  const size = mode === "label" ? 88 : mode === "link" ? 52 : 28;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor:
            mode === "label" ? "rgba(77,124,254,0.95)" : "rgba(77,124,254,0)",
          borderColor:
            mode === "idle" ? "rgba(245,245,245,0.35)" : "rgba(77,124,254,0.8)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        style={{ borderWidth: 1, borderStyle: "solid" }}
      >
        <AnimatePresence>
          {mode === "label" ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-bg"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
