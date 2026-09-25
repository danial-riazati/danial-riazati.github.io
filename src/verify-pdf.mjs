/**
 * Reads Danial_Riazati_CV.pdf back and asserts the things that actually matter
 * to a recruiter and to an ATS: the text is extractable, the contact details
 * and key facts are present and correct, and the document is one or two pages.
 *
 *   node src/verify-pdf.mjs
 */
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { ROOT } from './lib/server.mjs';
import { site, person, contact, experience, education } from './data/profile.mjs';

// pdfjs-dist targets Node 22; these two are all it needs from the newer runtime
// for text extraction.
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

const FILE = path.join(ROOT, site.cvPdfFilename);

const data = new Uint8Array(await readFile(FILE));
const pdf = await getDocument({ data, useSystemFonts: false }).promise;
const meta = await pdf.getMetadata();

const pages = [];
const fonts = new Set();

for (let i = 1; i <= pdf.numPages; i += 1) {
  const page = await pdf.getPage(i);
  const content = await page.getTextContent();
  for (const item of content.items) if (item.fontName) fonts.add(item.fontName);
  // Preserve line ends, otherwise words either side of a wrap get glued
  // together and phrase matching gives false negatives.
  pages.push(content.items.map((item) => item.str + (item.hasEOL ? '\n' : '')).join(''));
}

const text = pages.join('\n').replace(/\s+/g, ' ');
const lower = text.toLowerCase();

/** Case-insensitive, because parts of the CV are set in uppercase by CSS. */
const has = (needle) => lower.includes(needle.toLowerCase());

/**
 * Heavy letter-spacing makes PDF extractors emit "E X P E R I E N C E".
 * An ATS reads the same text layer, so treat that as a failure.
 */
const glyphSplit = /(?:\b[A-Za-z] ){4,}[A-Za-z]\b/.exec(text)?.[0];

/**
 * A dropped ligature leaves a space where the glyph was, e.g. "Certi ed".
 * Look for a lower-case fragment ending in f/ff followed by a space and a
 * lower-case fragment — a shape that does not occur in ordinary English.
 */
const brokenByLigature = /\b[a-z]*f{1,2} (?:i|l|ed|le|nal|rm|st)\b/.exec(text)?.[0];

/* ---- Checks -------------------------------------------------------------- */

const checks = [
  ['Text layer is extractable (not an image)', text.length > 2500],
  ['Name', has(person.name)],
  ['Headline', has('Software Engineer') && has('Backend Engineer') && has('Full-Stack Engineer')],
  ['Location: Kiel, Germany', has('Kiel, Germany')],
  ['Phone', has(contact.phone.display)],
  ['Email', has(contact.email.display)],
  ['LinkedIn', has(contact.linkedin.display)],
  ['GitHub', has(contact.github.display)],
  ['Portfolio', has(contact.website.display)],
  ['5+ years claim', has('5+ years')],
  ['MSc at CAU', has('MSc Computer Science') && has('Christian-Albrechts')],
  ['BSc grade 17.27 / 20', has('GPA 17.27 / 20')],
  ['BSc dates', has('Sep 2019') && has('Aug 2024')],
  ['Eyvan role and dates', has('Eyvan Group') && has('Apr 2024') && has('Nov 2025')],
  ['Hasin role', has('Hasin Technology')],
  ['InfraFund role', has('InfraFund')],
  ['Certified Scrum Professional', has('Certified Scrum Professional')],
  ['JavaCup certification', has('JavaCup')],
  ['Thesis recognition', has('Best Thesis Project')],
  ['Thesis supervisor', has('Vahidi-Asl')],
  ['npm package name', has('@avan-persian/react')],
  ['Fonts embedded as subsets', fonts.size > 0],
  ['One or two pages', pdf.numPages <= 2],
  ['No placeholder text left behind', !/NEED USER INPUT|Lorem ipsum|TODO/i.test(text)],
  ['Section headings extract as words, not spaced glyphs', !glyphSplit],
  // A lost ligature shows up as a gap mid-word: "Certified" -> "Certi ed".
  ['No words broken by lost ligatures', !brokenByLigature],
  ['Certification name intact', has('Certified Scrum Professional')],
  ['Experience heading is parseable', has('PROFESSIONAL EXPERIENCE')],
  ['Education heading is parseable', has('EDUCATION')],
  ['Skills heading is parseable', has('TECHNICAL SKILLS')],
];

// Every role and school in the data model should appear in the document.
for (const role of experience) checks.push([`Role listed: ${role.company}`, has(role.company)]);
for (const school of education) {
  checks.push([`School listed: ${school.shortName}`, has(school.degree)]);
}

/* ---- Report -------------------------------------------------------------- */

const { size } = await stat(FILE);
console.log(`${site.cvPdfFilename} — ${(size / 1024).toFixed(0)} kB, ${pdf.numPages} page(s)`);
console.log(`Title:    ${meta.info.Title || '(none)'}`);
console.log(`Author:   ${meta.info.Author || '(none)'}`);
console.log(`Producer: ${meta.info.Producer || '(none)'}`);
console.log(`Fonts:    ${[...fonts].join(', ') || '(none)'}`);
console.log(`Words:    ${text.split(' ').length}\n`);

let failed = 0;
for (const [label, ok] of checks) {
  if (!ok) failed += 1;
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}`);
}

console.log(`\n${checks.length - failed}/${checks.length} checks passed.`);
process.exit(failed ? 1 : 0);
