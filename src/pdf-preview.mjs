/**
 * Development helper: rasterises the CV PDF, one PNG per page, into .preview/
 * so the printed document can be reviewed as a document rather than inferred
 * from the HTML it was printed from.
 *
 * Each page is printed to its own PDF and rendered by Quick Look, which is the
 * same PDF engine Preview and macOS use — a genuinely independent reader
 * rather than the browser that produced the file.
 *
 *   node src/pdf-preview.mjs
 */
import { execFile } from 'node:child_process';
import { mkdir, readFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { ROOT } from './lib/server.mjs';
import { renderCvPdf } from './pdf.mjs';
import { site } from './data/profile.mjs';

const run = promisify(execFile);
const OUT_DIR = path.join(ROOT, '.preview');
const WIDTH = 1654; // A4 at 200 dpi.

const pdfBytes = await readFile(path.join(ROOT, site.cvPdfFilename));
const pageCount = pdfBytes.toString('latin1').match(/\/Type\s*\/Page[^s]/g)?.length ?? 0;

await mkdir(OUT_DIR, { recursive: true });

for (let n = 1; n <= pageCount; n += 1) {
  const singlePage = path.join(OUT_DIR, `cv-pdf-page-${n}.pdf`);
  await renderCvPdf({ out: singlePage, pageRanges: String(n) });

  await run('qlmanage', ['-t', '-s', String(WIDTH), '-o', OUT_DIR, singlePage]);
  await rename(`${singlePage}.png`, path.join(OUT_DIR, `cv-pdf-page-${n}.png`));
  await rm(singlePage);

  console.log(path.relative(ROOT, path.join(OUT_DIR, `cv-pdf-page-${n}.png`)));
}
