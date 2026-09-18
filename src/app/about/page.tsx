import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Process } from "@/components/sections/Process";
import { BeyondDesign } from "@/components/sections/BeyondDesign";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Shahzaib Panhwer is a UI/UX designer and WordPress developer who has worked on real-world product and website projects.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="About"
        lead="UI/UX designer and WordPress developer, focused on clean, practical and engaging digital experiences."
      />
      <About showHeading={false} />
      <Experience />
      <Skills />
      <Process />
      <BeyondDesign />
      <Contact />
    </>
  );
}
