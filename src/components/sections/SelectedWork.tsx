import Link from "next/link";
import { projects, type Project } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Arrow, ArrowOut } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function SelectedWork({ showAllLink = true }: { showAllLink?: boolean } = {}) {

  return (
    <section id="work" className="section-y">
      <div className="container-edge">
        <SectionHeading
          title="Selected Work"
          lead="Real products, websites and digital experiences I've worked on."
          aside={
            showAllLink ? (
              <Link
                href="/work"
                className="group/btn inline-flex items-center gap-2 text-sm text-ink-dim transition-colors duration-300 hover:text-accent"
              >
                All projects
                <Arrow />
              </Link>
            ) : null
          }
        />

        {/* Every project gets the same editorial row, alternating sides */}
        <div className="mt-20 space-y-24 md:mt-28 md:space-y-36">
          {projects.map((project, i) => (
            <FeaturedProject key={project.slug} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function FeaturedProject({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  /* Alternate which side the text sits on to break the rhythm. */
  const flip = index % 2 === 1;

  return (
    <Reveal
      as="article"
      className="group/card grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
    >
      {/* Visual */}
      <Link
        href={`/work/${project.slug}`}
        aria-label={`${project.title} — view case study`}
        className={cn(
          "block lg:col-span-7",
          flip ? "lg:order-2 lg:col-start-6" : "lg:order-1",
        )}
      >
        <BrowserFrame
          src={project.cover}
          alt={`${project.title} — ${project.tagline}`}
          url={project.liveUrl}
          label={project.title}
          fit="contain"
          sizes="(max-width: 1024px) 100vw, 58vw"
          priority={index === 0}
        />
      </Link>

      {/* Copy */}
      <div
        className={cn(
          "lg:col-span-5",
          flip ? "lg:order-1 lg:row-start-1" : "lg:order-2",
        )}
      >
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-xs tracking-widest text-accent"
            aria-hidden="true"
          >
            {project.number}
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
          <span className="label">{project.year}</span>
        </div>

        <h3 className="mt-6 font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-[-0.03em]">
          <Link
            href={`/work/${project.slug}`}
            className="transition-colors duration-300 hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-ink-faint">{project.tagline}</p>

        <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-ink-dim">
          {project.description}
        </p>

        <ul className="mt-7 flex flex-wrap gap-2">
          {project.categories.map((c) => (
            <li
              key={c}
              className="rounded-full border border-line px-3 py-1 text-xs text-ink-faint"
            >
              {c}
            </li>
          ))}
        </ul>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Link
            href={`/work/${project.slug}`}
            className="group/btn inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-300 hover:text-accent"
          >
            View Case Study
            <Arrow />
          </Link>
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn inline-flex items-center gap-2 text-sm text-ink-dim transition-colors duration-300 hover:text-ink"
          >
            Live site
            <ArrowOut />
          </a>
        </div>
      </div>
    </Reveal>
  );
}
