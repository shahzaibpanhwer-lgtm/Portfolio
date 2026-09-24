import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Shahzaib Panhwer about UI/UX design, WordPress development or web projects.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-28">
      <Contact as="h1" showForm />
    </div>
  );
}
