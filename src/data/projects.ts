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
  cover?: string;
  contributions: string[];
  caseStudy: CaseStudyBlock[];
};

/* ============================================================
   SELECTED WORK
   ============================================================ */

export const projects: Project[] = [
  {
    slug: "devflow",
    number: "01",
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

  {
    slug: "yemo",
    number: "02",
    title: "Yemo",
    tagline: "Restaurant Technology / Product Experience",
    description:
      "Designing four connected surfaces — guest, server, kitchen and management — for a restaurant operating system.",
    categories: ["UI/UX Design", "Product Design", "Web"],
    role: "UI/UX Designer",
    type: "Product / Web",
    tools: ["Figma", "Wireframing", "Prototyping"],
    year: "2026",
    liveUrl: "https://yemo.app/welcome/",
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
          "Yemo is a restaurant operating system. It is not one screen but four, each built for a different person in the same service: the guest at the table, the server on the floor, the cook on the line, and the owner watching the whole room.",
          "The design work was making those four surfaces read as one product, when each is used at a different distance, at a different speed, and under very different pressure.",
        ],
      },
      {
        kind: "list",
        heading: "My Role",
        body: ["I worked as the UI/UX designer on this project."],
        items: [
          "UI design across all four surfaces",
          "UX structure and user flows",
          "Wireframing",
          "Prototyping",
          "Responsive layout design",
          "Bilingual layouts, English and Spanish",
        ],
      },
      {
        kind: "text",
        heading: "Challenge",
        body: [
          "A guest browsing a menu has time. A cook on the line during a dinner rush has none. One system had to serve a relaxed, photographic reading experience and a glanceable, high-contrast production display without splitting into two products.",
          "Every surface also had to hold up in English and Spanish, so no layout could depend on a label staying a particular length.",
        ],
      },
      {
        kind: "list",
        heading: "Design Process",
        items: [
          "Map who uses each surface, and under what pressure",
          "Structure the information per surface before styling anything",
          "Wireframe the layouts at low fidelity",
          "Build one dark UI system — type scale, spacing, status colour",
          "Prototype the order flow end to end",
          "Adapt every layout across breakpoints and both languages",
        ],
      },
      {
        kind: "gallery",
        heading: "Guest — The Menu",
        body: [
          "The guest surface is the only one meant to be browsed rather than scanned. Dishes lead with photography and video, and carry what a diner actually asks about: price, rating, prep time and calories.",
          "It is phone-first, because it is read at the table.",
        ],
        shots: [
          {
            src: "/work/yemo/guest-menu.png",
            label: "Guest menu",
            caption: "Guest — menu and dish detail, mobile",
            ratio: "9/16",
          },
        ],
      },
      {
        kind: "gallery",
        heading: "Server — Floor & Requests",
        body: [
          "The server surface inverts the priority: requests first, ordered by how long a table has been waiting, with urgency carried in colour and a waiting timer on every row.",
          "A compact tile block answers what a server checks between tables — how many covers are seated, what is ready to run, what is still outstanding.",
        ],
        shots: [
          {
            src: "/work/yemo/server-app.png",
            label: "Server app",
            caption: "Server — request queue and floor summary",
            ratio: "16/9",
          },
        ],
      },
      {
        kind: "gallery",
        heading: "Kitchen — Line Display",
        body: [
          "The kitchen display is read across a pass, at distance, mid-service. Orders move left to right through New, Preparing and Ready, and each column carries its own status colour so the state of the line is legible before a single word is read.",
          "Every ticket shows elapsed time, table, cover count and station. Allergy warnings are lifted out of the item list into their own red band, because that is the one thing that must never be skimmed past.",
        ],
        shots: [
          {
            src: "/work/yemo/kitchen-display.png",
            label: "Kitchen display",
            caption: "Kitchen — line display, orders by station",
            ratio: "16/9",
          },
        ],
      },
      {
        kind: "gallery",
        heading: "HQ — Owner Dashboard",
        body: [
          "The owner surface summarises rather than instructs. Service metrics sit in a scannable tile grid, and problem states — kitchen delays, open server requests — are pulled into red so they surface ahead of the healthy numbers.",
          "A restaurant health score, a live activity feed and the floor plan sit alongside them, so the state of the room is readable without opening another screen.",
        ],
        shots: [
          {
            src: "/work/yemo/hq-dashboard.png",
            label: "HQ dashboard",
            caption: "HQ — service overview, health score and activity feed",
            ratio: "16/9",
          },
        ],
      },
      {
        kind: "list",
        heading: "What Holds It Together",
        body: [
          "Four surfaces, one system. These are the rules that keep them recognisable as the same product:",
        ],
        items: [
          "One dark palette, readable in a dim dining room and a bright kitchen alike",
          "Status carried by colour, consistently — new, preparing, ready, delayed",
          "An elapsed timer on anything a person is waiting for",
          "Warnings given their own container rather than another line of text",
          "One type scale, resized per surface rather than redrawn",
          "English and Spanish on every surface",
        ],
      },
    ],
  },

  {
    slug: "parix",
    number: "03",
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
          "It also had to hold a long page together. Parix sells several different things, and each section had to read as distinct without the hierarchy flattening out by the third scroll.",
        ],
      },
      {
        kind: "text",
        heading: "Design Direction",
        body: [
          "The direction leans on spacing, type hierarchy and restraint rather than heavy visual effects. A serif display face carries the section headings against a plain sans for body copy, which gives each section a clear entry point without adding colour or ornament.",
          "One warm accent does the emphasis work throughout, so a reader's eye is pulled to the same kind of thing every time.",
        ],
      },
      {
        kind: "gallery",
        heading: "Website Sections",
        body: [
          "Each section states one idea and shows the evidence for it. The page moves from what the product does, to proof it works, to the tools and writing that support it.",
        ],
        shots: [
          {
            src: "/work/parix/section-1.jpg",
            label: "Case studies",
            caption: "Case studies — proof section",
            ratio: "16/10",
          },
          {
            src: "/work/parix/section-2.jpg",
            label: "Free tools",
            caption: "Free tools — utility section",
            ratio: "16/10",
          },
          {
            src: "/work/parix/section-3.jpg",
            label: "Editorial",
            caption: "Editorial — article listing",
            ratio: "16/10",
          },
        ],
      },
      {
        kind: "gallery",
        heading: "Responsive Design",
        body: [
          "The same section at desktop and phone width. The mobile layout is restacked rather than scaled: the navigation collapses, the headline drops to a tighter measure, and the two calls to action go full width so they stay thumb-reachable.",
        ],
        shots: [
          {
            src: "/work/parix/cover.jpg",
            label: "Desktop",
            caption: "Desktop — 1440",
            ratio: "16/10",
          },
          {
            src: "/work/parix/mobile.jpg",
            label: "Mobile",
            caption: "Mobile — 390",
            ratio: "9/16",
          },
        ],
      },
      {
        kind: "list",
        heading: "Animation & Interaction",
        body: [
          "Motion was kept purposeful — used to guide attention through a long page rather than to decorate it.",
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
    number: "04",
    title: "Book Scraper",
    tagline: "Web Product / Data Interface",
    description:
      "Designing a focused interface for comparing book prices across marketplaces and exporting the results.",
    categories: ["Web Product", "UI", "Web Design"],
    role: "UI/UX Designer",
    type: "Web Product",
    tools: ["Figma", "UI Design"],
    year: "2026",
    liveUrl: "https://book.onlineguru.ai/",
    // Supplied manually — the public URL is a login wall, so this screen
    // cannot be captured by scripts/capture-covers.mjs.
    cover: "/work/book-scraper/cover.jpg",
    contributions: ["UI design", "Web design", "Responsive layouts"],
    caseStudy: [
      {
        kind: "text",
        heading: "Project Overview",
        body: [
          "Book Scraper is a web product that compares book prices across multiple marketplaces from a list of ISBN or ASIN codes and returns a formatted report. The design problem here was density: a lot of structured information that has to stay readable.",
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
  /** Extra screens, shown on the /wordpress route. */
  gallery?: Shot[];
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
    gallery: [
      {
        src: "/wordpress/drgm/section-1.jpg",
        label: "Desktop",
        caption: "About and programme sections",
        ratio: "16/10",
      },
      {
        src: "/wordpress/drgm/section-2.jpg",
        label: "Desktop",
        caption: "Activities and events",
        ratio: "16/10",
      },
      {
        src: "/wordpress/drgm/mobile.jpg",
        label: "Mobile",
        caption: "Responsive — 390",
        ratio: "9/16",
      },
    ],
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
    gallery: [
      {
        src: "/work/parix/section-1.jpg",
        label: "Desktop",
        caption: "Case studies section",
        ratio: "16/10",
      },
      {
        src: "/work/parix/section-2.jpg",
        label: "Desktop",
        caption: "Free tools section",
        ratio: "16/10",
      },
      {
        src: "/work/parix/mobile.jpg",
        label: "Mobile",
        caption: "Responsive — 390",
        ratio: "9/16",
      },
    ],
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
    gallery: [
      {
        src: "/wordpress/itmen/section-1.jpg",
        label: "Desktop",
        caption: "Services overview",
        ratio: "16/10",
      },
      {
        src: "/wordpress/itmen/section-2.jpg",
        label: "Desktop",
        caption: "Insights listing",
        ratio: "16/10",
      },
      {
        src: "/wordpress/itmen/mobile.jpg",
        label: "Mobile",
        caption: "Responsive — 390",
        ratio: "9/16",
      },
    ],
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
    gallery: [
      {
        src: "/wordpress/discountled/section-1.jpg",
        label: "Desktop",
        caption: "Solutions overview",
        ratio: "16/10",
      },
      {
        src: "/wordpress/discountled/section-2.jpg",
        label: "Desktop",
        caption: "LED display range",
        ratio: "16/10",
      },
      {
        src: "/wordpress/discountled/mobile.jpg",
        label: "Mobile",
        caption: "Responsive — 390",
        ratio: "9/16",
      },
    ],
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
