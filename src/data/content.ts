/**
 * Editorial content — capabilities, experience, skills, process, about.
 * Kept out of components so copy can be revised without touching layout.
 */

export type Capability = {
  number: string;
  title: string;
  body: string;
  /** primary renders large and accented; secondary renders quieter. */
  weight: "primary" | "secondary";
  keywords: string[];
};

export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Full-Stack Development",
    body: "Building complete web applications end to end — frontend, backend, APIs and deployment.",
    weight: "primary",
    keywords: ["Frontend", "Backend", "APIs", "Git"],
  },
  {
    number: "02",
    title: "UI/UX Design",
    body: "Wireframes, prototypes, user interfaces, design systems and responsive experiences.",
    weight: "primary",
    keywords: ["Wireframing", "Prototyping", "Design Systems", "Figma"],
  },
  {
    number: "03",
    title: "WordPress Development",
    body: "Professional responsive websites using WordPress, Elementor, themes, plugins and custom UI adjustments.",
    weight: "secondary",
    keywords: ["WordPress", "Elementor", "Themes", "Responsive"],
  },
];

/* ------------------------------------------------------------ */

export type ExperienceEntry = {
  role: string;
  period: string;
  body: string;
  work: string[];
};

/* Describes work actually performed — not restated to match positioning. */
export const experience: ExperienceEntry[] = [
  {
    role: "UI/UX & WordPress Intern",
    period: "2026",
    body: "Worked on real-world website and digital product projects, contributing to UI/UX design, WordPress development, responsive interfaces and website improvements.",
    work: [
      "Yemo",
      "Parix.ai",
      "Book Scraper",
      "Dr. G.M. Panhwar Institute",
      "IT Men",
      "Discounted LED",
    ],
  },
];

/* ------------------------------------------------------------ */

export type SkillGroup = {
  title: string;
  tier: "primary" | "secondary";
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Full-Stack Development",
    tier: "primary",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Frontend Development",
      "Backend Development",
      "APIs",
      "Git & GitHub",
    ],
  },
  {
    title: "UI/UX Design",
    tier: "primary",
    items: [
      "UI Design",
      "UX Design",
      "Wireframing",
      "Prototyping",
      "User Flows",
      "Responsive Design",
      "Design Systems",
      "Figma",
    ],
  },
  {
    title: "WordPress",
    tier: "secondary",
    items: [
      "WordPress",
      "Elementor",
      "Theme Customization",
      "Plugin Configuration",
      "Responsive Websites",
      "Website UI Implementation",
    ],
  },
];

/* ------------------------------------------------------------ */

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Understand",
    body: "Understand the requirements, product and goals.",
  },
  {
    number: "02",
    title: "Structure",
    body: "Create information hierarchy, user flows and wireframes.",
  },
  {
    number: "03",
    title: "Design",
    body: "Create polished UI and responsive layouts.",
  },
  {
    number: "04",
    title: "Build & Refine",
    body: "Implement the design, test the experience and refine the final result.",
  },
];

/* ------------------------------------------------------------ */

export const about = {
  heading: "About",
  paragraphs: [
    "I'm Shahzaib Panhwer, a full-stack developer and UI/UX designer who builds complete digital products — from the interface through to the application behind it.",
    "I've worked on real-world product and website projects, from restaurant technology and web products to business and WordPress websites.",
    "Designing an interface and building it are the same job to me, which is why I work across both rather than handing off between them.",
  ],
};
