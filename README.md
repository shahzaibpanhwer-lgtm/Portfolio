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

To refresh the project cover images from the live sites:

```bash
node scripts/capture-covers.mjs
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

### Screenshots

Project covers in `public/` are automated captures of the live sites,
produced by `scripts/capture-covers.mjs`.

Anything without an image renders a typographic placeholder plate instead.
To add one:

1. Drop the image at e.g. `public/work/yemo/cover.jpg`
2. Uncomment the matching `cover:` line in `src/data/projects.ts`

Case-study gallery shots work the same way via each `Shot`'s `src` field.

Two kinds of imagery cannot be captured automatically and have to be
exported by hand:

- **Book Scraper** — the public URL is a login wall, so a capture only
  yields the sign-in form
- **Design-process imagery** — wireframes, Figma exploration and
  before/after comparisons, which only exist in the source files

---

## Before going live

- [x] Contact details wired up in `src/data/site.ts`
- [ ] Set `site.url` to the real deployed domain (used by OG tags and the sitemap)
- [ ] Add `public/resume.pdf`, then set `site.resumeUrl` to `"/resume.pdf"` —
      the navbar Resume button stays hidden until this is set, so it can never 404
- [ ] Add a Book Scraper screenshot (see **Screenshots** above)
- [ ] Add wireframe / UI-exploration imagery to the case studies
- [ ] Review each project's `contributions` array and correct anything not
      personally performed

### Booking calendar

The "Book a call" calendar (home page, the closing section of every page,
and a tab on `/contact`) is driven by `booking` in
[`src/data/site.ts`](src/data/site.ts): time zone, working days, first and
last start hour, slot spacing, how far ahead and how much notice.

Slots are generated in the browser from those rules — there is no live
calendar behind them — so a pick is sent as a *request* through the same
FormSubmit endpoint as the contact form, with the time in both zones.
Confirm it by replying. Keep the hours honest and it stays reliable.

---

## Motion

- Inertial page scroll (Lenis) on mouse/trackpad; native scroll on touch
- Word-by-word masked reveals on headings, a sweeping light beam in the
  hero, magnetic primary buttons
- The hero's project deck (the first three projects with a cover in
  `projects.ts`): a stack that turns over on a spring, timed by the
  active tab's progress line, pausing on hover; tabs and back cards
  switch it by hand
- Project frames that tilt flat as they scroll in
- Navbar that tucks away while reading down

All of it lives in `src/components/motion/` and switches off under
`prefers-reduced-motion`.

---

## Design system

Tokens live in [`src/app/globals.css`](src/app/globals.css) under `@theme`.

| Token                | Value     |
| -------------------- | --------- |
| `--color-bg`         | `#08080a` |
| `--color-surface`    | `#0f0f12` |
| `--color-line`       | `#1f1f24` |
| `--color-ink`        | `#ededed` |
| `--color-ink-dim`    | `#a1a1aa` |
| `--color-ink-faint`  | `#8b8b94` |
| `--color-accent`     | `#c6f25a` |

Headings use the `silver` utility (a white-to-grey text gradient).
One accent colour throughout. Components reach it only through
`--color-accent` (tints use `color-mix`), so changing the palette is an
edit to the tokens above — plus the hex in `opengraph-image.tsx`,
`work/[slug]/opengraph-image.tsx` and `icon.tsx`, which render outside CSS. Type is Inter (body) and Manrope (display),
self-hosted via `next/font`. All motion is gated behind `prefers-reduced-motion`.
