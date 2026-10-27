import { skillGroups } from "@/data/content";
import { Marquee } from "@/components/motion/Marquee";
import { ScrollWords } from "@/components/motion/ScrollWords";

/* One ribbon of everything in the skills data, de-duplicated. */
const ribbon = [...new Set(skillGroups.flatMap((g) => g.items))];

/**
 * The pause between the hero and the work: a skills ribbon that runs
 * with the scroll, then one sentence that lights up word by word.
 */
export function Statement() {
  return (
    <section aria-labelledby="statement-label" className="relative overflow-hidden">
      <div className="border-y border-line-soft bg-band py-6 md:py-8">
        <Marquee
          items={ribbon}
          className="font-display text-xl font-medium tracking-tight text-ink-dim md:text-3xl"
        />
      </div>

      <div className="container-edge section-y">
        <p id="statement-label" className="label">
          How I work
        </p>
        <ScrollWords
          text="Designing an interface and building it are the same job to me — so I work across both, from the first wireframe to the deployed product, and nothing gets lost in the handoff."
          highlight={["Designing", "building", "both"]}
          className="mt-8 max-w-5xl font-display text-[clamp(1.75rem,4.2vw,3.6rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink"
        />
      </div>
    </section>
  );
}
