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
        <SectionHeading eyebrow="Background" title="Experience" />

        <ol className="mt-16 md:mt-20">
          {experience.map((entry) => (
            <li key={entry.role} className="relative">
              <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                {/* Period rail */}
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      aria-hidden="true"
                    />
                    <span className="font-mono text-sm tracking-widest text-accent">
                      {entry.period}
                    </span>
                  </div>
                </div>

                {/* Entry */}
                <div className="border-l border-line pl-6 lg:col-span-9 lg:pl-10">
                  <h3 className="font-display text-[clamp(1.5rem,3vw,2.15rem)] font-semibold leading-tight tracking-[-0.025em]">
                    {entry.role}
                  </h3>

                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-dim md:text-lg md:leading-relaxed">
                    {entry.body}
                  </p>

                  <div className="mt-10">
                    <p className="label mb-5">Selected work</p>
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
