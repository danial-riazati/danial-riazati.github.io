/**
 * Development helper: reports where the text sits on each page of the CV PDF,
 * so a page break can be diagnosed as "no room left" versus "a break rule
 * pushed it".
 *
 *   node src/inspect-pdf-pages.mjs
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { ROOT } from './lib/server.mjs';
import { site } from './data/profile.mjs';

Promise.withResolvers ??= function withResolvers() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
process.getBuiltinModule ??= (name) => createRequire(import.meta.url)(name);

const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');

const bytes = new Uint8Array(await readFile(path.join(ROOT, site.cvPdfFilename)));
const doc = await getDocument({ data: bytes }).promise;

for (let n = 1; n <= doc.numPages; n += 1) {
  const page = await doc.getPage(n);
  const [, , , pageHeight] = page.view;
  const content = await page.getTextContent();
  const ys = content.items.filter((i) => i.str.trim()).map((i) => i.transform[5]);
  const top = Math.max(...ys);
  const bottom = Math.min(...ys);

  const lines = content.items.map((i) => i.str + (i.hasEOL ? '\n' : '')).join('').split('\n');
  const first = lines.find((l) => l.trim());
  const last = [...lines].reverse().find((l) => l.trim());

  console.log(
    `page ${n}: height ${pageHeight}pt | top margin ${(pageHeight - top).toFixed(0)}pt | ` +
      `bottom gap ${bottom.toFixed(0)}pt`,
  );
  console.log(`  first: ${first.slice(0, 78)}`);
  console.log(`  last : ${last.slice(0, 78)}`);
}
