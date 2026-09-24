import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skills } from "@/components/sections/Skills";
import { Process } from "@/components/sections/Process";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Full-stack development, UI/UX design and WordPress — what Shahzaib Panhwer works with, and how he works.",
};

export default function SkillsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Toolkit"
        title="Skills"
        lead="What I work with day to day, and the method behind it."
      />
      <Skills showHeading={false} />
      <Process />
      <Contact showForm={false} />
    </>
  );
}
