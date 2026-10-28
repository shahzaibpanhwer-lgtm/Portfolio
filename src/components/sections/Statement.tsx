import { ScrollWords } from "@/components/motion/ScrollWords";

/**
 * The pause between the hero and the work: one sentence that lights up
 * word by word as it is scrolled.
 */
export function Statement() {
  return (
    <section aria-labelledby="statement-label" className="relative overflow-hidden">
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
