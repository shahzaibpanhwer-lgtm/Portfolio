import { skillGroups } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * No percentage bars — a self-assigned "Figma 95%" tells a recruiter
 * nothing. Hierarchy comes from scale: each primary discipline gets a
 * full-width row with its name set at heading size, and full-stack's
 * supporting row sits at a fraction of the weight.
 *
 * Items run as a wrapped line rather than a bulleted column. A skill set
 * is not a sequence, and a column of two-word fragments reads as filler.
 */
export function Skills() {
  const primary = skillGroups.filter((g) => g.tier === "primary");
  const secondary = skillGroups.filter((g) => g.tier === "secondary");

  return (
    <section id="skills" className="section-y band">
      <div className="container-edge">
        <SectionHeading title="Skills" lead="What I work with day to day." />

        <div className="mt-16 md:mt-24">
          {primary.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 0.06}
              className="group/skill border-t border-line py-10 md:py-14"
            >
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                <h3 className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] lg:col-span-4">
                  {group.title}
                </h3>

                <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-3 lg:col-span-8">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[1.0625rem] leading-snug text-ink-dim transition-colors duration-500 group-hover/skill:text-ink md:text-lg"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {secondary.map((group) => (
            <Reveal
              key={group.title}
              delay={0.1}
              className="border-y border-line py-8 md:py-10"
            >
              <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
                <h3 className="font-display text-lg font-medium tracking-tight text-ink-dim lg:col-span-4">
                  {group.title}
                </h3>

                <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:col-span-8">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-ink-faint">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
