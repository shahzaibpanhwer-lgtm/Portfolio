import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { WordPressWork } from "@/components/sections/WordPressWork";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected UI/UX, product and WordPress projects by Shahzaib Panhwer — Yemo, Parix.ai, Book Scraper and DevFlow.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Work"
        lead="Real products, websites and digital experiences I've worked on."
      />
      <SelectedWork showAllLink={false} showHeading={false} />
      <WordPressWork />
    </>
  );
}
