import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  /** Small tracked label above the title. */
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Rendered on the right on wide screens — e.g. a "View all" link. */
  aside?: ReactNode;
  className?: string;
  as?: "h2" | "h3";
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  aside,
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="label mb-5">{eyebrow}</p> : null}
        <Tag className="font-display text-[clamp(1.9rem,4.5vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
          {title}
        </Tag>
        {lead ? (
          <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-dim">
            {lead}
          </p>
        ) : null}
      </div>

      {aside ? <div className="shrink-0">{aside}</div> : null}
    </Reveal>
  );
}
