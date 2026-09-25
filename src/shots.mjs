/**
 * Development helper: renders the built site at the breakpoints listed below
 * and writes screenshots to .preview/ for visual review. Not part of the site.
 *
 *   node src/shots.mjs [--full] [--sections] [path ...]
 *
 * Env: VIEWPORTS=1440,390 to narrow the set.
 */
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { startServer, ROOT } from './lib/server.mjs';
import { launch } from './lib/browser.mjs';

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '1280', width: 1280, height: 800 },
  { name: '768', width: 768, height: 1024 },
  { name: '390', width: 390, height: 844 },
  { name: '320', width: 320, height: 800 },
];

const args = process.argv.slice(2);
const fullPage = args.includes('--full');
const bySection = args.includes('--sections');
const routes = args.filter((a) => !a.startsWith('--'));
const targets = routes.length ? routes : ['/'];
const only = process.env.VIEWPORTS?.split(',');

const outDir = path.join(ROOT, '.preview');

const server = await startServer();
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await launch();

for (const route of targets) {
  for (const viewport of VIEWPORTS) {
    if (only && !only.includes(viewport.name)) continue;

    const page = await browser.newPage();
    await page.setViewport({ ...viewport, deviceScaleFactor: 2 });
    await page.goto(`${server.origin}${route}`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    // Settle the page: finish reveals and force lazy images so that captures
    // taken below the fold are not full of empty frames.
    await page.evaluate(async () => {
      document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      const images = [...document.images];
      images.forEach((img) => {
        img.loading = 'eager';
        if (!img.complete) img.src = img.src;
      });
      await Promise.all(
        images.map((img) =>
          img.complete ? null : new Promise((r) => img.addEventListener('load', r, { once: true })),
        ),
      );
      // Decoding matters as much as loading: Chrome will not paint an image
      // that is far below the fold until it has been decoded.
      await Promise.all(images.map((img) => img.decode().catch(() => {})));
    });
    await new Promise((r) => setTimeout(r, 600));

    const slug = route.replace(/\W+/g, '') || 'home';

    // Horizontal overflow is invisible in a screenshot but obvious on a phone,
    // so report the elements responsible rather than just the symptom.
    const overflow = await page.evaluate(() => {
      const limit = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= limit) return null;
      const culprits = [...document.body.querySelectorAll('*')]
        .filter((el) => el.getBoundingClientRect().right > limit + 1)
        .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`);
      return { width: document.documentElement.scrollWidth, limit, culprits: [...new Set(culprits)] };
    });

    if (overflow) {
      console.warn(
        `  overflow at ${viewport.name}: ${overflow.width}px > ${overflow.limit}px — ` +
          overflow.culprits.slice(0, 6).join(', '),
      );
    }

    if (bySection) {
      // One image per section keeps each screenshot legible on a long page.
      const handles = await page.$$(process.env.SELECTOR ?? 'main > section');
      for (const [i, handle] of handles.entries()) {
        const id = (await handle.evaluate((node) => node.id)) || `section-${i}`;
        const file = path.join(outDir, `${slug}-${viewport.name}-${String(i).padStart(2, '0')}-${id}.png`);
        await handle.screenshot({ path: file });
        console.log(path.relative(ROOT, file));
      }
    } else {
      const file = path.join(outDir, `${slug}-${viewport.name}${fullPage ? '-full' : ''}.png`);
      await page.screenshot({ path: file, fullPage });
      console.log(path.relative(ROOT, file));
    }

    await page.close();
  }
}

await browser.close();
await server.close();
