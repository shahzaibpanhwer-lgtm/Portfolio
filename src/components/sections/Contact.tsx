import { contact, site } from "@/data/site";
import { Reveal } from "@/components/ui/Reveal";
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
}: {
  /** "h1" when Contact is the page's primary heading. */
  as?: "h1" | "h2";
} = {}) {
  return (
    <section id="contact" className="relative overflow-hidden section-y">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 50% 100%, rgba(232,167,92,0.08), transparent 62%)",
        }}
      />

      <div className="container-edge relative">
        <div className="grid gap-12 border-t border-line pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
        <Reveal>
          <p className="label">Contact</p>

          <Heading className="mt-6 max-w-3xl font-display text-[clamp(2.2rem,6.5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Let&rsquo;s build something useful.
          </Heading>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-ink-dim md:text-lg">
            Have a website, product or design challenge in mind?
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 flex flex-wrap items-center gap-3">
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

          <Reveal delay={0.1} className="lg:col-span-5">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
