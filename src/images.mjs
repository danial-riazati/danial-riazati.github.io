/**
 * Resizes and re-encodes the images the site actually uses, writing WebP
 * derivatives next to the originals. Chrome does the encoding, so there is no
 * native image dependency to install.
 *
 *   node src/images.mjs
 *
 * Output is committed; re-run only when the source images change.
 */
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { ROOT } from './lib/server.mjs';
import { launch } from './lib/browser.mjs';

/** [source, max width, quality] */
const TARGETS = [
  ['assets/profile.jpg', 760, 0.8],
  ['assets/eyvantrip-preview.png', 1500, 0.85],
  ['assets/perspectivedesign-preview.png', 1500, 0.85],
  ['assets/avan-demo.png', 1400, 0.9],
  ['assets/infrafund1.jpeg', 1300, 0.85],
  ['assets/pikicart1.png', 1100, 0.84],
  ['assets/classnegar1.png', 900, 0.88],
  ['assets/classnegar3.png', 1100, 0.86],
  ['assets/classnegar8.jpeg', 1100, 0.85],
];

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

const browser = await launch();
const page = await browser.newPage();
await page.goto('about:blank');

/** path -> intrinsic size, so templates can always emit width/height. */
const manifest = {};

for (const [relative, maxWidth, quality] of TARGETS) {
  const source = path.join(ROOT, relative);
  const buffer = await readFile(source);
  const dataUrl = `data:${MIME[path.extname(relative)]};base64,${buffer.toString('base64')}`;

  const encoded = await page.evaluate(
    async (url, width, q) => {
      const img = new Image();
      img.src = url;
      await img.decode();

      const scale = Math.min(1, width / img.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);

      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      return {
        data: canvas.toDataURL('image/webp', q).split(',')[1],
        width: canvas.width,
        height: canvas.height,
      };
    },
    dataUrl,
    maxWidth,
    quality,
  );

  const target = source.replace(/\.(png|jpe?g)$/i, '.webp');
  await writeFile(target, Buffer.from(encoded.data, 'base64'));

  manifest[`/${path.relative(ROOT, target)}`] = { width: encoded.width, height: encoded.height };

  const before = (await stat(source)).size;
  const after = (await stat(target)).size;
  console.log(
    `${path.relative(ROOT, target).padEnd(42)} ${String(encoded.width).padStart(5)}px  ` +
      `${kb(before).padStart(8)} -> ${kb(after).padStart(8)}`,
  );
}

await writeFile(
  path.join(ROOT, 'src', 'data', 'images.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

await browser.close();
