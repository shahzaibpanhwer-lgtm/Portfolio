import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PATHS = [
  "/",
  "/work",
  "/wordpress",
  "/about",
  "/contact",
  "/work/yemo",
  "/work/devflow",
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await ctx.newPage();
const issues = [];

for (const path of PATHS) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const found = await page.evaluate(() => {
    const out = [];

    // Images must have alt text.
    for (const img of document.querySelectorAll("img")) {
      if (!img.hasAttribute("alt")) out.push(`img without alt: ${img.src}`);
    }

    // Links and buttons must expose an accessible name.
    for (const el of document.querySelectorAll("a, button")) {
      const name = (
        el.getAttribute("aria-label") ||
        el.textContent ||
        el.getAttribute("title") ||
        ""
      ).trim();
      if (!name) {
        out.push(`${el.tagName.toLowerCase()} without accessible name`);
      }
    }

    // Links must have an href.
    for (const a of document.querySelectorAll("a")) {
      if (!a.getAttribute("href")) out.push("anchor without href");
    }

    // External links must be safe.
    for (const a of document.querySelectorAll('a[target="_blank"]')) {
      const rel = a.getAttribute("rel") || "";
      if (!rel.includes("noopener")) {
        out.push(`target=_blank without noopener: ${a.getAttribute("href")}`);
      }
    }

    // Heading levels must not skip.
    const levels = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
      Number(h.tagName[1]),
    );
    const h1s = levels.filter((l) => l === 1).length;
    if (h1s !== 1) out.push(`expected exactly one h1, found ${h1s}`);
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) {
        out.push(`heading jump h${levels[i - 1]} -> h${levels[i]}`);
      }
    }

    // lang attribute
    if (!document.documentElement.getAttribute("lang")) out.push("html has no lang");

    return out;
  });

  if (found.length) issues.push({ path, found });
}

// Keyboard: the skip link must be the first focusable element.
await page.goto(BASE + "/", { waitUntil: "networkidle" });
await page.keyboard.press("Tab");
const firstFocus = await page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el?.tagName, text: el?.textContent?.trim().slice(0, 40) };
});

/* Reduced motion must render content, not leave it stuck at opacity 0. */
const reducedCtx = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  reducedMotion: "reduce",
});
const reducedPage = await reducedCtx.newPage();
await reducedPage.goto(BASE + "/", { waitUntil: "networkidle" });
await reducedPage.waitForTimeout(600);

const hidden = await reducedPage.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll("h1, h2, h3, p")) {
    const cs = getComputedStyle(el);
    if (Number(cs.opacity) < 0.9 && el.textContent?.trim()) {
      out.push(`${el.tagName.toLowerCase()}: "${el.textContent.trim().slice(0, 40)}"`);
    }
  }
  return out;
});
await reducedCtx.close();

await browser.close();

console.log(`first tab stop: <${firstFocus.tag}> "${firstFocus.text}"`);
if (hidden.length) {
  console.log("REDUCED MOTION — content stuck transparent:");
  for (const h of hidden) console.log("   - " + h);
} else {
  console.log("reduced motion: all content rendered visible");
}
if (issues.length === 0) {
  console.log("A11Y: no issues across " + PATHS.length + " routes");
} else {
  for (const i of issues) {
    console.log(`\n${i.path}`);
    for (const f of new Set(i.found)) console.log("   - " + f);
  }
}
