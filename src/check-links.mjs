/**
 * Checks every link in the built pages: internal paths must exist on disk,
 * external URLs must answer, and tel:/mailto: must match the verified contact
 * details in src/data/profile.mjs.
 *
 *   node src/check-links.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ROOT, resolveFile } from './lib/server.mjs';
import { contact, site, cvVariants } from './data/profile.mjs';

const PAGES = ['index.html', ...[cvVariants.general].map(({ path }) => `${path.slice(1)}index.html`)];

/**
 * Hosts that refuse automated requests to their public pages. A plain fetch
 * reports these as broken when they are not, so each is confirmed through an
 * endpoint that does answer.
 */
const VERIFY_VIA = {
  'www.linkedin.com': async (href) => {
    // LinkedIn answers HTTP 999 to anything that is not a browser. Nothing
    // machine-readable is exposed, so only the shape of the URL is checked.
    const ok = /^https:\/\/www\.linkedin\.com\/in\/[\w-]+\/$/.test(href);
    return { ok, note: ok ? '(LinkedIn blocks bots; URL shape checked)' : 'malformed profile URL' };
  },
  'www.npmjs.com': async (href) => {
    const pkg = decodeURIComponent(href.split('/package/')[1] ?? '');
    const response = await fetch(`https://registry.npmjs.org/${pkg.replace('/', '%2F')}`);
    if (!response.ok) return { ok: false, note: `not published (registry ${response.status})` };
    const { 'dist-tags': tags } = await response.json();
    return { ok: true, note: `(registry: ${pkg}@${tags?.latest})` };
  },
};

const links = new Map(); // href -> pages it appears on

for (const page of PAGES) {
  const html = await readFile(path.join(ROOT, page), 'utf8');
  for (const [, href] of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
    links.set(href, [...(links.get(href) ?? []), page]);
  }
}

const results = [];

for (const [href, pages] of [...links].sort()) {
  const where = pages.map((p) => `/${p}`).join(' ');

  if (href.startsWith('mailto:')) {
    const ok = href === `mailto:${contact.email.display}`;
    results.push([ok, href, ok ? '' : `expected mailto:${contact.email.display}`]);
  } else if (href.startsWith('tel:')) {
    const ok = href === contact.phone.href;
    results.push([ok, href, ok ? '' : `expected ${contact.phone.href}`]);
  } else if (href.startsWith(site.url) && (await resolveFile(href.slice(site.url.length) || '/'))) {
    // Canonical and og:url point at this site. Routes this build produces are
    // checked against the build, so a new page is not reported broken merely
    // because it has not shipped yet. Anything else under the domain — the
    // Avan demo is a separate Pages project site — falls through to a real
    // request below.
    results.push([true, href, '(self, checked against build)']);
  } else if (href.startsWith('http')) {
    const check = VERIFY_VIA[new URL(href).hostname];
    try {
      const { ok, note } = check
        ? await check(href)
        : await (async () => {
            // Some hosts reject HEAD, so fall back to a ranged GET.
            let response = await fetch(href, { method: 'HEAD', redirect: 'follow' });
            if (!response.ok) {
              response = await fetch(href, { headers: { range: 'bytes=0-0' }, redirect: 'follow' });
            }
            return { ok: response.ok, note: response.ok ? '' : `HTTP ${response.status}` };
          })();
      results.push([ok, href, note]);
    } catch (error) {
      results.push([false, href, error.cause?.code ?? error.message]);
    }
  } else if (href.startsWith('/')) {
    const file = await resolveFile(href);
    results.push([Boolean(file), href, file ? '' : `not found (on ${where})`]);
  } else {
    results.push([false, href, `relative link — breaks under /cv/ (on ${where})`]);
  }
}

for (const [ok, href, note] of results) {
  console.log(`  ${ok ? 'OK  ' : 'FAIL'}  ${href}${note ? `  — ${note}` : ''}`);
}

const failed = results.filter(([ok]) => !ok).length;
console.log(`\n${results.length - failed}/${results.length} links OK.`);
process.exitCode = failed ? 1 : 0;
