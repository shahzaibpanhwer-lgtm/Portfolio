import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { About } from "@/components/sections/About";
import { Capabilities } from "@/components/sections/Capabilities";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "About",
  description:
    "Shahzaib Panhwer is a full-stack developer and UI/UX designer who has worked on real-world product and website projects.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title="About"
        lead="Full-stack developer and UI/UX designer, building digital products that are both functional and intuitive."
      />
      <About showHeading={false} />
      <Capabilities />
      <Contact showForm={false} />
    </>
  );
}
