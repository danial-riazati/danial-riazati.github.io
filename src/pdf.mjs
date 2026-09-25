/**
 * Renders /cv/ to Danial_Riazati_CV.pdf with headless Chrome.
 *
 * Chrome prints the same DOM the browser shows, driven by the print rules in
 * src/styles/cv.css, so the PDF can never drift from the page or from
 * src/data/profile.mjs. Text is emitted as real text with embedded font
 * subsets, so it stays selectable, copyable and machine-readable for an ATS.
 *
 *   node src/pdf.mjs
 */
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { startServer, ROOT } from './lib/server.mjs';
import { launch } from './lib/browser.mjs';
import { site, person } from './data/profile.mjs';

const OUT = path.join(ROOT, site.cvPdfFilename);

/** Chrome takes the PDF's /Title from document.title at print time. */
const PDF_TITLE = `${person.name} — Curriculum Vitae`;

/**
 * Chrome writes page objects uncompressed, so counting them is reliable.
 * Everything else about the file — metadata, fonts, extracted text — is
 * checked properly by src/verify-pdf.mjs, which parses the PDF.
 */
async function inspect(file) {
  const text = (await readFile(file)).toString('latin1');
  return {
    size: (await stat(file)).size,
    pages: text.match(/\/Type\s*\/Page[^s]/g)?.length ?? 0,
  };
}

/**
 * @param {{ out?: string, pageRanges?: string }} [options]
 *   `pageRanges` is only used by src/pdf-preview.mjs to isolate single pages.
 */
export async function renderCvPdf({ out = OUT, pageRanges = '' } = {}) {
  const server = await startServer();
  const browser = await launch();

  try {
    const page = await browser.newPage();
    await page.goto(`${server.origin}/cv/`, { waitUntil: 'networkidle0' });

    // @media print rules only apply once print emulation is enabled.
    await page.emulateMediaType('print');
    await page.evaluate((title) => {
      document.title = title;
      return document.fonts.ready;
    }, PDF_TITLE);

    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true,
      outline: false,
      pageRanges,
    });
  } finally {
    await browser.close();
    await server.close();
  }

  return out;
}

async function main() {
  await renderCvPdf();

  const info = await inspect(OUT);
  console.log(`${site.cvPdfFilename}  ${(info.size / 1024).toFixed(0)} kB  ${info.pages} page(s)`);

  if (info.pages > 2) {
    console.warn(`Warning: the CV runs to ${info.pages} pages. Aim for one or two.`);
  }
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
