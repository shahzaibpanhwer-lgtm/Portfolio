/**
 * PROJECT DATA — single source of truth.
 *
 * Add a project by appending an object here; the work index, home page
 * and case-study routes all generate from this file.
 *
 * TRUTHFULNESS RULE: no invented clients, metrics, research results,
 * durations or responsibilities. Where a detail has not been confirmed,
 * the field is left empty rather than filled with a guess.
 */

export type Shot = {
  /** Path under /public once real screenshots are added. */
  src?: string;
  label: string;
  caption?: string;
  ratio?: "16/10" | "16/9" | "4/3" | "1/1" | "9/16";
};

export type CaseStudyBlock =
  | { kind: "text"; heading: string; body: string[] }
  | { kind: "list"; heading: string; body?: string[]; items: string[] }
  | { kind: "gallery"; heading: string; body?: string[]; shots: Shot[] }
  | {
      kind: "compare";
      heading: string;
      body?: string[];
      before: Shot;
      after: Shot;
    };

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** One line under the title in listings. */
  tagline: string;
  description: string;
  categories: string[];
  role: string;
  type: string;
  tools: string[];
  year: string;
  liveUrl: string;
  /** featured = large editorial treatment; secondary = compact card. */
  tier: "featured" | "secondary";
  cover?: string;
  contributions: string[];
  caseStudy: CaseStudyBlock[];
};

/* ============================================================
   SELECTED WORK
   ============================================================ */

export const projects: Project[] = [
  {
    slug: "yemo",
    number: "01",
    title: "Yemo",
    tagline: "Restaurant Technology / Product Experience",
    description:
      "Designing a modern digital experience for restaurant technology.",
    categories: ["UI/UX Design", "Product Design", "Web"],
    role: "UI/UX Designer",
    type: "Product / Web",
    tools: ["Figma", "Wireframing", "Prototyping"],
    year: "2026",
    liveUrl: "https://yemo.app/welcome/",
    tier: "featured",
    cover: "/work/yemo/cover.jpg",
    contributions: [
      "UI design",
      "UX structure & user flows",
      "Wireframing",
      "Prototyping",
      "Responsive layouts",
    ],
    caseStudy: [
      {
        kind: "text",
        heading: "Project Overview",
        body: [
          "Yemo is a restaurant technology product. The work centred on shaping a digital experience that communicates the product clearly and makes its core flows easy to move through.",
          "The goal was an interface that reads as credible to restaurant operators — organised, legible and quick to scan — rather than decorative.",
        ],
      },
      {
        kind: "list",
        heading: "My Role",
        body: ["I worked as the UI/UX designer on this project."],
        items: [
          "UI design",
          "UX structure and user flows",
          "Wireframing",
          "Prototyping",
          "Responsive layout design",
        ],
      },
      {
        kind: "text",
        heading: "Challenge",
        body: [
          "Restaurant technology has to present a lot at once — features, workflows and value — without overwhelming the person reading it.",
          "The challenge was building a hierarchy that lets someone understand what the product does quickly, then go deeper only if they want to.",
        ],
      },
      {
        kind: "list",
        heading: "Design Process",
        items: [
          "Understand the product and what it needs to communicate",
          "Structure the information and map the flows",
          "Wireframe the layouts at low fidelity",
          "Build the UI and type hierarchy in Figma",
          "Prototype the key interactions",
          "Adapt every layout across breakpoints",
        ],
      },
      {
        kind: "gallery",
        heading: "Wireframes",
        body: [
          "Low-fidelity layouts used to settle structure and hierarchy before any visual design.",
        ],
        shots: [
          { label: "Structure — home", ratio: "4/3" },
          { label: "Structure — product", ratio: "4/3" },
          { label: "Structure — detail", ratio: "4/3" },
        ],
      },
      {
        kind: "gallery",
        heading: "UI Exploration",
        body: [
          "Type scale, spacing system and component treatment explored in Figma.",
        ],
        shots: [
          { label: "Type & colour direction", ratio: "16/10" },
          { label: "Component treatment", ratio: "16/10" },
        ],
      },
      {
        kind: "gallery",
        heading: "Key Screens",
        shots: [
          { label: "Welcome", ratio: "16/10" },
          { label: "Product overview", ratio: "16/10" },
          { label: "Detail view", ratio: "16/10" },
        ],
      },
      {
        kind: "gallery",
        heading: "Responsive Experience",
        body: [
          "Layouts were redesigned per breakpoint rather than scaled down — spacing, type size and stacking order all shift.",
        ],
        shots: [
          { label: "Desktop — 1440", ratio: "16/10" },
          { label: "Mobile — 390", ratio: "9/16" },
        ],
      },
    ],
  },

  {
    slug: "parix",
    number: "02",
    title: "Parix.ai",
    tagline: "AI Automation / Website & Web Design",
    description:
      "Designing and improving a modern digital experience for an AI automation company.",
    categories: ["UI/UX", "Web Design", "WordPress", "Website"],
    role: "UI/UX Designer & WordPress Developer",
    type: "Website / WordPress",
    tools: ["Figma", "WordPress", "Elementor"],
    year: "2026",
    liveUrl: "https://parix.ai/",
    tier: "featured",
    cover: "/work/parix/cover.jpg",
    contributions: [
      "UI/UX design",
      "Web design",
      "WordPress development",
      "Website improvements",
      "Responsive design",
      "Animation concepts",
    ],
    caseStudy: [
      {
        kind: "text",
        heading: "Project Overview",
        body: [
          "Parix.ai is an AI automation company. The work covered both the design and the build side — shaping the visual direction of the website and implementing it in WordPress.",
          "This project sits at the intersection of the two things I do most: designing the interface, then building it.",
        ],
      },
      {
        kind: "list",
        heading: "My Role",
        items: [
          "UI/UX design",
          "Web design",
          "WordPress development",
          "Website improvements",
          "Responsive design",
          "Animation and interaction concepts",
        ],
      },
      {
        kind: "text",
        heading: "Challenge",
        body: [
          "AI companies tend to look alike — the same gradients, the same abstract visuals. The site needed to feel modern without falling into that template.",
          "It also had to hold up across a long page of sections without the hierarchy flattening out.",
        ],
      },
      {
        kind: "text",
        heading: "Design Direction",
        body: [
          "The direction leaned on spacing, type hierarchy and restraint rather than heavy visual effects, so the content stays the focus and each section reads as distinct.",
        ],
      },
      {
        kind: "gallery",
        heading: "UI Exploration",
        shots: [
          { label: "Direction — type & spacing", ratio: "16/10" },
          { label: "Section treatments", ratio: "16/10" },
        ],
      },
      {
        kind: "gallery",
        heading: "Website Sections",
        shots: [
          { label: "Hero", ratio: "16/10" },
          { label: "Services", ratio: "16/10" },
          { label: "Process", ratio: "16/10" },
          { label: "Contact", ratio: "16/10" },
        ],
      },
      {
        kind: "gallery",
        heading: "Responsive Design",
        shots: [
          { label: "Desktop", ratio: "16/10" },
          { label: "Mobile", ratio: "9/16" },
        ],
      },
      {
        kind: "list",
        heading: "Animation & Interaction",
        body: [
          "Motion was kept purposeful — used to guide attention through the page rather than to decorate it.",
        ],
        items: [
          "Section reveal on scroll",
          "Hover states on interactive elements",
          "Smooth transitions between states",
        ],
      },
    ],
  },

  {
    slug: "book-scraper",
    number: "03",
    title: "Book Scraper",
    tagline: "Web Product / Data Interface",
    description:
      "Designing a focused digital experience for discovering and working with book data.",
    categories: ["Web Product", "UI", "Web Design"],
    role: "UI/UX Designer",
    type: "Web Product",
    tools: ["Figma", "UI Design"],
    year: "2026",
    liveUrl: "https://book.onlineguru.ai/",
    tier: "secondary",
    // The public URL is a login wall, so an automated capture shows only
    // the sign-in form. Export a screenshot of the real interface and
    // uncomment this line:
    // cover: "/work/book-scraper/cover.jpg",
    contributions: ["UI design", "Web design", "Responsive layouts"],
    caseStudy: [
      {
        kind: "text",
        heading: "Project Overview",
        body: [
          "Book Scraper is a web product for discovering and working with book data. The design problem here was density: a lot of structured information that has to stay readable.",
        ],
      },
      {
        kind: "list",
        heading: "My Role",
        items: ["UI design", "Web design", "Responsive layouts"],
      },
      {
        kind: "text",
        heading: "Challenge",
        body: [
          "Data-heavy interfaces fall apart when every element competes for attention. The layout needed a clear reading order and enough breathing room that results stay scannable.",
        ],
      },
      {
        kind: "gallery",
        heading: "Key Screens",
        shots: [
          { label: "Search & results", ratio: "16/10" },
          { label: "Detail view", ratio: "16/10" },
        ],
      },
      {
        kind: "gallery",
        heading: "Responsive",
        shots: [
          { label: "Desktop", ratio: "16/10" },
          { label: "Mobile", ratio: "9/16" },
        ],
      },
    ],
  },

  {
    slug: "devflow",
    number: "04",
    title: "DevFlow",
    tagline: "Developer Project, API & Deployment Management Platform",
    description:
      "A unified command center for managing projects, repositories, APIs, deployments, analytics, documentation and developer workflows.",
    categories: ["Full-Stack", "Product Design", "Web App"],
    role: "Designer & Developer",
    type: "Full-Stack Web Application",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    year: "2026",
    liveUrl: "https://devflow-pink-nu.vercel.app/",
    tier: "secondary",
    cover: "/work/devflow/cover.jpg",
    contributions: [
      "Product design",
      "UI design",
      "Frontend development",
      "Backend development",
      "Deployment",
    ],
    caseStudy: [
      {
        kind: "text",
        heading: "Project Overview",
        body: [
          "DevFlow is a developer platform that brings projects, repositories, APIs, deployments, analytics and documentation into one command center.",
          "It is the project where I designed and built the whole thing — the interface and the application behind it.",
        ],
      },
      {
        kind: "list",
        heading: "My Role",
        body: [
          "End to end: I designed the product and built it as a working application.",
        ],
        items: [
          "Product design",
          "UI design",
          "Frontend development",
          "Backend development",
          "Deployment",
        ],
      },
      {
        kind: "text",
        heading: "Challenge",
        body: [
          "A command center has a breadth problem: many distinct areas that each need their own space without the navigation collapsing under the weight.",
          "The work was in giving each area a consistent structure so moving between them feels like one product rather than several stitched together.",
        ],
      },
      {
        kind: "list",
        heading: "What It Manages",
        items: [
          "Projects",
          "Repositories",
          "APIs",
          "Deployments",
          "Analytics",
          "Documentation",
          "Developer workflows",
        ],
      },
      {
        kind: "gallery",
        heading: "Key Screens",
        shots: [
          { label: "Dashboard", ratio: "16/10" },
          { label: "Projects", ratio: "16/10" },
          { label: "Deployments", ratio: "16/10" },
        ],
      },
    ],
  },
];

/* ============================================================
   WORDPRESS WORK
   ============================================================ */

export type WordPressProject = {
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  liveUrl: string;
  technologies: string[];
  contributions: string[];
  tier: "lead" | "standard";
  cover?: string;
};

export const wordpressProjects: WordPressProject[] = [
  {
    slug: "drgm-panhwar-institute",
    number: "01",
    title: "Dr. G.M. Panhwar Institute",
    category: "Institutional Website",
    description:
      "A WordPress website for an institute, built with a clear content structure and responsive layouts across every page.",
    liveUrl: "https://drgmpanhwarinstitute.org/",
    technologies: ["WordPress", "Elementor", "Responsive Design"],
    contributions: [
      "Page development",
      "Elementor",
      "UI implementation",
      "Responsive layouts",
      "Content sections",
    ],
    tier: "lead",
    cover: "/wordpress/drgm/cover.jpg",
  },
  {
    slug: "parix-wp",
    number: "02",
    title: "Parix.ai",
    category: "AI Automation Company",
    description:
      "Design and WordPress implementation for the website of an AI automation company.",
    liveUrl: "https://parix.ai/",
    technologies: ["WordPress", "Elementor", "Responsive Design"],
    contributions: [
      "UI implementation",
      "Elementor",
      "Responsive layouts",
      "UI improvements",
    ],
    tier: "standard",
    cover: "/wordpress/parix/cover.jpg",
  },
  {
    slug: "it-men",
    number: "03",
    title: "IT Men",
    category: "Business Website",
    description:
      "A business website built and maintained in WordPress with responsive page layouts.",
    liveUrl: "https://www.itmen.pk/",
    technologies: ["WordPress", "Elementor", "Responsive Design"],
    contributions: [
      "Page development",
      "Elementor",
      "Responsive layouts",
      "Website maintenance",
    ],
    tier: "standard",
    cover: "/wordpress/itmen/cover.jpg",
  },
  {
    slug: "discounted-led",
    number: "04",
    title: "Discounted LED",
    category: "Product Website",
    description:
      "A product-focused WordPress website with responsive layouts and UI adjustments.",
    liveUrl: "https://discountled.us/",
    technologies: ["WordPress", "Elementor", "Responsive Design"],
    contributions: [
      "UI implementation",
      "Responsive layouts",
      "Theme customization",
      "UI improvements",
    ],
    tier: "standard",
    cover: "/wordpress/discountled/cover.jpg",
  },
];

/* ============================================================
   HELPERS
   ============================================================ */

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getNextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
