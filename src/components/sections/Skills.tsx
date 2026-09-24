import { skillGroups } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

/**
 * No percentage bars — a self-assigned "Figma 95%" tells a recruiter
 * nothing. Each discipline takes a full-width row with its name at
 * heading scale and its items running as a wrapped line beside it.
 *
 * All three carry the same weight. WordPress sits below full-stack and
 * UI/UX in the positioning, but four live sites is real evidence, and
 * setting it half-size read as an apology for it.
 */
export function Skills({
  showHeading = true,
}: {
  /** Off when the route's <h1> already carries the title. */
  showHeading?: boolean;
} = {}) {
  /* Same reason as Experience: no section h2 means the group names
     become the page's second level. */
  const Title = showHeading ? "h3" : "h2";

  return (
    <section id="skills" className="section-y band">
      <div className="container-edge">
        {showHeading ? <SectionHeading title="Skills" lead="What I work with day to day." /> : null}

        <div className="mt-16 md:mt-24">
          {skillGroups.map((group, i) => (
            <Reveal
              key={group.title}
              delay={i * 0.06}
              className="group/skill border-t border-line py-10 last:border-b md:py-14"
            >
              <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                <Title className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-[-0.03em] lg:col-span-4">
                  {group.title}
                </Title>

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
        </div>
      </div>
    </section>
  );
}
