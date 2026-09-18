import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.argv[2] ?? ".qa-screenshots";

const VIEWPORTS = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "390", width: 390, height: 844 },
  { name: "375", width: 375, height: 812 },
];

const PAGES = [
  { path: "/", slug: "home" },
  { path: "/work/yemo", slug: "yemo" },
  { path: "/wordpress", slug: "wp" },
  { path: "/about", slug: "about" },
  { path: "/contact", slug: "contact" },
];

const browser = await chromium.launch();
const problems = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();

  for (const p of PAGES) {
    await page.goto(BASE + p.path, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    // Reveal animations are viewport-triggered; scroll the whole page so
    // everything is painted before measuring or shooting.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.8;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 500));
    });

    const metrics = await page.evaluate(() => {
      const de = document.documentElement;
      const overflow = de.scrollWidth - de.clientWidth;

      // Find the specific elements sticking out past the viewport.
      const offenders = [];
      if (overflow > 1) {
        for (const el of document.querySelectorAll("body *")) {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          if (r.right > de.clientWidth + 1 || r.left < -1) {
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className || "").toString().slice(0, 70),
              left: Math.round(r.left),
              right: Math.round(r.right),
            });
          }
          if (offenders.length >= 5) break;
        }
      }
      const h1 = document.querySelector('#hero-heading');
      const heroLines = h1 ? h1.getClientRects().length : null;
      return { overflow, offenders, heroLines, scrollW: de.scrollWidth, clientW: de.clientWidth };
    });

    if (metrics.overflow > 1) {
      problems.push({ vp: vp.name, path: p.path, ...metrics });
    }

    if (p.path === "/" && metrics.heroLines) {
      console.log(`  hero h1 lines @${vp.name}px: ${metrics.heroLines}`);
    }

    if (["1440", "390"].includes(vp.name)) {
      await page.screenshot({
        path: `${OUT}/${p.slug}-${vp.name}.png`,
        fullPage: false,
      });
    }
  }
  await ctx.close();
}

await browser.close();

if (problems.length === 0) {
  console.log("NO HORIZONTAL OVERFLOW at any breakpoint");
} else {
  console.log("OVERFLOW FOUND:");
  for (const p of problems) {
    console.log(
      `  ${p.vp}px ${p.path} — scrollW=${p.scrollW} clientW=${p.clientW} (+${p.overflow})`,
    );
    for (const o of p.offenders) {
      console.log(`      <${o.tag} class="${o.cls}"> left=${o.left} right=${o.right}`);
    }
  }
}
