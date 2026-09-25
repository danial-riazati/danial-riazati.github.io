/**
 * Development helper: reports how the CV fills its A4 pages.
 *
 * The page box, not the browser window, decides where text wraps, so the
 * viewport is set to the printable width (A4 minus the @page margins) before
 * measuring. Measuring at any other width understates the height.
 *
 *   node src/measure-cv.mjs
 */
import { startServer } from './lib/server.mjs';
import { launch } from './lib/browser.mjs';

const MM_PER_IN = 25.4;
const PAGE = { width: 210, height: 297, marginX: 15, marginY: 13 };

const printableMm = { w: PAGE.width - PAGE.marginX * 2, h: PAGE.height - PAGE.marginY * 2 };
const viewportPx = Math.round((printableMm.w / MM_PER_IN) * 96);
const pagePt = (printableMm.h / MM_PER_IN) * 72;

const server = await startServer();
const browser = await launch();

try {
  const page = await browser.newPage();
  await page.setViewport({ width: viewportPx, height: 1200 });
  await page.goto(`${server.origin}/cv/`, { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  await page.evaluate(() => document.fonts.ready);

  const report = await page.evaluate(() => {
    const cv = document.querySelector('.cv');
    const base = cv.getBoundingClientRect().top;
    const toPt = (px) => (px * 72) / 96;
    const selector = '.cv-header, .cv-section, .cv-entry, .cv-skills > div, .cv-certs li';

    return {
      widthPx: cv.getBoundingClientRect().width,
      totalPt: toPt(cv.getBoundingClientRect().height),
      blocks: [...cv.querySelectorAll(selector)].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          kind: el.className.split(' ')[0] || 'row',
          topPt: toPt(r.top - base),
          heightPt: toPt(r.height),
          label: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 46),
        };
      }),
    };
  });

  const pages = report.totalPt / pagePt;
  console.log(
    `printable ${printableMm.w}x${printableMm.h}mm  (${viewportPx}px wide, ${pagePt.toFixed(0)}pt tall)`,
  );
  console.log(`layout width: ${report.widthPx.toFixed(0)}px`);
  console.log(`content: ${report.totalPt.toFixed(0)}pt = ${pages.toFixed(2)} pages`);
  console.log(`budget for 2 pages: ${(pagePt * 2).toFixed(0)}pt ` +
    `(${(pagePt * 2 - report.totalPt).toFixed(0)}pt spare)\n`);

  for (const block of report.blocks) {
    if (block.kind === 'cv-section' || block.kind === 'cv-header') {
      console.log(
        `${block.heightPt.toFixed(0).padStart(5)}pt  ${block.kind.padEnd(11)}  ${block.label}`,
      );
    }
  }
} finally {
  await browser.close();
  await server.close();
}
