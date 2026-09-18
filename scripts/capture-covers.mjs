/**
 * Captures cover screenshots of the live project sites into /public.
 *
 * These are automated captures of the real, published sites — not mockups.
 * Design-process imagery (wireframes, Figma exploration, before/after)
 * cannot be captured this way and has to be exported by hand.
 *
 *   node scripts/capture-covers.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const TARGETS = [
  { url: "https://yemo.app/welcome/", out: "public/work/yemo/cover.jpg" },
  { url: "https://parix.ai/", out: "public/work/parix/cover.jpg" },
  // book.onlineguru.ai is behind a login wall — an automated capture
  // only yields the sign-in form. Screenshot that one manually.
  { url: "https://devflow-pink-nu.vercel.app/", out: "public/work/devflow/cover.jpg" },
  // Dr. G.M. Panhwar Institute uses a rotating hero; the cover in /public
  // was chosen by hand from a better slide. Re-enable only to replace it.
  // { url: "https://drgmpanhwarinstitute.org/", out: "public/wordpress/drgm/cover.jpg" },
  { url: "https://parix.ai/", out: "public/wordpress/parix/cover.jpg" },
  { url: "https://www.itmen.pk/", out: "public/wordpress/itmen/cover.jpg" },
  { url: "https://discountled.us/", out: "public/wordpress/discountled/cover.jpg" },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36",
});

for (const t of TARGETS) {
  const page = await ctx.newPage();
  try {
    await page.goto(t.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});

    /* Nudge the page so lazy-loaded hero media actually paints, then
       return to the top for the capture. */
    await page.evaluate(async () => {
      window.scrollTo(0, 600);
      await new Promise((r) => setTimeout(r, 700));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 700));
    });

    /* Dismiss consent banners and announcement modals — a popup covering
       the hero makes the capture useless as portfolio evidence. */
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(300);

    for (const label of [
      /accept/i,
      /agree/i,
      /got it/i,
      /allow all/i,
      /^close$/i,
      /dismiss/i,
      /no thanks/i,
    ]) {
      const btn = page.getByRole("button", { name: label }).first();
      if (await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    /* Fall back to common close-control selectors, then hard-hide any
       element still painting as a fixed full-screen overlay. */
    const closers = [
      '[aria-label*="close" i]',
      '[title*="close" i]',
      ".modal .close",
      ".popup-close",
      ".mfp-close",
      ".eael-popup-close-button",
      'button:has-text("×")',
    ];
    for (const sel of closers) {
      const el = page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(400);
      }
    }

    await page.evaluate(() => {
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.position !== "fixed" || cs.display === "none") continue;
        const r = el.getBoundingClientRect();
        const coversMost =
          r.width > innerWidth * 0.5 && r.height > innerHeight * 0.5;
        const isBackdrop =
          r.width >= innerWidth * 0.95 && r.height >= innerHeight * 0.95;
        if ((coversMost || isBackdrop) && Number(cs.zIndex || 0) > 100) {
          el.style.setProperty("display", "none", "important");
        }
      }
      document.body.style.overflow = "auto";
    });
    await page.waitForTimeout(400);

    await page.waitForTimeout(800);
    await mkdir(path.dirname(t.out), { recursive: true });
    await page.screenshot({ path: t.out, type: "jpeg", quality: 82 });
    console.log(`  ok   ${t.out}`);
  } catch (err) {
    console.log(`  FAIL ${t.out} — ${err.message.split("\n")[0]}`);
  } finally {
    await page.close();
  }
}

await browser.close();
