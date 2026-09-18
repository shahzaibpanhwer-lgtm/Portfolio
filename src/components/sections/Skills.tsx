import { skillGroups } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * No percentage bars — a self-assigned "Figma 95%" tells a recruiter
 * nothing. Grouping and scale carry the hierarchy instead: the two
 * primary disciplines get full columns and larger type, full-stack sits
 * underneath in a quieter band.
 */
export function Skills() {
  const primary = skillGroups.filter((g) => g.tier === "primary");
  const secondary = skillGroups.filter((g) => g.tier === "secondary");

  return (
    <section id="skills" className="section-y">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Toolkit"
          title="Skills"
          lead="What I work with day to day."
        />

        {/* Primary disciplines */}
        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-2 md:gap-16">
          {primary.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08}>
              <div className="flex items-center gap-4 border-t border-accent/40 pt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                  {group.title}
                </h3>
                <span className="label ml-auto text-accent">Primary</span>
              </div>

              <ul className="mt-8 space-y-0 divide-y divide-line-soft">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="py-3.5 text-[0.95rem] text-ink-dim transition-colors duration-300 hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Secondary */}
        {secondary.map((group) => (
          <Reveal key={group.title} delay={0.12} className="mt-16 md:mt-20">
            <div className="flex items-center gap-4 border-t border-line pt-6">
              <h3 className="font-display text-lg font-medium tracking-tight text-ink-dim">
                {group.title}
              </h3>
              <span className="label ml-auto">Secondary</span>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-ink-faint">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
