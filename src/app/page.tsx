import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Contact } from "@/components/sections/Contact";

/**
 * A landing page, not the whole site.
 *
 * Experience, Skills, Process, About and the WordPress showcase now each
 * have their own route, so repeating them here would show a visitor the
 * same content twice. Selected Work stays, because a portfolio home that
 * shows no work is not a portfolio; /work goes further by adding the
 * WordPress projects.
 *
 * Contact closes the page without its form — the form lives on /contact.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <SelectedWork />
      <Contact showForm={false} />
    </>
  );
}
