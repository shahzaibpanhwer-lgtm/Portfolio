"use client";

import { motion, useReducedMotion } from "motion/react";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { site } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay: 0.08 * i, ease: EASE },
        };

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20 md:pt-32"
      aria-labelledby="hero-heading"
    >
      <HeroBackdrop />

      <div className="container-edge relative z-10 w-full">
        <div>
          {/* Eyebrow */}
          <motion.p
            {...line(0)}
            className="flex items-center gap-3 text-sm text-ink-dim"
          >
            <span
              className="h-px w-8 bg-accent/60 md:w-12"
              aria-hidden="true"
            />
            Hi, I&rsquo;m Shahzaib.
          </motion.p>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="mt-6 font-display text-[clamp(2.25rem,8vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] md:mt-8"
          >
            <motion.span {...line(1)} className="block">
              Full-Stack Developer
            </motion.span>
            <motion.span {...line(2)} className="block text-ink-dim">
              <span className="text-accent">&amp;</span> UI/UX Designer
            </motion.span>
          </h1>

          {/* Supporting copy */}
          <motion.p
            {...line(3)}
            className="mt-8 max-w-[36rem] text-base leading-relaxed text-ink-dim md:mt-10 md:text-lg"
          >
            I build complete web applications and design the interfaces
            that carry them — with production experience across WordPress
            and real client websites.
          </motion.p>

          {/* Actions */}
          <motion.div
            {...line(4)}
            className="mt-10 flex flex-wrap items-center gap-3 md:mt-12"
          >
            <ButtonLink href="#work" variant="primary">
              View My Work
              <Arrow />
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost">
              Let&rsquo;s Talk
            </ButtonLink>
          </motion.div>

          {/* Availability */}
          <motion.p
            {...line(5)}
            className="mt-10 flex items-center gap-2.5 text-sm text-ink-faint md:mt-14"
          >
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {site.availability}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

/**
 * Depth without spectacle: one warm off-centre glow, a masked hairline
 * grid, and film grain. Nothing moves; nothing competes with the type.
 */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 grain" aria-hidden="true">
      <div
        className="absolute inset-0 fine-grid"
        style={{
          maskImage:
            "radial-gradient(85% 70% at 50% 35%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(85% 70% at 50% 35%, #000 20%, transparent 78%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 18% 8%, rgba(232,167,92,0.10), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 88% 78%, rgba(232,167,92,0.045), transparent 62%)",
        }}
      />
      {/* Settle the composition back into black at the fold */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
