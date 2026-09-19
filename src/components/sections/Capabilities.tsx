import { capabilities } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/**
 * Hierarchy is carried by layout, not by labels: the two primary
 * capabilities occupy a full half-width column each, while full-stack
 * sits underneath as a single quieter band.
 */
export function Capabilities() {
  const primary = capabilities.filter((c) => c.weight === "primary");
  const secondary = capabilities.filter((c) => c.weight === "secondary");

  return (
    <section id="what-i-do" className="section-y band">
      <div className="container-edge">
        <SectionHeading title="What I Do" />

        {/* Primary — UI/UX + WordPress */}
        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:mt-20 md:grid-cols-2">
          {primary.map((cap, i) => (
            <Reveal
              key={cap.number}
              delay={i * 0.08}
              className="group/cap relative bg-bg p-8 transition-colors duration-500 hover:bg-surface md:p-12 lg:p-14"
            >
              <span
                className="font-mono text-xs tracking-widest text-accent"
                aria-hidden="true"
              >
                {cap.number}
              </span>

              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight md:text-3xl">
                {cap.title}
              </h3>

              <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-ink-dim">
                {cap.body}
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                {cap.keywords.map((k) => (
                  <li
                    key={k}
                    className="rounded-full border border-line px-3 py-1 text-xs text-ink-faint transition-colors duration-500 group-hover/cap:border-ink-faint/40 group-hover/cap:text-ink-dim"
                  >
                    {k}
                  </li>
                ))}
              </ul>

              {/* Accent hairline that draws in on hover */}
              <span
                className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-accent/50 transition-transform duration-500 ease-out group-hover/cap:scale-x-100"
                aria-hidden="true"
              />
            </Reveal>
          ))}
        </div>

        {/* Secondary — full-stack, deliberately lighter */}
        {secondary.map((cap) => (
          <Reveal
            key={cap.number}
            delay={0.12}
            className={cn(
              "mt-px grid gap-6 rounded-2xl border border-line bg-bg p-8",
              "md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10 md:p-10",
            )}
          >
            <div className="flex items-center gap-4">
              <span
                className="font-mono text-xs tracking-widest text-ink-faint"
                aria-hidden="true"
              >
                {cap.number}
              </span>
              <h3 className="font-display text-lg font-medium tracking-tight text-ink-dim md:text-xl">
                {cap.title}
              </h3>
            </div>

            <p className="max-w-lg text-sm leading-relaxed text-ink-faint">
              {cap.body}
            </p>

            <ul className="flex flex-wrap gap-2">
              {cap.keywords.map((k) => (
                <li key={k} className="text-xs text-ink-faint">
                  {k}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
