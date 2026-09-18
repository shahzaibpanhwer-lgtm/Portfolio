import { ButtonLink, Arrow } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center pt-32">
      <div className="container-edge">
        <p className="label">404</p>
        <h1 className="mt-6 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
          This page doesn&rsquo;t exist.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-ink-dim">
          The link may be out of date. The work is all still here.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="primary">
            Back home
            <Arrow />
          </ButtonLink>
          <ButtonLink href="/work" variant="ghost">
            View work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
