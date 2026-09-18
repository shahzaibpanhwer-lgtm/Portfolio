import type { ReactNode } from "react";

/**
 * Label/value pair used in project detail panels and case-study sidebars.
 * Renders as a definition list so the relationship survives screen readers.
 */
export function MetaList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-line">{children}</dl>;
}

export function MetaRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="py-4 first:pt-0 last:pb-0">
      <dt className="label mb-2.5">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-dim">{children}</dd>
    </div>
  );
}

/** Comma-free chip list for technologies and contributions. */
export function ChipList({
  items,
  tone = "default",
}: {
  items: readonly string[];
  tone?: "default" | "accent";
}) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={
            tone === "accent"
              ? "rounded-full border border-accent/25 bg-accent/5 px-2.5 py-1 text-xs text-accent-soft"
              : "rounded-full border border-line px-2.5 py-1 text-xs text-ink-faint"
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
