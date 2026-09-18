/**
 * Site-wide constants.
 */

export const site = {
  name: "Shahzaib Panhwer",
  shortName: "SP",
  role: "UI/UX Designer & WordPress Developer",
  secondaryRole: "Full-Stack Developer",
  title: "Shahzaib Panhwer — UI/UX Designer & WordPress Developer",
  description:
    "Portfolio of Shahzaib Panhwer, a UI/UX Designer and WordPress Developer working across digital products, websites and WordPress development.",
  url: "https://shahzaibpanhwer.vercel.app",
  availability: "Open to opportunities & freelance projects",
  /**
   * Set to "/resume.pdf" once the file exists in /public — the Resume
   * button in the navbar renders only when this is non-null, so a
   * recruiter can never click through to a 404.
   */
  resumeUrl: null as string | null,
} as const;

export const contact = {
  email: "shahzaibpanhwer446@gmail.com",
  linkedin: "https://www.linkedin.com/in/shahzaib-panhwer-063912285/",
  github: "https://github.com/shahzaibpanhwer-lgtm",
} as const;

export const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
] as const;
