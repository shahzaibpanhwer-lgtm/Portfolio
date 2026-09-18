import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WordPressWork } from "@/components/sections/WordPressWork";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/* Identity, then the two primary disciplines (full-stack and UI/UX),
   then the work that evidences them, then background. WordPress keeps a
   full section because four live sites are real proof, even though it
   now sits below the primaries in the skills hierarchy. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <SelectedWork />
      <WordPressWork />
      <Experience />
      <Skills />
      <Process />
      <About />
      <Contact />
    </>
  );
}
