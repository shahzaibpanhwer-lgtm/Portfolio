"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

/* The deck shows the first three projects that have a cover. */
const deck = projects.filter((p) => p.cover).slice(0, 3);

/* Where a card sits by its depth in the stack: front, middle, back.
   Back cards peek out above the front one and are dimmed, never made
   see-through, so the stack reads as solid. */
const SLOTS = [
  { y: "0%", scale: 1 },
  { y: "-8%", scale: 0.93 },
  { y: "-15%", scale: 0.86 },
] as const;
const DIM = [0, 0.5, 0.72];

/* The card that just left the front drops down and away, then settles
   into the back slot. Constant objects, so a re-render that does not
   move the card does not replay it. */
const TO_BACK = {
  // null = start from wherever the card is now (front, or middle when a
  // tab jumps the deck).
  y: [null, "16%", SLOTS[2].y],
  scale: [null, 0.95, SLOTS[2].scale],
  opacity: [null, 0, 1],
  transition: { duration: 0.9, times: [0, 0.45, 1], ease: EASE },
};
const SPRING = { type: "spring", stiffness: 170, damping: 24, mass: 0.9 } as const;

/**
 * Statement on the left, a deck of real projects on the right that deals
 * itself: the front card slides away and goes to the back every few
 * seconds. The first screen carries the claim and the evidence for it.
 */
export function Hero() {
  const reduce = usePrefersReducedMotion();
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 18, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 1, delay, ease: EASE },
        };

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32"
      aria-labelledby="hero-heading"
    >
      <HeroBackdrop />

      <div className="container-edge relative z-10 grid flex-1 items-center gap-16 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-20">
        {/* copy */}
        <div>
          <motion.p
            {...fade(0.05)}
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface/60 px-4 py-2 text-xs text-ink-dim backdrop-blur sm:text-[13px]"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {site.availability}
          </motion.p>

          <h1
            id="hero-heading"
            className="mt-8 max-w-[12ch] font-display text-[clamp(2.75rem,6.6vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.055em]"
          >
            <SplitText
              text="Design and code, in one"
              trigger="mount"
              delay={0.1}
              wordClassName="silver"
            />{" "}
            <SplitText
              text="pair of hands."
              trigger="mount"
              delay={0.4}
              wordClassName="text-accent"
            />
          </h1>

          <motion.p
            {...fade(0.6)}
            className="mt-7 max-w-[30rem] text-base leading-relaxed text-ink-dim md:text-lg"
          >
            I&rsquo;m Shahzaib — full-stack developer and UI/UX designer from
            Pakistan, taking products from the first wireframe to
            production.
          </motion.p>

          <motion.div {...fade(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
            <Magnetic>
              <ButtonLink href="#work" variant="primary">
                Explore my work
                <Arrow />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#contact" variant="ghost">
                Book a call
              </ButtonLink>
            </Magnetic>
          </motion.div>
        </div>

        {/* project deck */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          className="relative mx-auto w-full max-w-[600px] lg:mr-0"
        >
          <ProjectDeck reduce={!!reduce} />
        </motion.div>
      </div>

      <MetaRail />
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * A stack of real projects that turns over on its own. The front card
 * drops away to the back while the others glide forward on a spring.
 *
 * The progress bar under the active tab is the clock: when its fill
 * finishes, the deck advances. Pausing the bar (hover or focus) pauses
 * the deck, so the two can never drift apart. Clicking a back card or a
 * tab brings that project forward. Under reduced motion nothing turns on
 * its own; the tabs still switch.
 */
function ProjectDeck({ reduce }: { reduce: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = deck.length;

  const advance = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive((a) => (a + 1) % n);
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <ul className="relative mt-[13%] aspect-[16/10] w-full" aria-label="Featured projects">
        {deck.map((project, i) => {
          const depth = (i - active + n) % n;
          const front = depth === 0;
          return (
            <motion.li
              key={project.slug}
              className="absolute inset-0"
              style={{ zIndex: n - depth, transformOrigin: "50% 0%" }}
              initial={false}
              animate={depth === n - 1 && n > 2 ? TO_BACK : SLOTS[depth]}
              transition={SPRING}
            >
              <Link
                href={`/work/${project.slug}`}
                aria-label={`${project.title} — view case study`}
                tabIndex={front ? 0 : -1}
                onClick={(e) => {
                  if (front) return;
                  e.preventDefault();
                  setActive(i);
                }}
                className="group/deck relative block h-full rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.16] to-white/[0.03] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-offset-4"
              >
                <span className="relative block h-full overflow-hidden rounded-[15px] bg-surface">
                  <Image
                    src={project.cover!}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 90vw, 600px"
                    priority={i === 0}
                    className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/deck:scale-[1.03]"
                  />
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 bg-bg"
                    initial={false}
                    animate={{ opacity: DIM[depth] }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
                <motion.span
                  className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-bg/80 px-3 py-1.5 text-[13px] font-medium text-ink backdrop-blur"
                  initial={false}
                  animate={{ opacity: front ? 1 : 0, y: front ? 0 : 6 }}
                  transition={{ duration: 0.5, delay: front ? 0.25 : 0, ease: EASE }}
                >
                  {project.title}
                  <span className="text-ink-faint"> · {project.categories[0]}</span>
                </motion.span>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      {/* tabs, each with its own progress line */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {deck.map((project, i) => {
          const on = i === active;
          return (
            <button
              key={project.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${project.title}`}
              aria-pressed={on}
              className="group/tab min-h-11 text-left"
            >
              <span
                className={`block truncate text-xs transition-colors duration-300 ${
                  on ? "text-ink" : "text-ink-faint group-hover/tab:text-ink-dim"
                }`}
              >
                {project.title}
              </span>
              <span className="mt-2 block h-[2px] overflow-hidden rounded-full bg-line">
                {on ? (
                  <span
                    key={active}
                    className={`block h-full origin-left rounded-full bg-accent ${
                      reduce ? "" : "deck-progress"
                    }`}
                    style={{ animationPlayState: paused ? "paused" : "running" }}
                    onAnimationEnd={advance}
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MetaRail() {
  return (
    <div className="container-edge relative z-10 pb-8">
      <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line-soft pt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint">
        <span>Based in Pakistan · GMT+5</span>
        <span className="hidden sm:inline">UI/UX · Full-stack · WordPress</span>
        <a href="#work" className="transition-colors duration-300 hover:text-ink">
          Scroll to explore ↓
        </a>
      </div>
    </div>
  );
}

/**
 * A slow light beam sweeping over a hairline grid that fades out toward
 * the edges. Light, not decoration: it gives the deck somewhere to sit.
 */
function HeroBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 grain" aria-hidden="true">
      <div
        className="hero-beam absolute -top-52 left-[35%] h-[1400px] w-[1000px] blur-[20px]"
        style={{
          background:
            "conic-gradient(from 160deg at 50% 0%, transparent 0deg, color-mix(in srgb, var(--color-accent) 10%, transparent) 20deg, transparent 40deg)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(70% 70% at 70% 40%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(70% 70% at 70% 40%, #000, transparent)",
        }}
      />
    </div>
  );
}
