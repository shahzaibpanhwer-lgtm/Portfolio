# Shahzaib Panhwer — Portfolio

Personal portfolio for **Shahzaib Panhwer**, UI/UX Designer & WordPress Developer.

Built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

---

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
```

## Quality checks

Both require a running production server (`npm run build && npm run start`).

```bash
npm run qa:responsive   # horizontal overflow across 6 breakpoints + screenshots
npm run qa:a11y         # alt text, accessible names, heading order, reduced motion
```

`qa:responsive` checks 1440 / 1280 / 1024 / 768 / 390 / 375 and writes screenshots
to `.qa-screenshots/`. Point either script at another origin with `BASE=...`.

---

## Structure

```
src/
  app/                    routes + generated icon, OG image, sitemap, robots
    work/[slug]/          case studies, prerendered from project data
  components/
    layout/               Navbar, Footer
    sections/             home page sections, reused by /about, /work, /wordpress
    casestudy/            case study hero, body renderer, footer
    ui/                   Reveal, BrowserFrame, Button, SectionHeading, ...
  data/
    projects.ts           all project + WordPress data  ← edit this
    content.ts            capabilities, experience, skills, process, about copy
    site.ts               name, URL, contact details, nav
  lib/
```

### Adding a project

Append an object to `projects` in [`src/data/projects.ts`](src/data/projects.ts).
The home page, `/work` index, case-study route, sitemap and "next project"
cycle all pick it up automatically — no new files.

The `caseStudy` field is an array of typed blocks:

| Block     | Renders as                                      |
| --------- | ----------------------------------------------- |
| `text`    | sticky heading beside a narrow prose column      |
| `list`    | same, with a numbered item list                  |
| `gallery` | full-width heading, then a grid of framed shots  |
| `compare` | side-by-side Before / After                      |

### Adding screenshots

Every project renders a typographic placeholder plate until a real image
exists. To swap one in:

1. Drop the image at e.g. `public/work/yemo/cover.png`
2. Uncomment the matching `cover:` line in `src/data/projects.ts`

Case-study gallery shots work the same way via each `Shot`'s `src` field.

---

## Before going live

- [ ] Replace `YOUR_EMAIL`, `YOUR_LINKEDIN`, `YOUR_GITHUB` in `src/data/site.ts`
- [ ] Set `site.url` to the real deployed domain (used by OG tags and the sitemap)
- [ ] Add `public/resume.pdf`, then set `site.resumeUrl` to `"/resume.pdf"` —
      the navbar Resume button stays hidden until this is set, so it can never 404
- [ ] Review each project's `contributions` array and correct anything not
      personally performed

---

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`.

| Token                | Value     |
| -------------------- | --------- |
| `--color-bg`         | `#0b0b0c` |
| `--color-surface`    | `#111114` |
| `--color-line`       | `#242428` |
| `--color-ink`        | `#f5f5f5` |
| `--color-ink-dim`    | `#a1a1aa` |
| `--color-accent`     | `#e8a75c` |

One accent colour throughout. Type is Inter (body) and Manrope (display),
self-hosted via `next/font`. All motion is gated behind `prefers-reduced-motion`.
