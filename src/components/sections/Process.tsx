import { processSteps } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Reveal";

/** Connects the design side to the build side — one continuous method. */
export function Process() {
  return (
    <section id="process" className="section-y">
      <div className="container-edge">
        <SectionHeading
          eyebrow="Method"
          title="How I Work"
          lead="The same four steps whether the outcome is a Figma file or a live WordPress site."
        />

        <Stagger className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step) => (
            <StaggerItem
              key={step.number}
              className="group/step relative bg-bg p-8 transition-colors duration-500 hover:bg-surface lg:p-9"
            >
              <span
                className="font-display text-4xl font-semibold tracking-tight text-line transition-colors duration-500 group-hover/step:text-accent/70 lg:text-5xl"
                aria-hidden="true"
              >
                {step.number}
              </span>

              <h3 className="mt-7 font-display text-lg font-semibold tracking-tight">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-ink-dim">
                {step.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
