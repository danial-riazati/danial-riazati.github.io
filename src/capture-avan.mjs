/**
 * One-off: captures a screenshot of the live Avan date-picker demo so the
 * portfolio shows the real component rather than a mock-up.
 *
 *   node src/capture-avan.mjs
 */
import path from 'node:path';
import { ROOT } from './lib/server.mjs';
import { launch } from './lib/browser.mjs';

const URL = 'https://danialriazati.ir/avan-persian-date-picker/';
const OUT = path.join(ROOT, 'assets', 'avan-demo.png');

const browser = await launch();
const page = await browser.newPage();
await page.setViewport({ width: 1180, height: 900, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60_000 });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 1500));

// Frame the two-month range calendar — the component itself, not the demo
// page's headings.
const clip = await page.evaluate(() => {
  const grids = [...document.querySelectorAll('table, [role="grid"], [class*="calendar"]')];
  const widest = grids
    .map((node) => node.getBoundingClientRect())
    .filter((r) => r.width > 380 && r.height > 240)
    .sort((a, b) => b.width * b.height - a.width * a.height)[0];
  if (!widest) return null;
  const pad = 0;
  return {
    x: Math.max(0, widest.x - pad),
    y: Math.max(0, widest.y - pad),
    width: Math.min(document.documentElement.clientWidth, widest.width + pad * 2),
    height: widest.height + pad * 2,
  };
});

await page.screenshot({ path: OUT, ...(clip ? { clip } : {}) });
console.log(`wrote ${path.relative(ROOT, OUT)}`);

await browser.close();
