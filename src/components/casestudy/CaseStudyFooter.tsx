import Link from "next/link";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { ChipList } from "@/components/ui/MetaRow";
import { ButtonLink, Arrow, ArrowOut } from "@/components/ui/Button";

/** Final Product / Live Project — the payoff at the end of the narrative. */
export function LiveProject({ project }: { project: Project }) {
  return (
    <section className="border-t border-line py-16 md:py-24">
      <div className="container-edge">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-xs tracking-widest text-accent"
                aria-hidden="true"
              >
                ★
              </span>
              <span className="h-px w-10 bg-line" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-semibold leading-tight tracking-[-0.03em]">
              Live Project
            </h2>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="text-base leading-relaxed text-ink-dim md:text-lg">
              The finished {project.type.toLowerCase()} is live. Have a look at
              it in its real environment.
            </p>

            <div className="mt-8">
              <p className="label mb-3">What I contributed</p>
              <ChipList items={project.contributions} tone="accent" />
            </div>

            <div className="mt-10">
              <ButtonLink href={project.liveUrl} external variant="primary">
                Visit {project.title}
                <ArrowOut />
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/** Keeps the reader inside the portfolio instead of dead-ending. */
export function NextProject({ project }: { project: Project }) {
  return (
    <section className="border-t border-line">
      <Link
        href={`/work/${project.slug}`}
        className="group/next block py-16 transition-colors duration-500 hover:bg-surface md:py-24"
      >
        <div className="container-edge">
          <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label">Next Project</p>
              <p className="mt-5 font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-none tracking-[-0.035em] transition-colors duration-300 group-hover/next:text-accent">
                {project.title}
              </p>
              <p className="mt-4 text-sm text-ink-faint">{project.tagline}</p>
            </div>

            <span
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-all duration-500 group-hover/next:border-accent group-hover/next:bg-accent group-hover/next:text-bg"
              aria-hidden="true"
            >
              <Arrow className="h-4 w-4 transition-transform duration-500 group-hover/next:translate-x-0.5" />
            </span>
          </Reveal>
        </div>
      </Link>
    </section>
  );
}
