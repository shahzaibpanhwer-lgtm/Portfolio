/**
 * Captures section and mobile screenshots of the live project sites.
 *
 * Covers are captured separately by capture-covers.mjs; this fills the
 * case-study galleries. Existing cover.jpg files are never touched, so a
 * hand-picked cover cannot be overwritten by a re-run.
 *
 *   node scripts/capture-sections.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TARGETS = [
  { url: "https://parix.ai/", dir: "public/work/parix", sections: 3 },
  { url: "https://drgmpanhwarinstitute.org/", dir: "public/wordpress/drgm", sections: 2 },
  { url: "https://www.itmen.pk/", dir: "public/wordpress/itmen", sections: 2 },
  { url: "https://discountled.us/", dir: "public/wordpress/discountled", sections: 2 },
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36";

/** Consent banners and announcement modals ruin a capture — clear them. */
async function clearOverlays(page) {
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(250);

  for (const name of [/accept/i, /agree/i, /got it/i, /allow all/i, /^close$/i, /dismiss/i, /no thanks/i]) {
    const btn = page.getByRole("button", { name }).first();
    if (await btn.isVisible().catch(() => false)) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(300);
    }
  }
  for (const sel of ['[aria-label*="close" i]', '[title*="close" i]', ".popup-close", ".mfp-close", ".eael-popup-close-button"]) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 1500 }).catch(() => {});
      await page.waitForTimeout(250);
    }
  }
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" || cs.display === "none") continue;
      const r = el.getBoundingClientRect();
      const big = r.width > innerWidth * 0.5 && r.height > innerHeight * 0.5;
      if (big && Number(cs.zIndex || 0) > 100) {
        el.style.setProperty("display", "none", "important");
      }
    }
    document.body.style.overflow = "auto";
  });
}

/**
 * Rough measure of how much of the viewport is actually covered by
 * content at a given scroll position. A section boundary can land on
 * whitespace between blocks, which produces a blank screenshot — this
 * lets those offsets be rejected instead of shipped.
 */
async function densityAt(page, y) {
  return page.evaluate((top) => {
    scrollTo({ top, behavior: "instant" });
    const vh = innerHeight;
    const vw = innerWidth;
    let covered = 0;
    for (const el of document.querySelectorAll(
      "h1,h2,h3,h4,p,img,video,li,button,a,table,figure",
    )) {
      const r = el.getBoundingClientRect();
      if (r.bottom <= 0 || r.top >= vh) continue;
      if (r.width < 10 || r.height < 10) continue;
      const h = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const w = Math.min(r.width, vw);
      covered += (h * w) / (vh * vw);
    }
    return covered;
  }, y);
}

/** Trigger lazy-loaded media, then settle back at the top. */
async function primeLazyMedia(page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.75;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 220));
    }
    scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 500));
  });
}

/** Optional arg filters targets by directory substring. */
const only = process.argv[2];
const RUN = only ? TARGETS.filter((t) => t.dir.includes(only)) : TARGETS;

/** These sites are slow; one retry beats a missing screenshot. */
async function gotoWithRetry(page, url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
      return;
    } catch (err) {
      if (attempt === 2) throw err;
      await page.waitForTimeout(2000);
    }
  }
}

const browser = await chromium.launch();

/* A large empty container still reports area, so DOM measurement alone
   lets a blank frame through. Measure the captured pixels instead. */
const analyzerCtx = await browser.newContext();
const analyzer = await analyzerCtx.newPage();
await analyzer.setContent("<canvas id=c></canvas>");

async function pixelVariance(buffer) {
  return analyzer.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${b64}`;
    await img.decode();
    const c = document.getElementById("c");
    c.width = 160;
    c.height = 100;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, 160, 100);
    const { data } = ctx.getImageData(0, 0, 160, 100);
    const lum = [];
    for (let i = 0; i < data.length; i += 4) {
      lum.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    }
    const mean = lum.reduce((a, b) => a + b, 0) / lum.length;
    const varr = lum.reduce((a, b) => a + (b - mean) ** 2, 0) / lum.length;
    return Math.sqrt(varr);
  }, buffer.toString("base64"));
}

for (const t of RUN) {
  await mkdir(t.dir, { recursive: true });

  /* ---------- desktop sections ---------- */
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    userAgent: UA,
  });
  const page = await desktop.newPage();

  try {
    await gotoWithRetry(page, t.url);
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await clearOverlays(page);
    await primeLazyMedia(page);
    await clearOverlays(page);

    /* Snap to real section boundaries. Stepping a fixed viewport at a
       time lands mid-section and clips headings off the top, which makes
       a screenshot look like a mistake rather than a chosen frame. */
    const offsets = await page.evaluate(() => {
      const seen = new Set();
      const tops = [];
      const candidates = document.querySelectorAll(
        'section, [class*="section"], main > div, body > div > div',
      );
      for (const el of candidates) {
        const r = el.getBoundingClientRect();
        if (r.height < 420 || r.width < innerWidth * 0.6) continue;
        const top = Math.round(r.top + scrollY);
        if (top < 400) continue;
        // collapse near-duplicates from nested wrappers
        if (tops.some((t) => Math.abs(t - top) < 250)) continue;
        if (top + 200 > document.body.scrollHeight - innerHeight) continue;
        if (seen.has(top)) continue;
        seen.add(top);
        tops.push(top);
      }
      return tops.sort((a, b) => a - b);
    });

    const total = await page.evaluate(() => document.body.scrollHeight);

    /* Drop offsets that sit on whitespace, then spread the picks across
       what remains so the shots are not all from the same third. */
    const scored = [];
    for (const y of offsets) {
      const d = await densityAt(page, y);
      if (d >= 0.45) scored.push(y);
    }
    const usable = scored.length ? scored : offsets;

    const taken = new Set();

    for (let i = 1; i <= t.sections; i++) {
      const startIdx =
        usable.length >= t.sections
          ? Math.floor(((i - 1) / t.sections) * usable.length)
          : Math.min(i - 1, Math.max(0, usable.length - 1));

      /* Walk forward from the ideal offset until the frame is not blank
         and is not one already used. */
      let chosen = null;
      let buf = null;
      for (let k = 0; k < Math.max(usable.length, 1); k++) {
        const idx = (startIdx + k) % Math.max(usable.length, 1);
        let y = usable.length ? usable[idx] : 900 * i;
        y = Math.min(y, Math.max(0, total - 900));
        if (taken.has(y)) continue;

        await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(850);
        const candidate = await page.screenshot({ type: "jpeg", quality: 84 });
        const variance = await pixelVariance(candidate);

        if (variance >= 14) {
          chosen = y;
          buf = candidate;
          break;
        }
      }

      if (chosen === null) {
        console.log(`  skip ${t.dir} section-${i} — no non-blank frame found`);
        continue;
      }

      taken.add(chosen);
      const out = path.join(t.dir, `section-${i}.jpg`);
      await writeFile(out, buf);
      console.log(`  ok   ${out}  @${chosen}px`);
    }
  } catch (err) {
    console.log(`  FAIL ${t.dir} desktop — ${err.message.split("\n")[0]}`);
  }
  await desktop.close();

  /* ---------- mobile ---------- */
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const mpage = await mobile.newPage();

  try {
    await gotoWithRetry(mpage, t.url);
    await mpage.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await clearOverlays(mpage);
    await primeLazyMedia(mpage);
    await clearOverlays(mpage);

    /* Some mobile heroes are mostly empty space above the fold; step down
       until the frame actually carries content. */
    let my = 0;
    for (const candidate of [0, 320, 640, 960, 1280]) {
      const d = await densityAt(mpage, candidate);
      my = candidate;
      if (d >= 0.30) break;
    }
    let mbuf = null;
    for (const candidate of [my, 320, 640, 960, 1280, 1600, 0]) {
      await mpage.evaluate((top) => scrollTo({ top, behavior: "instant" }), candidate);
      await mpage.waitForTimeout(700);
      const shot = await mpage.screenshot({ type: "jpeg", quality: 84 });
      if ((await pixelVariance(shot)) >= 26) {
        my = candidate;
        mbuf = shot;
        break;
      }
    }

    const out = path.join(t.dir, "mobile.jpg");
    await writeFile(out, mbuf ?? (await mpage.screenshot({ type: "jpeg", quality: 84 })));
    console.log(`  ok   ${out}  @${my}px`);
  } catch (err) {
    console.log(`  FAIL ${t.dir} mobile — ${err.message.split("\n")[0]}`);
  }
  await mobile.close();
}

await analyzerCtx.close();
await browser.close();
