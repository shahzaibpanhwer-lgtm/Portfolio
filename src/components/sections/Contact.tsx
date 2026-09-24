import { contact, site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { ButtonLink, Arrow, ArrowOut } from "@/components/ui/Button";
import { ContactForm } from "@/components/sections/ContactForm";

/**
 * Placeholder-safe: until real details are supplied, contact.email is
 * "YOUR_EMAIL" and must not be wrapped in a mailto: that opens a client
 * with a junk address. Only build the mailto once it looks like one.
 */
const isReal = (value: string) => !value.startsWith("YOUR_");
const emailHref = contact.email.includes("@")
  ? `mailto:${contact.email}`
  : contact.email;

export function Contact({
  as: Heading = "h2",
  showForm = true,
}: {
  /** "h1" when Contact is the page's primary heading. */
  as?: "h1" | "h2";
  /** Off on the home page — the form belongs on /contact only. */
  showForm?: boolean;
} = {}) {
  return (
    <section
      id="contact"
      className={cn(
        "relative overflow-hidden",
        // With no form it is a closing call to action, not a full section
        showForm ? "section-y" : "pb-20 pt-16 md:pb-24 md:pt-20",
      )}
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 100%, rgba(77,124,254,0.08), transparent 62%)",
        }}
      />

      <div className="container-edge relative">
        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16">
          <div className={showForm ? "lg:col-span-7" : "lg:col-span-9"}>
        <Reveal>
          <p className="label">Contact</p>

          <Heading
            className={cn(
              "mt-6 max-w-3xl font-display font-semibold leading-[1.02] tracking-[-0.035em]",
              // As a closing CTA it must sit below the page's own h1, not
              // rival it. Full scale only on /contact, where it is the h1.
              showForm
                ? "text-[clamp(2.2rem,6.5vw,4.75rem)]"
                : "text-[clamp(1.9rem,4vw,3.25rem)]",
            )}
          >
            Let&rsquo;s build something useful.
          </Heading>

          <p className={cn("max-w-lg leading-relaxed text-ink-dim", showForm ? "mt-7 text-base md:text-lg" : "mt-5 text-base")}>
            Have a website, product or design challenge in mind?
          </p>
        </Reveal>

        <Reveal delay={0.08} className={cn("flex flex-wrap items-center gap-3", showForm ? "mt-12" : "mt-8")}>
          <ButtonLink href={emailHref} external variant="primary">
            Let&rsquo;s Talk
            <Arrow />
          </ButtonLink>

          <ButtonLink href={contact.linkedin} external variant="ghost">
            LinkedIn
            <ArrowOut />
          </ButtonLink>

          <ButtonLink href={contact.github} external variant="ghost">
            GitHub
            <ArrowOut />
          </ButtonLink>
        </Reveal>

        {/* Show the address plainly once it is real — recruiters copy it. */}
        {isReal(contact.email) ? (
          <Reveal delay={0.12}>
            <a
              href={emailHref}
              className="mt-12 inline-block font-display text-[clamp(1.1rem,2.4vw,1.75rem)] font-medium tracking-tight text-ink-dim transition-colors duration-300 hover:text-accent"
            >
              {contact.email}
            </a>
          </Reveal>
        ) : null}

        <Reveal delay={0.14}>
          <p className="mt-14 flex items-center gap-2.5 text-sm text-ink-faint">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {site.availability}
          </p>
        </Reveal>
          </div>

          {showForm ? (
            <Reveal delay={0.1} className="lg:col-span-5">
              <ContactForm />
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
