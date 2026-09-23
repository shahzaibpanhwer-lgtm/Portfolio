import { Reveal } from "@/components/ui/Reveal";

/** Standard masthead for non-home routes. */
export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-36 pb-16 md:pt-44 md:pb-20">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 70% at 12% 0%, rgba(77,124,254,0.07), transparent 62%)",
        }}
      />
      <div className="container-edge relative">
        <Reveal>
          <p className="label">{eyebrow}</p>
          <h1 className="mt-5 font-display text-[clamp(2.2rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            {title}
          </h1>
          {lead ? (
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-dim md:text-lg">
              {lead}
            </p>
          ) : null}
        </Reveal>
      </div>
    </header>
  );
}
