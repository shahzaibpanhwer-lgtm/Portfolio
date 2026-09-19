import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { WordPressWork } from "@/components/sections/WordPressWork";

export const metadata: Metadata = {
  title: "WordPress Work",
  description:
    "WordPress websites built with Elementor, theme customization and responsive layouts by Shahzaib Panhwer.",
};

export default function WordPressPage() {
  return (
    <>
      <PageHeader
        eyebrow="WordPress"
        title="WordPress Work"
        lead="Real-world websites I contributed to during my internship, built with WordPress, Elementor and responsive layouts."
      />
      <WordPressWork showAllLink={false} showHeading={false} detailed />
    </>
  );
}
