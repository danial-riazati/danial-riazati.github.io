/**
 * Static build. Renders the data model into the files GitHub Pages serves
 * from the repository root, so the existing Pages configuration keeps working
 * without a CI step.
 */
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { layout, personJsonLd } from './templates/layout.mjs';
import { homeBody } from './templates/home.mjs';
import { cvPage } from './templates/cv.mjs';
import { site, person, contact, cvVariants } from './data/profile.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = (...segments) => path.join(root, ...segments);

const written = [];

async function write(relativePath, contents) {
  const target = out(relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  const output = relativePath.endsWith('.html') ? contents.replace(/^[ \t]+$/gm, '') : contents;
  await writeFile(target, output);
  written.push([relativePath, Buffer.byteLength(output)]);
}

/* -------------------------------------------------------------------------- */

async function buildPages() {
  await write(
    'index.html',
    layout({
      title: site.title,
      description: site.description,
      path: '/',
      styles: ['/styles/site.css'],
      script: '/scripts/site.js',
      jsonLd: personJsonLd(),
      body: homeBody().toString(),
    }),
  );

  // Retire earlier public exports of the local-only CV variants.
  for (const variant of Object.values(cvVariants).filter(item => item !== cvVariants.general)) {
    await rm(out(variant.path.slice(1), 'index.html'), { force: true });
    await rm(out(variant.filename), { force: true });
  }

  for (const variant of [cvVariants.general]) {
    const title = `${variant.label} — ${person.name} · ${variant.headline}`;
    await write(
      `${variant.path.slice(1)}index.html`,
      layout({
        title,
        description: variant.description,
        path: variant.path,
        styles: ['/styles/cv.css'],
        script: '/scripts/site.js',
        bodyClass: 'cv-body',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: title,
          description: variant.summary,
          url: `${site.url}${variant.path}`,
          about: { '@id': `${site.url}/#person` },
          mainEntity: { '@id': `${site.url}/#person` },
        },
        body: cvPage(variant).toString(),
      }),
    );
  }
}

/* -------------------------------------------------------------------------- */

async function copyStatic() {
  for (const dir of ['styles', 'scripts']) {
    await rm(out(dir), { recursive: true, force: true });
    await cp(out('src', dir), out(dir), { recursive: true });
    for (const file of await readdir(out(dir))) {
      const { size } = await stat(out(dir, file));
      written.push([`${dir}/${file}`, size]);
    }
  }
}

/* -------------------------------------------------------------------------- */

async function buildMeta() {
  const routes = [
    { loc: '/', priority: '1.0', changefreq: 'monthly' },
    ...[cvVariants.general].map(({ path }) => ({ loc: path, priority: '0.9', changefreq: 'monthly' })),
  ];
  const today = new Date().toISOString().slice(0, 10);

  await write(
    'sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) =>
      `  <url>\n    <loc>${site.url}${route.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`,
  );

  await write(
    'robots.txt',
    `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
  );

  // Disable Jekyll so GitHub Pages serves the generated files verbatim.
  await write('.nojekyll', '');

  await write(
    'assets/favicon.svg',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#14151a"/>
  <path d="M14 17h13.4c9.9 0 16.3 5.8 16.3 15s-6.4 15-16.3 15H14zm9.1 7.6v14.8h4c5 0 8.2-2.8 8.2-7.4s-3.2-7.4-8.2-7.4z" fill="#fbfaf8"/>
  <rect x="44" y="40" width="7" height="7" fill="#bf3b12"/>
</svg>
`,
  );

  // Keep the vCard next to the CV so a recruiter can save the contact in one tap.
  await write(
    'assets/danial-riazati.vcf',
    [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${person.familyName};${person.givenName};;;`,
      `FN:${person.name}`,
      'TITLE:Software Engineer',
      `TEL;TYPE=CELL:${contact.phone.display.replace(/\s/g, '')}`,
      `EMAIL;TYPE=INTERNET:${contact.email.display}`,
      `ADR;TYPE=HOME:;;;${person.location.city};${person.location.region};;Germany`,
      `URL:${contact.website.href}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${contact.linkedin.href}`,
      `X-SOCIALPROFILE;TYPE=github:${contact.github.href}`,
      'END:VCARD',
      '',
    ].join('\r\n'),
  );
}

/* -------------------------------------------------------------------------- */

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

async function main() {
  await buildPages();
  await copyStatic();
  await buildMeta();

  const width = Math.max(...written.map(([name]) => name.length));
  console.log('Build output:');
  for (const [name, size] of written.sort((a, b) => a[0].localeCompare(b[0]))) {
    console.log(`  ${name.padEnd(width)}  ${kb(size).padStart(9)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
