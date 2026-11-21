/**
 * Exports the public general CV and four local-only CV variants with headless Chrome.
 *
 * Chrome prints the same DOM the browser shows, driven by the print rules in
 * src/styles/cv.css, so the PDF can never drift from the page or from
 * src/data/profile.mjs. Text is emitted as real text with embedded font
 * subsets, so it stays selectable, copyable and machine-readable for an ATS.
 *
 *   node src/pdf.mjs
 */
import { cp, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

import { startServer, ROOT } from './lib/server.mjs';
import { cvPage } from './templates/cv.mjs';
import { layout } from './templates/layout.mjs';
import { launch } from './lib/browser.mjs';
import { cvVariants, person } from './data/profile.mjs';
import { resume } from './data/resume.mjs';

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
 * @param {{ variant?: object, content?: object, out?: string, pageRanges?: string }} [options]
 *   `pageRanges` is only used by src/pdf-preview.mjs to isolate single pages.
 */
export async function renderCvPdf({
  variant = cvVariants.general,
  content = resume,
  out = path.join(ROOT, variant === cvVariants.general ? variant.filename : `output/pdf/resumes/${variant.folderFilename}`),
  pageRanges = '',
} = {}) {
  await mkdir(path.dirname(out), { recursive: true });
  const server = await startServer();
  const browser = await launch();

  try {
    const page = await browser.newPage();
    // Establish the site's origin so private documents can load its fonts.
    await page.goto(`${server.origin}${cvVariants.general.path}`, { waitUntil: 'networkidle0' });
    if (variant !== cvVariants.general) {
      // Render private variants in memory using the same document template.
      const document = layout({
        title: `${person.name} — ${variant.label}`,
        description: variant.description,
        path: variant.path,
        styles: ['/styles/cv.css'],
        bodyClass: 'cv-body',
        noindex: true,
        body: cvPage(variant, content).toString(),
      });
      await page.setContent(document, {
        waitUntil: 'networkidle0',
      });
    }

    // @media print rules only apply once print emulation is enabled.
    await page.emulateMediaType('print');
    await page.evaluate((title) => {
      document.title = title;
      return document.fonts.ready;
    }, `${person.name} — ${variant.label}`);

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

export async function renderAllCvPdfs() {
  const folder = path.join(ROOT, 'output/pdf/resumes');
  await mkdir(folder, { recursive: true });
  for (const variant of Object.values(cvVariants)) {
    const file = await renderCvPdf({ variant });
    const info = await inspect(file);
    console.log(`${variant.filename}  ${(info.size / 1024).toFixed(0)} kB  ${info.pages} page(s)`);
    if (info.pages > 2) {
      throw new Error(`${variant.label} runs to ${info.pages} pages. Aim for one or two.`);
    }
    if (variant === cvVariants.general) {
      await cp(file, path.join(folder, variant.folderFilename));
    }
  }
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  renderAllCvPdfs().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
