"use client";

import Image from "next/image";
import Link from "next/link";
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
          className="relative mx-auto w-full max-w-[640px] pr-[18%] pt-[16%] lg:mr-0"
        >
          <ProjectDeck />
        </motion.div>
      </div>

      <MetaRail />
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Three stacked cards on one CSS loop, each offset by a third of it, so
 * the deck cycles with no JavaScript timer. Each card is a real link; the
 * front one is on top, so it is the one a click lands on, and hovering
 * the deck pauses it. Under reduced motion it rests as a static fan.
 */
function ProjectDeck() {
  return (
    <ul className="deck relative aspect-[3/2] w-full" aria-label="Featured projects">
      {deck.map((project, i) => (
        <li key={project.slug} className={`deck-card deck-card-${i} absolute inset-0`}>
          <Link
            href={`/work/${project.slug}`}
            aria-label={`${project.title} — view case study`}
            className="relative block h-full rounded-[22px] border border-white/10 bg-gradient-to-b from-white/[0.16] to-white/[0.03] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] focus-visible:outline-offset-4"
          >
            <span className="relative block h-full overflow-hidden rounded-[15px]">
              <Image
                src={project.cover!}
                alt=""
                fill
                sizes="(max-width: 1024px) 80vw, 560px"
                priority={i === 0}
                className="object-cover object-top"
              />
            </span>
            <span className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-bg/80 px-3 py-1.5 text-[13px] font-medium text-ink backdrop-blur">
              {project.title}
              <span className="text-ink-faint"> · {project.categories[0]}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
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
            "conic-gradient(from 160deg at 50% 0%, transparent 0deg, color-mix(in srgb, var(--color-accent) 14%, transparent) 20deg, transparent 40deg)",
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
