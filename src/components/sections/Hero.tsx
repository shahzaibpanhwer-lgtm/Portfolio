"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { HeroStack } from "@/components/sections/HeroStack";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const reduce = usePrefersReducedMotion();

  const line = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay: 0.08 * i, ease: EASE },
        };

  /* As the hero scrolls away its copy drifts up and fades a beat faster
     than the page, and the stack sinks — two speeds read as depth. */
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const stackY = useTransform(scrollYProgress, [0, 1], [0, 160]);


  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32"
      aria-labelledby="hero-heading"
    >
      <HeroBackdrop />
      <motion.div style={reduce ? undefined : { y: stackY }} className="absolute inset-0">
        <HeroStack />
      </motion.div>

      <div className="container-edge relative z-10 flex w-full flex-1 items-center">
        <motion.div style={reduce ? undefined : { y: copyY, opacity: copyOpacity }}>
          {/* Eyebrow */}
          <motion.p
            {...line(0)}
            className="flex items-center gap-3 text-base text-ink md:text-lg"
          >
            <span
              className="h-px w-8 bg-accent md:w-12"
              aria-hidden="true"
            />
            Hi, I&rsquo;m Shahzaib.
          </motion.p>

          {/* Headline. The second line is set lighter, not dimmer — UI/UX
              is co-primary, so it must not look like it is fading out. */}
          <h1
            id="hero-heading"
            className="mt-6 font-display text-[clamp(2.25rem,8vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] md:mt-8"
          >
            <SplitText
              text="Full-Stack Developer"
              trigger="mount"
              delay={0.1}
              className="block"
            />
            <span className="block text-ink/75">
              <SplitText
                text="& UI/UX Designer"
                trigger="mount"
                delay={0.28}
                accent={["&"]}
              />
            </span>
          </h1>

          {/* Supporting copy */}
          <motion.p
            {...line(3)}
            className="mt-8 max-w-[36rem] text-base leading-relaxed text-ink-dim md:mt-10 md:text-lg"
          >
            I build full-stack web applications and design intuitive
            interfaces that combine clean engineering with thoughtful UX —
            from client websites to production-ready digital products.
          </motion.p>

          {/* Disciplines. Deliberately small and dim: it qualifies the
              headline, it does not compete with it. */}
          <motion.p
            {...line(4)}
            className="mt-5 text-sm text-ink-faint"
          >
            UI/UX <span className="text-ink-faint/50">•</span> Full-Stack
            Development <span className="text-ink-faint/50">•</span> WordPress
          </motion.p>

          {/* Actions */}
          <motion.div
            {...line(5)}
            className="mt-10 flex flex-wrap items-center gap-3 md:mt-12"
          >
            <Magnetic>
              <ButtonLink href="#work" variant="primary">
                View My Work
                <Arrow />
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="#contact" variant="ghost">
                Book a call
              </ButtonLink>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      <ScrollCue reduce={!!reduce} />

      <HeroFooter reduce={!!reduce} />
    </section>
  );
}

/** Small "scroll" hint: a dot travelling down a hairline. */
function ScrollCue({ reduce }: { reduce: boolean }) {
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
      className="pointer-events-none absolute bottom-28 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-ink-faint">Scroll</span>
      <span className="relative h-12 w-px overflow-hidden bg-line">
        <motion.span
          className="absolute left-0 top-0 h-4 w-px bg-accent"
          animate={{ y: [-16, 48] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
    </motion.div>
  );
}

/**
 * Bottom rail. Does three jobs at once: fills the empty lower third,
 * uses the full width the headline leaves open on the right, and —
 * most importantly — puts named, shipped work inside the first screen.
 * Without it a visitor scrolls roughly 2,000px before seeing evidence.
 */
function HeroFooter({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: reduce ? 0 : 0.55, ease: EASE }}
      className="relative z-10 border-t border-line-soft"
    >
      <div className="container-edge flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between md:gap-10 md:py-7">
        <p className="flex items-center gap-2.5 text-sm text-ink-faint">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {site.availability}
        </p>

        <nav aria-label="Selected work" className="min-w-0">
          <ul className="flex items-center gap-x-6 gap-y-2 overflow-x-auto md:flex-wrap md:justify-end md:overflow-visible scrollbar-none [&::-webkit-scrollbar]:hidden">
            <li className="shrink-0 text-sm text-ink-faint">Selected work</li>
            {projects.map((project) => (
              <li key={project.slug} className="shrink-0">
                <Link
                  href={`/work/${project.slug}`}
                  className="group/proj relative block text-sm text-ink-dim transition-colors duration-300 hover:text-ink"
                >
                  {project.title}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/proj:scale-x-100"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.div>
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
            "radial-gradient(70% 55% at 18% 8%, color-mix(in srgb, var(--color-accent) 10%, transparent), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 88% 78%, color-mix(in srgb, var(--color-accent) 4.5%, transparent), transparent 62%)",
        }}
      />
      {/* Settle the composition back into black at the fold */}
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
