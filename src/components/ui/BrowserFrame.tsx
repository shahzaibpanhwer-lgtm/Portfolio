import Image from "next/image";
import { cn } from "@/lib/cn";

const ratioClass: Record<string, string> = {
  "16/10": "aspect-[16/10]",
  "16/9": "aspect-video",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "9/16": "aspect-[9/16]",
};

type BrowserFrameProps = {
  /** Screenshot path under /public. Falls back to a typographic plate. */
  src?: string;
  alt: string;
  /** Shown in the frame chrome. */
  url?: string;
  /** Large wordmark used by the fallback plate. */
  label: string;
  caption?: string;
  ratio?: keyof typeof ratioClass;
  priority?: boolean;
  className?: string;
};

/**
 * Project visual. Renders a real screenshot when one exists, otherwise a
 * designed typographic plate at the correct aspect ratio — so layout,
 * spacing and hover behaviour are all reviewable before assets land.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  label,
  caption,
  ratio = "16/10",
  priority = false,
  className,
}: BrowserFrameProps) {
  return (
    <figure className={cn("w-full", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-line bg-surface",
          "transition-colors duration-500 group-hover/card:border-ink-faint/40",
        )}
      >
        {/* chrome */}
        <div className="flex items-center gap-2 border-b border-line/80 bg-surface-2 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <i className="h-2 w-2 rounded-full bg-ink-faint/30" />
            <i className="h-2 w-2 rounded-full bg-ink-faint/20" />
            <i className="h-2 w-2 rounded-full bg-ink-faint/15" />
          </span>
          {url ? (
            <span className="ml-2 truncate font-mono text-[10px] tracking-tight text-ink-faint">
              {url.replace(/^https?:\/\//, "")}
            </span>
          ) : null}
        </div>

        {/* viewport */}
        <div className={cn("relative overflow-hidden", ratioClass[ratio])}>
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              priority={priority}
              loading={priority ? undefined : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-[1.03]"
            />
          ) : (
            <Plate label={label} />
          )}
        </div>
      </div>

      {caption ? (
        <figcaption className="mt-3 text-xs text-ink-faint">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Typographic fallback — intentional, not an error state. */
function Plate({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 grain">
      <div className="absolute inset-0 fine-grid opacity-60" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(232,167,92,0.07), transparent 62%)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <span className="max-w-full text-center font-display text-[clamp(1.1rem,4vw,2.4rem)] font-semibold leading-tight tracking-tight text-ink/25">
          {label}
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
    </div>
  );
}
