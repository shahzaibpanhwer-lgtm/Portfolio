import Link from "next/link";
import { experience } from "@/data/content";
import { projects, wordpressProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowOut } from "@/components/ui/Button";

/**
 * Resolves a project name from the experience list to wherever it lives —
 * a case study if there is one, otherwise the live site.
 */
function resolveWork(name: string) {
  const cased = projects.find((p) => p.title === name);
  if (cased) return { href: `/work/${cased.slug}`, external: false };

  const wp = wordpressProjects.find((p) => p.title === name);
  if (wp) return { href: wp.liveUrl, external: true };

  return null;
}

export function Experience() {
  return (
    <section id="experience" className="section-y">
      <div className="container-edge">
        <SectionHeading title="Experience" />

        <ol className="mt-16 md:mt-20">
          {experience.map((entry) => (
            <li key={entry.role} className="relative">
              <Reveal>
                {/* Role and period share a line — a three-column rail
                    holding a single year was mostly empty space. */}
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-line pt-8">
                  <h3 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em]">
                    {entry.role}
                  </h3>
                  <span className="text-lg text-accent md:text-xl">
                    {entry.period}
                  </span>
                </div>

                <div>
                  <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-dim md:text-lg md:leading-relaxed">
                    {entry.body}
                  </p>

                  <div className="mt-10">
                    <p className="mb-5 text-sm text-ink-faint">
                      Six projects from this work
                    </p>
                    <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
                      {entry.work.map((name) => {
                        const target = resolveWork(name);

                        const inner = (
                          <span className="flex items-center justify-between gap-3">
                            <span className="text-sm text-ink transition-colors duration-300 group-hover/work:text-accent">
                              {name}
                            </span>
                            {target?.external ? (
                              <ArrowOut className="text-ink-faint" />
                            ) : null}
                          </span>
                        );

                        return (
                          <li key={name} className="bg-bg">
                            {target ? (
                              target.external ? (
                                <a
                                  href={target.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/work group/btn block px-5 py-4 transition-colors duration-300 hover:bg-surface"
                                >
                                  {inner}
                                </a>
                              ) : (
                                <Link
                                  href={target.href}
                                  className="group/work block px-5 py-4 transition-colors duration-300 hover:bg-surface"
                                >
                                  {inner}
                                </Link>
                              )
                            ) : (
                              <span className="block px-5 py-4 text-sm text-ink">
                                {name}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
