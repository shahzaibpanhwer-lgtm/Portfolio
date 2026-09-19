/**
 * End-to-end audit: routes, links, images, metadata, console errors,
 * heading structure, placeholders and keyboard access.
 *
 *   npm run build && npm run start
 *   BASE=http://localhost:3000 node scripts/audit-e2e.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";

const ROUTES = [
  "/",
  "/work",
  "/wordpress",
  "/about",
  "/contact",
  "/work/devflow",
  "/work/yemo",
  "/work/parix",
  "/work/book-scraper",
];

const problems = [];
const note = (route, kind, msg) => problems.push({ route, kind, msg });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();

/* ---------------- console + network errors ---------------- */
const consoleErrors = [];
const badRequests = [];
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push({ url: page.url(), text: m.text() });
});
page.on("requestfailed", (r) => {
  badRequests.push({ url: page.url(), res: r.url(), err: r.failure()?.errorText });
});
page.on("response", (r) => {
  if (r.status() >= 400) badRequests.push({ url: page.url(), res: r.url(), err: r.status() });
});

const internalLinks = new Set();
const externalLinks = new Map();
const imageSrcs = new Set();

for (const route of ROUTES) {
  const resp = await page.goto(BASE + route, { waitUntil: "networkidle" });
  if (!resp || resp.status() !== 200) {
    note(route, "route", `status ${resp?.status()}`);
    continue;
  }

  // paint everything (reveal animations are viewport-triggered)
  await page.evaluate(async () => {
    const step = innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 110));
    }
    scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(400);

  const data = await page.evaluate(() => {
    const out = {
      h1: document.querySelectorAll("h1").length,
      headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
        Number(h.tagName[1]),
      ),
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? "",
      ogTitle: document.querySelector('meta[property="og:title"]')?.content ?? "",
      ogDesc: document.querySelector('meta[property="og:description"]')?.content ?? "",
      ogImage: document.querySelector('meta[property="og:image"]')?.content ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
      lang: document.documentElement.lang,
      imgsNoAlt: [...document.querySelectorAll("img")]
        .filter((i) => !i.hasAttribute("alt"))
        .map((i) => i.currentSrc || i.src),
      imgs: [...document.querySelectorAll("img")].map((i) => ({
        src: i.currentSrc || i.src,
        natural: [i.naturalWidth, i.naturalHeight],
        shown: [Math.round(i.clientWidth), Math.round(i.clientHeight)],
        loading: i.getAttribute("loading"),
      })),
      anchorsNoName: [...document.querySelectorAll("a,button")].filter((el) => {
        const n = (el.getAttribute("aria-label") || el.textContent || "").trim();
        return !n;
      }).length,
      internal: [...document.querySelectorAll('a[href^="/"]')]
        .map((a) => a.getAttribute("href"))
        .filter((h) => !h.startsWith("/_next")),
      external: [...document.querySelectorAll('a[href^="http"]')].map((a) => ({
        href: a.href,
        rel: a.getAttribute("rel") || "",
        target: a.getAttribute("target") || "",
      })),
      bodyText: document.body.innerText,
      // horizontal overflow
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
    return out;
  });

  if (data.h1 !== 1) note(route, "heading", `expected 1 h1, found ${data.h1}`);
  for (let i = 1; i < data.headings.length; i++) {
    if (data.headings[i] - data.headings[i - 1] > 1) {
      note(route, "heading", `jump h${data.headings[i - 1]} -> h${data.headings[i]}`);
      break;
    }
  }
  if (!data.lang) note(route, "a11y", "html has no lang");
  if (data.overflow > 1) note(route, "layout", `horizontal overflow +${data.overflow}px`);
  if (data.anchorsNoName) note(route, "a11y", `${data.anchorsNoName} link/button without name`);
  for (const s of data.imgsNoAlt) note(route, "a11y", `img without alt: ${s}`);

  if (!data.title) note(route, "seo", "missing <title>");
  if (!data.desc) note(route, "seo", "missing meta description");
  if (!data.ogTitle) note(route, "seo", "missing og:title");
  if (!data.ogImage) note(route, "seo", "missing og:image");

  for (const img of data.imgs) {
    if (img.natural[0] === 0) note(route, "image", `failed to load: ${img.src}`);
    // served far larger than displayed
    if (img.natural[0] > img.shown[0] * 3 && img.shown[0] > 0) {
      note(route, "image", `oversized: ${img.natural[0]}px natural vs ${img.shown[0]}px shown — ${img.src.split("/").pop()}`);
    }
  }

  for (const m of ["YOUR_", "TODO", "Lorem ipsum", "lorem ipsum", "undefined", "NaN"]) {
    if (data.bodyText.includes(m)) note(route, "content", `placeholder/bad text "${m}" visible`);
  }

  data.internal.forEach((h) => internalLinks.add(h));
  data.external.forEach((e) => externalLinks.set(e.href, e));
  data.imgs.forEach((i) => imageSrcs.add(i.src));
}

/* ---------------- internal link resolution ---------------- */
for (const href of internalLinks) {
  const url = href.startsWith("/#") ? "/" : href.split("#")[0];
  if (!url || url === "/") continue;
  const r = await page.request.get(BASE + url);
  if (r.status() !== 200) note(url, "link", `internal link -> ${r.status()}`);
}

/* ---------------- anchor targets exist ---------------- */
await page.goto(BASE + "/", { waitUntil: "networkidle" });
const anchorIssues = await page.evaluate((hrefs) => {
  const out = [];
  for (const h of hrefs) {
    const id = h.includes("#") ? h.split("#")[1] : null;
    if (!id) continue;
    if (!document.getElementById(id)) out.push(h);
  }
  return out;
}, [...internalLinks]);
for (const a of anchorIssues) note("/", "link", `anchor target missing: ${a}`);

/* ---------------- external links ---------------- */
for (const [href, meta] of externalLinks) {
  if (meta.target === "_blank" && !meta.rel.includes("noopener")) {
    note("*", "security", `target=_blank without noopener: ${href}`);
  }
  try {
    const r = await page.request.get(href, { timeout: 25000, maxRedirects: 5 });
    // LinkedIn returns 999 to bots; not a broken link
    if (r.status() >= 400 && r.status() !== 999) {
      note("*", "link", `external ${r.status()}: ${href}`);
    }
  } catch {
    note("*", "link", `external unreachable: ${href}`);
  }
}

/* ---------------- sitemap / robots ---------------- */
for (const p of ["/sitemap.xml", "/robots.txt", "/icon", "/opengraph-image"]) {
  const r = await page.request.get(BASE + p);
  if (r.status() !== 200) note(p, "seo", `status ${r.status()}`);
}
const sitemap = await (await page.request.get(BASE + "/sitemap.xml")).text();
for (const route of ROUTES) {
  const full = route === "/" ? "" : route;
  if (!sitemap.includes(full === "" ? "</loc>" : full + "</loc>")) {
    note(route, "seo", "missing from sitemap");
  }
}

/* ---------------- keyboard ---------------- */
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
const first = await page.evaluate(() => document.activeElement?.textContent?.trim());
if (!/skip to content/i.test(first || "")) {
  note("/", "a11y", `first tab stop is "${first}", expected skip link`);
}

/* ---------------- reduced motion ---------------- */
const rmCtx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const rmPage = await rmCtx.newPage();
for (const route of ["/", "/work/yemo"]) {
  await rmPage.goto(BASE + route, { waitUntil: "networkidle" });
  await rmPage.waitForTimeout(600);
  const hidden = await rmPage.evaluate(() =>
    [...document.querySelectorAll("h1,h2,h3,p")].filter(
      (el) => Number(getComputedStyle(el).opacity) < 0.9 && el.textContent.trim(),
    ).length,
  );
  if (hidden) note(route, "a11y", `${hidden} element(s) stuck transparent under reduced motion`);
}
await rmCtx.close();

await browser.close();

/* ---------------- report ---------------- */
for (const e of consoleErrors) note(e.url.replace(BASE, ""), "console", e.text.slice(0, 140));
for (const b of badRequests) {
  note(b.url.replace(BASE, ""), "network", `${b.err} ${b.res.replace(BASE, "")}`);
}

if (problems.length === 0) {
  console.log("\nE2E AUDIT: no problems found\n");
} else {
  console.log(`\nE2E AUDIT: ${problems.length} problem(s)\n`);
  const byKind = {};
  for (const p of problems) (byKind[p.kind] ??= []).push(p);
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`[${kind}]`);
    const seen = new Set();
    for (const p of list) {
      const line = `  ${p.route}  ${p.msg}`;
      if (seen.has(line)) continue;
      seen.add(line);
      console.log(line);
    }
    console.log("");
  }
}
