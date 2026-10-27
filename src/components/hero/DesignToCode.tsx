"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { HeroVisualFrame } from "@/components/hero/Frame";

const EASE = [0.16, 1, 0.3, 1] as const;

const CODE: { t: string; c?: string }[][] = [
  [{ t: "export function ", c: "k" }, { t: "ProjectCard", c: "f" }, { t: "() {" }],
  [{ t: "  return (" }],
  [{ t: "    <" }, { t: "article", c: "k" }, { t: " className", c: "a" }, { t: "=" }, { t: '"card"', c: "s" }, { t: ">" }],
  [{ t: "      <" }, { t: "Image", c: "f" }, { t: " src", c: "a" }, { t: "={" }, { t: "cover", c: "v" }, { t: "} />" }],
  [{ t: "      <" }, { t: "h3", c: "k" }, { t: ">" }, { t: "Yemo", c: "v" }, { t: "</" }, { t: "h3", c: "k" }, { t: ">" }],
  [{ t: "      <" }, { t: "Button", c: "f" }, { t: ">" }, { t: "View case", c: "v" }, { t: "</" }, { t: "Button", c: "f" }, { t: ">" }],
  [{ t: "    </" }, { t: "article", c: "k" }, { t: ">" }],
  [{ t: "  );" }],
  [{ t: "}" }],
];

const tone: Record<string, string> = {
  k: "text-accent",
  f: "text-ink",
  a: "text-ink-dim",
  s: "text-accent-soft",
  v: "text-ink",
};

/**
 * One component, shown as a design and then as the code that builds it,
 * flipping back and forth. The hero claims "designer and developer";
 * this shows the same object through both lenses.
 */
export function DesignToCode() {
  const reduce = usePrefersReducedMotion();
  const [mode, setMode] = useState<"design" | "code">("design");

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setMode((m) => (m === "design" ? "code" : "design")),
      3600,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <HeroVisualFrame placement="low">
      <div className="flex h-full w-full items-center justify-end">
        <motion.div
          className="relative w-[78%] overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-[0_40px_120px_-30px_color-mix(in_srgb,_var(--color-accent)_35%,_transparent)] backdrop-blur"
          style={{ transformPerspective: 1400, rotateY: -10, rotateX: 6 }}
        >
          {/* chrome */}
          <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
            </div>
            <div className="relative flex rounded-full border border-line bg-bg p-0.5 text-[11px]">
              {(["design", "code"] as const).map((m) => (
                <span key={m} className="relative px-3 py-1 capitalize">
                  {mode === m ? (
                    <motion.span
                      layoutId="dtc-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className={`relative ${mode === m ? "text-bg" : "text-ink-faint"}`}>
                    {m === "design" ? "Figma" : "Code"}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-[300px]">
            <AnimatePresence mode="wait" initial={false}>
              {mode === "design" ? (
                <motion.div
                  key="design"
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {/* canvas dots */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  {/* the component, as a wireframe with a selection box */}
                  <div className="relative w-[62%]">
                    <div className="rounded-xl border border-line bg-bg p-3">
                      <div className="aspect-[16/9] rounded-lg bg-gradient-to-br from-accent/30 to-accent/5" />
                      <div className="mt-3 h-3 w-1/2 rounded bg-ink/80" />
                      <div className="mt-2 h-2 w-4/5 rounded bg-ink-faint/50" />
                      <div className="mt-4 h-7 w-24 rounded-full bg-accent" />
                    </div>
                    <div className="absolute -inset-2 rounded-[14px] border border-accent">
                      {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
                        <span key={pos} className={`absolute h-2 w-2 border border-accent bg-bg ${pos}`} />
                      ))}
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 rounded bg-accent px-1.5 py-0.5 text-[10px] font-medium text-bg tabular-nums">
                        320 × 248
                      </span>
                    </div>
                  </div>
                  {/* collaborator cursor */}
                  <motion.div
                    className="absolute left-[64%] top-[30%]"
                    animate={reduce ? undefined : { x: [0, -40, -10, 0], y: [0, 30, 60, 0] }}
                    transition={{ duration: 3.4, ease: "easeInOut" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" className="text-accent">
                      <path d="M1 1l5 14 2-6 6-2z" fill="currentColor" />
                    </svg>
                    <span className="ml-3 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-bg">
                      Shahzaib
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  className="absolute inset-0 px-5 py-6 font-mono text-[12.5px] leading-[1.75]"
                  initial={{ opacity: 0, filter: "blur(8px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(8px)" }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {CODE.map((line, i) => (
                    <motion.div
                      key={i}
                      className="flex whitespace-pre"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.3 }}
                    >
                      <span className="mr-4 w-4 text-right text-ink-faint/60">{i + 1}</span>
                      {line.map((tok, j) => (
                        <span key={j} className={tok.c ? tone[tok.c] : "text-ink-faint"}>
                          {tok.t}
                        </span>
                      ))}
                    </motion.div>
                  ))}
                  <motion.span
                    className="ml-8 inline-block h-4 w-2 translate-y-0.5 bg-accent"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* status bar */}
          <div className="flex items-center justify-between border-t border-line-soft px-4 py-2.5 text-[11px] text-ink-faint">
            <span>ProjectCard.tsx</span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Deployed
            </span>
          </div>
        </motion.div>
      </div>
    </HeroVisualFrame>
  );
}
