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
  /**
   * Where the contact form POSTs. FormSubmit forwards each submission to
   * the inbox in the URL, with no account or API key. The very first
   * submission sends an "Activate Form" email to that inbox; messages are
   * delivered once that link has been clicked.
   */
  contactEndpoint: "https://formsubmit.co/ajax/shahzaibpanhwer446@gmail.com",
} as const;

/**
 * Booking calendar. Slots are generated from these rules in the browser —
 * there is no live calendar behind them — so a pick is a *request*,
 * confirmed by email. Keep the hours honest and it stays reliable.
 */
export const booking = {
  /** IANA zone the hours below are written in. */
  timeZone: "Asia/Karachi",
  /** How the zone is named to visitors. */
  zoneLabel: "Pakistan",
  /** 0 = Sunday … 6 = Saturday, in the zone above. */
  days: [1, 2, 3, 4, 5],
  /** First and last bookable start hours, 24h, in the zone above. */
  firstHour: 11,
  lastHour: 20,
  /** Spacing between start times. */
  stepMinutes: 30,
  /** How far ahead a visitor can book. */
  windowDays: 28,
  /** No slot closer than this to "now". */
  noticeHours: 12,
  durations: [
    { minutes: 15, label: "Quick intro" },
    { minutes: 30, label: "Project call" },
  ],
  topics: ["New project", "Design review", "WordPress site", "Hiring", "Just saying hi"],
} as const;

export const contact = {
  email: "shahzaibpanhwer446@gmail.com",
  linkedin: "https://www.linkedin.com/in/shahzaib-panhwer-063912285/",
  github: "https://github.com/shahzaibpanhwer-lgtm",
} as const;

/**
 * Each item is its own route. These were in-page anchors before, which
 * meant the separate pages existed but nothing ever linked to them.
 */
export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Skills", href: "/skills" },
  { label: "Contact", href: "/contact" },
] as const;
