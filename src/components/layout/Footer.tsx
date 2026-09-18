import Link from "next/link";
import { contact, navLinks, site } from "@/data/site";
import { ArrowOut } from "@/components/ui/Button";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="container-edge py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr] md:gap-8">
          {/* Identity */}
          <div>
            <p className="font-display text-lg font-semibold uppercase tracking-[0.18em]">
              Shahzaib Panhwer
            </p>
            <p className="mt-3 text-sm text-ink-dim">
              UI/UX Designer · WordPress Developer
            </p>
          </div>

          {/* Sitemap */}
          <nav aria-label="Footer">
            <p className="label mb-5">Navigate</p>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-dim transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <p className="label mb-5">Elsewhere</p>
            <ul className="space-y-3">
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors duration-300 hover:text-ink"
                >
                  LinkedIn
                  <ArrowOut />
                </a>
              </li>
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn inline-flex items-center gap-1.5 text-sm text-ink-dim transition-colors duration-300 hover:text-ink"
                >
                  GitHub
                  <ArrowOut />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {site.name}
          </p>
          <p>{site.availability}</p>
        </div>
      </div>
    </footer>
  );
}
