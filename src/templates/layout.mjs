import { html, raw } from '../lib/html.mjs';
import { site, person, contact, experience, education, skills, certifications } from '../data/profile.mjs';

/** Person + related entities, used by search engines and LLM-backed search. */
export function personJsonLd() {
  const employer = experience[0];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${site.url}/#person`,
        name: person.name,
        givenName: person.givenName,
        familyName: person.familyName,
        jobTitle: person.roles,
        description: person.summary,
        url: site.url,
        image: `${site.url}${person.photo.src}`,
        email: contact.email.href.replace('mailto:', 'mailto:'),
        telephone: contact.phone.display,
        address: {
          '@type': 'PostalAddress',
          addressLocality: person.location.city,
          addressRegion: person.location.region,
          addressCountry: 'DE',
        },
        homeLocation: {
          '@type': 'Place',
          name: person.location.label,
          address: {
            '@type': 'PostalAddress',
            addressLocality: person.location.city,
            addressCountry: 'DE',
          },
        },
        knowsLanguage: [
          { '@type': 'Language', name: 'English' },
          { '@type': 'Language', name: 'Persian' },
        ],
        knowsAbout: skills.flatMap((group) => group.items),
        alumniOf: education
          .filter((e) => !e.current)
          .map((e) => ({
            '@type': 'CollegeOrUniversity',
            name: e.institution,
            address: { '@type': 'PostalAddress', addressLocality: e.location },
          })),
        affiliation: {
          '@type': 'CollegeOrUniversity',
          name: 'Christian-Albrechts-Universität zu Kiel',
          sameAs: 'https://www.uni-kiel.de/',
        },
        worksFor: {
          '@type': 'Organization',
          name: employer.company,
          url: employer.url,
        },
        hasCredential: certifications.map((c) => ({
          '@type': 'EducationalOccupationalCredential',
          name: c.name,
          recognizedBy: { '@type': 'Organization', name: c.issuer },
        })),
        seeks: {
          '@type': 'Demand',
          name: 'Software engineering roles in Germany',
        },
        sameAs: [contact.linkedin.href, contact.github.href, contact.website.href],
      },
      {
        '@type': 'WebSite',
        '@id': `${site.url}/#website`,
        url: site.url,
        name: `${person.name} — Software Engineer`,
        inLanguage: 'en',
        publisher: { '@id': `${site.url}/#person` },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}/#profilepage`,
        url: site.url,
        name: site.title,
        isPartOf: { '@id': `${site.url}/#website` },
        about: { '@id': `${site.url}/#person` },
        primaryImageOfPage: `${site.url}${site.ogImage}`,
      },
    ],
  };
}

/**
 * @param {object} options
 * @param {string} options.title
 * @param {string} options.description
 * @param {string} options.path      Canonical path, e.g. '/' or '/cv/'
 * @param {string[]} options.styles  Stylesheet URLs
 * @param {import('../lib/html.mjs').Raw} options.body
 * @param {string} [options.script]  Deferred script URL
 * @param {object} [options.jsonLd]
 * @param {boolean} [options.noindex]
 * @param {string} [options.bodyClass]
 */
export function layout({
  title,
  description,
  path,
  styles,
  body,
  script,
  jsonLd,
  noindex = false,
  bodyClass = '',
}) {
  const canonical = `${site.url}${path}`;

  return `<!doctype html>
<html lang="en" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">'}
<meta name="author" content="${person.name}">
<meta name="theme-color" content="#fbfaf8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#131318" media="(prefers-color-scheme: dark)">
<meta name="color-scheme" content="light">

<meta property="og:type" content="profile">
<meta property="og:site_name" content="${person.name}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="en_GB">
<meta property="og:image" content="${site.url}${site.ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${person.name} — Software Engineer, Kiel, Germany">
<meta property="profile:first_name" content="${person.givenName}">
<meta property="profile:last_name" content="${person.familyName}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${description}">
<meta name="twitter:image" content="${site.url}${site.ogImage}">

<meta name="google-site-verification" content="${site.googleVerification}">

<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/logo.png" sizes="any">
<link rel="apple-touch-icon" href="/assets/logo.png">

<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/instrument-sans-normal-400-700-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/assets/fonts/jetbrains-mono-normal-400-600-latin.woff2" crossorigin>
${styles.map((href) => `<link rel="stylesheet" href="${href}">`).join('\n')}

<script>document.documentElement.classList.remove('no-js');</script>
${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${body}
${script ? `<script src="${script}" defer></script>` : ''}
</body>
</html>
`;
}

export { raw, html };
