import Link from "next/link";
import type { Project } from "@/data/projects";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Arrow, ArrowOut } from "@/components/ui/Button";
import { ScrollTiltCard } from "@/components/ui/ScrollTiltCard";

/**
 * Case-study masthead. Answers what / who / with what / where in one
 * screen, before any narrative starts.
 */
export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <header className="relative overflow-hidden pt-32 md:pt-40">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 15% 0%, rgba(77,124,254,0.08), transparent 60%)",
        }}
      />

      <div className="container-edge relative">
        {/* Back */}
        <Reveal>
          <Link
            href="/work"
            className="group/btn inline-flex items-center gap-2 text-sm text-ink-dim transition-colors duration-300 hover:text-accent"
          >
            <Arrow className="rotate-180 group-hover/btn:-translate-x-0.5" />
            All work
          </Link>
        </Reveal>

        {/* Title block */}
        <Reveal delay={0.05} className="mt-10 md:mt-14">
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-xs tracking-widest text-accent"
              aria-hidden="true"
            >
              {project.number}
            </span>
            <span className="h-px w-12 bg-line" aria-hidden="true" />
            <span className="label">{project.tagline}</span>
          </div>

          <h1 className="mt-6 font-display text-[clamp(2.6rem,8vw,6rem)] font-semibold leading-[1] tracking-[-0.04em]">
            {project.title}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-dim md:text-xl">
            {project.description}
          </p>
        </Reveal>

        {/* Meta strip */}
        <Reveal delay={0.1}>
          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8 border-y border-line py-8 md:mt-16 md:grid-cols-4 md:gap-x-12">
            <Meta label="Role" value={project.role} />
            <Meta label="Type" value={project.type} />
            <Meta label="Tools" value={project.tools.join(", ")} />
            <Meta label="Year" value={project.year} />
          </dl>
        </Reveal>

        {/* Live link */}
        <Reveal delay={0.12}>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-300 hover:text-accent"
          >
            Visit live project
            <ArrowOut />
          </a>
        </Reveal>

        {/* Cover — tilts back and settles flat on scroll. Nothing sticky
            lives inside it, so the 3D transform is safe here. */}
        <Reveal delay={0.15} className="group/card mt-14 md:mt-20">
          <ScrollTiltCard>
            <BrowserFrame
              src={project.cover}
              alt={`${project.title} — ${project.tagline}`}
              url={project.liveUrl}
              label={project.title}
              fit="contain"
              ratio="16/9"
              priority
            />
          </ScrollTiltCard>
        </Reveal>
      </div>
    </header>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="label mb-2.5">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink">{value}</dd>
    </div>
  );
}
