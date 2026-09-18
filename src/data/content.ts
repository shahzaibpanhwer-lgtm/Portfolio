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
    title: "UI/UX Design",
    body: "Wireframes, prototypes, user interfaces, design systems and responsive experiences.",
    weight: "primary",
    keywords: ["Wireframing", "Prototyping", "Design Systems", "Figma"],
  },
  {
    number: "02",
    title: "WordPress Development",
    body: "Professional responsive websites using WordPress, Elementor, themes, plugins and custom UI adjustments.",
    weight: "primary",
    keywords: ["WordPress", "Elementor", "Themes", "Responsive"],
  },
  {
    number: "03",
    title: "Full-Stack Development",
    body: "Building functional web applications and working across frontend and backend technologies.",
    weight: "secondary",
    keywords: ["Frontend", "Backend", "APIs", "Git"],
  },
];

/* ------------------------------------------------------------ */

export type ExperienceEntry = {
  role: string;
  period: string;
  body: string;
  work: string[];
};

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
    tier: "primary",
    items: [
      "WordPress",
      "Elementor",
      "Theme Customization",
      "Plugin Configuration",
      "Responsive Websites",
      "Website UI Implementation",
    ],
  },
  {
    title: "Full-Stack Development",
    tier: "secondary",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "Frontend Development",
      "Backend Development",
      "APIs",
      "Git",
      "GitHub",
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
    "I'm Shahzaib Panhwer, a UI/UX designer and WordPress developer focused on creating clean, practical and engaging digital experiences.",
    "I've worked on real-world product and website projects, from restaurant technology and web products to business and WordPress websites.",
    "Alongside design and WordPress, I'm also developing my full-stack development skills to better understand and build complete digital products.",
  ],
};

export const beyondDesign = {
  heading: "Beyond Design",
  body: "Alongside UI/UX and WordPress, I'm expanding my development skills to build complete web applications.",
  areas: [
    { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "React"] },
    { title: "Backend", items: ["Server logic", "Data handling"] },
    { title: "APIs", items: ["REST", "Integration"] },
    { title: "Version Control", items: ["Git", "GitHub"] },
  ],
};
