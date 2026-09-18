import { Hero } from "@/components/sections/Hero";
import { Capabilities } from "@/components/sections/Capabilities";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WordPressWork } from "@/components/sections/WordPressWork";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Process } from "@/components/sections/Process";
import { BeyondDesign } from "@/components/sections/BeyondDesign";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

/* Order follows the visual priority in the brief: identity, then the two
   primary disciplines, then real work, then background — full-stack sits
   late and quiet so it never outranks UI/UX or WordPress. */
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
      <BeyondDesign />
      <About />
      <Contact />
    </>
  );
}
