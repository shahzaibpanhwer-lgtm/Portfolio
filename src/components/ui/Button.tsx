import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "quiet";

const base =
  "group/btn inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-medium " +
  "transition-[background-color,border-color,color,transform] duration-300 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent " +
  "active:scale-[0.985] whitespace-nowrap";

const sizes = "h-11 px-6 md:h-12 md:px-7";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-accent-soft",
  ghost:
    "border border-line text-ink hover:border-ink-faint hover:bg-surface",
  quiet: "text-ink-dim hover:text-ink",
};

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

export function ButtonLink({
  href,
  variant = "primary",
  external = false,
  children,
  className,
  ...rest
}: ButtonLinkProps) {
  const classes = cn(base, sizes, variants[variant], className);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

/** Arrow that nudges on parent hover. Used inside buttons and cards. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-3.5 w-3.5 transition-transform duration-300 ease-out",
        "group-hover/btn:translate-x-0.5 group-hover/card:translate-x-1",
        className,
      )}
    >
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Diagonal arrow for links that leave the site. */
export function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={cn(
        "h-3.5 w-3.5 transition-transform duration-300 ease-out",
        "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
        "group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5",
        className,
      )}
    >
      <path
        d="M5 11L11 5M11 5H6M11 5v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
