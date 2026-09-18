import { about } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function About({
  showHeading = true,
}: {
  /** Off when the route's <h1> already says "About". */
  showHeading?: boolean;
} = {}) {
  const [lead, ...rest] = about.paragraphs;

  return (
    <section
      id="about"
      className={showHeading ? "section-y" : "pb-24 pt-12 md:pb-32 md:pt-14"}
    >
      <div className="container-edge">
        {showHeading ? (
          <SectionHeading eyebrow="Profile" title="About" />
        ) : null}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 data-[spaced=true]:mt-16 md:data-[spaced=true]:mt-20" data-spaced={showHeading}>
          {/* Lead paragraph gets display scale — it is the positioning line */}
          <Reveal className="lg:col-span-7">
            <p className="font-display text-[clamp(1.35rem,2.6vw,1.9rem)] font-medium leading-[1.4] tracking-[-0.02em] text-ink">
              {lead}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="space-y-5 lg:col-span-4 lg:col-start-9">
            {rest.map((p) => (
              <p key={p} className="text-base leading-relaxed text-ink-dim">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
