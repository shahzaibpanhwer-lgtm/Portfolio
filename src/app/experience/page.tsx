import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Real-world website and digital product work by Shahzaib Panhwer, across UI/UX design, WordPress development and responsive interfaces.",
};

export default function ExperiencePage() {
  return (
    <>
      <PageHeader
        eyebrow="Background"
        title="Experience"
        lead="Real-world website and product work, and the projects it produced."
      />
      <Experience showHeading={false} />
      <Contact showForm={false} />
    </>
  );
}
