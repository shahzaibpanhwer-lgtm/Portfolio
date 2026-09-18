/**
 * Site-wide constants.
 */

export const site = {
  name: "Shahzaib Panhwer",
  shortName: "SP",
  role: "Full-Stack Developer & UI/UX Designer",
  secondaryRole: "WordPress Developer",
  title: "Shahzaib Panhwer — Full-Stack Developer & UI/UX Designer",
  description:
    "Portfolio of Shahzaib Panhwer, a Full-Stack Developer and UI/UX Designer building complete web applications, digital products and WordPress websites.",
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
