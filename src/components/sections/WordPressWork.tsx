import Link from "next/link";
import {
  wordpressProjects,
  type WordPressProject,
} from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BrowserFrame } from "@/components/ui/BrowserFrame";
import { Arrow, ArrowOut } from "@/components/ui/Button";
import { MetaList, MetaRow, ChipList } from "@/components/ui/MetaRow";

/**
 * Deliberately structured differently from Selected Work: one lead
 * project with a full metadata panel, then a trio of compact entries.
 * Same information, different rhythm — so the page does not read as a
 * second run of identical cards.
 */
export function WordPressWork({
  showAllLink = true,
  showHeading = true,
}: {
  showAllLink?: boolean;
  /** Off when the route's <h1> already says the same thing. */
  showHeading?: boolean;
} = {}) {
  const lead = wordpressProjects.find((p) => p.tier === "lead");
  const rest = wordpressProjects.filter((p) => p.tier !== "lead");

  return (
    <section id="wordpress" className="section-y">
      <div className="container-edge">
        {showHeading ? (
        <SectionHeading
          eyebrow="WordPress"
          title="WordPress Work"
          lead="Real-world websites I contributed to during my internship."
          aside={
            showAllLink ? (
              <Link
                href="/wordpress"
                className="group/btn inline-flex items-center gap-2 text-sm text-ink-dim transition-colors duration-300 hover:text-accent"
              >
                All WordPress work
                <Arrow />
              </Link>
            ) : null
          }
        />
        ) : null}

        {lead ? <LeadProject project={lead} /> : null}

        {/* Trio */}
        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
          {rest.map((project, i) => (
            <CompactWordPress
              key={project.slug}
              project={project}
              delay={i * 0.07}
            />
          ))}
        </div>

        {/* Stack strip — reinforces the toolset without a skills bar */}
        <Reveal
          delay={0.1}
          className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-8 md:mt-20"
        >
          <span className="label">Built with</span>
          {["WordPress", "Elementor", "Theme Customization", "Plugin Configuration", "Responsive Design"].map(
            (tech) => (
              <span key={tech} className="text-sm text-ink-dim">
                {tech}
              </span>
            ),
          )}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function LeadProject({ project }: { project: WordPressProject }) {
  return (
    <Reveal
      as="article"
      className="group/card mt-16 grid gap-10 first:mt-0 md:mt-20 lg:grid-cols-12 lg:gap-12"
    >
      <div className="lg:col-span-8">
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${project.title} — open live site`}
          className="block"
        >
          <BrowserFrame
            src={project.cover}
            alt={`${project.title} — ${project.category}`}
            url={project.liveUrl}
            label={project.title}
            ratio="16/10"
          />
        </a>
      </div>

      <div className="lg:col-span-4">
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-xs tracking-widest text-accent"
            aria-hidden="true"
          >
            {project.number}
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>

        <h3 className="mt-6 font-display text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight tracking-[-0.025em]">
          {project.title}
        </h3>

        <p className="mt-2 text-sm text-ink-faint">{project.category}</p>

        <p className="mt-5 text-[0.95rem] leading-relaxed text-ink-dim">
          {project.description}
        </p>

        <div className="mt-8 rounded-xl border border-line bg-surface/60 p-6">
          <MetaList>
            <MetaRow label="Project Type">WordPress Website</MetaRow>
            <MetaRow label="Technologies">
              <ChipList items={project.technologies} />
            </MetaRow>
            <MetaRow label="My Contribution">
              <ChipList items={project.contributions} tone="accent" />
            </MetaRow>
          </MetaList>
        </div>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn mt-7 inline-flex items-center gap-2 text-sm font-medium text-ink transition-colors duration-300 hover:text-accent"
        >
          Visit live website
          <ArrowOut />
        </a>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

function CompactWordPress({
  project,
  delay,
}: {
  project: WordPressProject;
  delay: number;
}) {
  return (
    <Reveal as="article" delay={delay} className="group/card flex flex-col">
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title} — open live site`}
        className="block"
      >
        <BrowserFrame
          src={project.cover}
          alt={`${project.title} — ${project.category}`}
          url={project.liveUrl}
          label={project.title}
          ratio="4/3"
        />
      </a>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-xs tracking-widest text-ink-faint"
            aria-hidden="true"
          >
            {project.number}
          </span>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </div>

        <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
          {project.title}
        </h3>

        <p className="mt-1.5 text-xs text-ink-faint">{project.category}</p>

        <p className="mt-4 text-sm leading-relaxed text-ink-dim">
          {project.description}
        </p>

        <div className="mt-5">
          <p className="label mb-2.5">My Contribution</p>
          <ChipList items={project.contributions} />
        </div>

        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn mt-auto inline-flex items-center gap-2 pt-6 text-sm text-ink-dim transition-colors duration-300 hover:text-accent"
        >
          Live site
          <ArrowOut />
        </a>
      </div>
    </Reveal>
  );
}
