/**
 * Renders the social preview card (assets/og-image.png, 1200x630) with headless
 * Chrome, from the same tokens, fonts and data as the site — so a shared link
 * looks like the page it points at, and the card can never state something the
 * profile data does not.
 *
 *   node src/og.mjs
 */
import path from 'node:path';

import { ROOT, startServer } from './lib/server.mjs';
import { launch } from './lib/browser.mjs';
import { person, contact } from './data/profile.mjs';

const OUT = path.join(ROOT, 'assets', 'og-image.png');
const SIZE = { width: 1200, height: 630 };

const card = /* html */ `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="/styles/fonts.css">
<link rel="stylesheet" href="/styles/tokens.css">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: ${SIZE.width}px; height: ${SIZE.height}px;
    display: grid; grid-template-columns: 1fr auto; align-items: end;
    gap: 64px; padding: 72px;
    background: #f9faf8; color: #18271f;
    --accent: #2d5b4b;
    font-family: var(--sans); font-synthesis: none;
    -webkit-font-smoothing: antialiased;
  }
  .rule { height: 1px; background: var(--line); margin: 28px 0; }
  .eyebrow {
    font-family: var(--mono); font-size: 19px; font-weight: 600;
    letter-spacing: 0.04em; text-transform: uppercase; color: var(--accent);
  }
  h1 {
    font-size: 104px; line-height: 0.9; letter-spacing: -0.045em;
    font-weight: 600; margin-top: 26px;
  }
  .meta { display: flex; gap: 28px; font-size: 22px; color: var(--muted); }
  .meta b { color: var(--ink); font-weight: 600; }
  .site { font-family: var(--mono); font-size: 20px; color: var(--ink); }

  /* The portrait is the real photograph used on the site; nothing here is
     generated or decorative stock imagery. */
  figure { position: relative; width: 300px; height: 380px; }
  figure img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 28%; border-radius: 5px; }
  figure::before, figure::after {
    content: ''; position: absolute; width: 22px; height: 22px;
  }
  figure::before {
    top: -9px; left: -9px;
    border-top: 2px solid var(--accent); border-left: 2px solid var(--accent);
  }
  figure::after {
    bottom: -9px; right: -9px;
    border-bottom: 2px solid var(--accent); border-right: 2px solid var(--accent);
  }
</style>
</head>
<body>
  <div>
    <p class="eyebrow">Backend Architecture · .NET · Python · AI</p>
    <h1>${person.name}</h1>
    <div class="rule"></div>
    <div class="meta">
      <span><b>5+ years</b> building production systems</span>
      <span>·</span>
      <span>Based in <b>${person.location.label}</b></span>
    </div>
    <div class="rule"></div>
    <p class="site">${contact.website.display}</p>
  </div>
  <figure><img src="${person.photo.src}" alt=""></figure>
</body>
</html>`;

const server = await startServer();
const browser = await launch();

try {
  const page = await browser.newPage();
  await page.setViewport({ ...SIZE, deviceScaleFactor: 1 });

  // Served from the site origin so the stylesheets, fonts and portrait resolve
  // by the same absolute paths the pages use.
  await page.goto(`${server.origin}/`, { waitUntil: 'domcontentloaded' });
  await page.setContent(card, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);

  await page.screenshot({ path: OUT, type: 'png' });
  console.log(path.relative(ROOT, OUT));
} finally {
  await browser.close();
  await server.close();
}
