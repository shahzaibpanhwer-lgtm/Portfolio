"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { SplitText } from "@/components/motion/SplitText";
import { Magnetic } from "@/components/motion/Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;
const ROLES = ["UI/UX designer", "full-stack developer", "WordPress builder"];

/**
 * Centred statement, one rotating line that names the three disciplines,
 * and the flagship project as the image — so the first screen carries a
 * claim and the evidence for it, and nothing decorative.
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
      className="relative overflow-hidden pt-36 md:pt-44"
      aria-labelledby="hero-heading"
    >
      <HeroBackdrop reduce={!!reduce} />

      <div className="container-edge relative z-10 flex flex-col items-center text-center">
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
          className="mt-9 max-w-[17ch] font-display text-[clamp(2.6rem,7.4vw,6.4rem)] font-semibold leading-[0.98] tracking-[-0.05em]"
        >
          <SplitText
            text="Design and code, in one"
            trigger="mount"
            delay={0.12}
            wordClassName="silver"
          />{" "}
          <SplitText
            text="pair of hands."
            trigger="mount"
            delay={0.42}
            wordClassName="text-accent"
          />
        </h1>

        <motion.p
          {...fade(0.6)}
          className="mt-8 max-w-[38rem] text-base leading-relaxed text-ink-dim md:text-lg"
        >
          I&rsquo;m Shahzaib, a <RoleRoller reduce={!!reduce} /> from
          Pakistan — shipping products from the first wireframe to
          production.
        </motion.p>

        <motion.div
          {...fade(0.72)}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
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

      <HeroShot reduce={!!reduce} />
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * The role word swaps in place, and its slot eases to the new word's
 * width so the sentence closes up around it instead of leaving a gap.
 * Screen readers get the full list once.
 */
function RoleRoller({ reduce }: { reduce: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % ROLES.length), 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <>
      <span className="sr-only">{ROLES.join(", ")}</span>
      <motion.span
        aria-hidden="true"
        layout={!reduce}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative inline-flex overflow-hidden whitespace-nowrap align-bottom font-medium text-ink"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={ROLES[i]}
            className="inline-block"
            initial={reduce ? false : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduce ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {ROLES[i]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}

/**
 * The flagship project, framed in glass. It rises in tilted back, then
 * lays flat as the page scrolls — the screen "opening" toward the reader.
 */
function HeroShot({ reduce }: { reduce: boolean }) {
  const project = projects[0];
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.25"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 26, restDelta: 0.001 });
  const rotateX = useTransform(progress, [0, 1], [18, 0]);
  const scale = useTransform(progress, [0, 1], [0.92, 1]);

  return (
    <div ref={ref} className="container-edge relative z-10 mt-20 md:mt-24" style={{ perspective: "1600px" }}>
      {/* lime light pooling behind the frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] top-[6%] h-[60%] rounded-full blur-[70px]"
        style={{ background: "color-mix(in srgb, var(--color-accent) 22%, transparent)" }}
      />

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
      >
        <motion.div
          style={
            reduce
              ? undefined
              : { rotateX, scale, transformOrigin: "50% 0%", willChange: "transform" }
          }
          className="relative mx-auto max-w-[1200px] rounded-[26px] border border-white/10 bg-gradient-to-b from-white/[0.14] to-white/[0.02] p-2 md:p-2.5"
        >
          <Link
            href={`/work/${project.slug}`}
            aria-label={`${project.title} — view case study`}
            className="block overflow-hidden rounded-[18px] focus-visible:outline-offset-4"
          >
            {project.cover ? (
              <Image
                src={project.cover}
                alt={`${project.title} — ${project.tagline}`}
                width={2880}
                height={1800}
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="h-auto w-full"
              />
            ) : null}
          </Link>
        </motion.div>
      </motion.div>

      {/* settle the frame's lower edge back into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] bg-gradient-to-b from-transparent to-bg"
      />
    </div>
  );
}

/**
 * A breathing lime halo over a hairline grid that fades out from the
 * centre. Light, not decoration: it gives the headline somewhere to sit.
 */
function HeroBackdrop({ reduce }: { reduce: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 grain" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-[1100px]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(60% 55% at 50% 30%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(60% 55% at 50% 30%, #000, transparent)",
        }}
      />
      <div
        className="absolute left-1/2 top-[-380px] h-[760px] w-[1100px] max-w-[160vw] -translate-x-1/2 rounded-full blur-[40px]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 15%, transparent), transparent)",
          animation: reduce ? undefined : "halo-breathe 9s ease-in-out infinite",
        }}
      />
    </div>
  );
}
