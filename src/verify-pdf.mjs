/**
 * Reads all five generated CV PDFs back and asserts the things that actually matter
 * to a recruiter and to an ATS: the text is extractable, the contact details
 * and key facts are present and correct, and the document is one or two pages.
 *
 *   node src/verify-pdf.mjs
 */
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import { ROOT } from './lib/server.mjs';
import { resume, prioritise } from './data/resume.mjs';
import { cvVariants, person, contact, experience, education, languages } from './data/profile.mjs';

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

async function verify(variant) {
  const FILE = path.join(ROOT, variant.filename);

  const sourceBytes = await readFile(FILE);
  const data = new Uint8Array(sourceBytes);
  const document = getDocument({ data, useSystemFonts: false });
  const pdf = await document.promise;
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
    ['Headline', has(variant.headline)],
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
    ['npm package name', has('@avan-persian/react')],
    ['Fonts embedded as subsets', fonts.size > 0],
    ['One or two A4 pages', pdf.numPages <= 2 && (await Promise.all(
      pages.map(async (_, i) => {
        const { width, height } = (await pdf.getPage(i + 1)).getViewport({ scale: 1 });
        return Math.abs(width - 595.28) < 2 && Math.abs(height - 841.89) < 2;
      }),
    )).every(Boolean)],
    ['Education and experience order', (lower.indexOf('education') < lower.indexOf('professional experience')) === Boolean(variant.educationFirst)],
    ['Original engineering and teaching job titles retained', has('Software Engineer') && has('Teaching & Research Assistant')],
    ['Print controls and TOEFL score excluded', !/download pdf|skip to cv|toefl/i.test(text)],
    ...languages.map(({ name, level }) => [`Language: ${name}`, has(`${name} — ${level}`)]),
    ['No placeholder text left behind', !/NEED USER INPUT|Lorem ipsum|TODO/i.test(text)],
    ['Section headings extract as words, not spaced glyphs', !glyphSplit],
    // A lost ligature shows up as a gap mid-word: "Certified" -> "Certi ed".
    ['No words broken by lost ligatures', !brokenByLigature],
    ['Experience heading is parseable', has('PROFESSIONAL EXPERIENCE')],
    ['Education heading is parseable', has('EDUCATION')],
    ['Skills heading is parseable', has('TECHNICAL SKILLS')],
    ['Confirmed summary', has(variant.summary)],
    ['Removed details absent', !/2M\+|KYC|ASP.NET Core|EF Core|TOEFL/.test(text)],
    ['No null glyphs in extracted text', !text.includes('\u0000')],
    ['Specialisation uses the intended skill priority',
      text.slice(lower.indexOf('technical skills') + 'technical skills'.length).trimStart()
        .startsWith(prioritise(resume.skills, variant.skillOrder)[0][0])],
    ['Working student availability', !variant.educationFirst || (has('20 hours/week') && has('12 months'))],
  ];

  // Every role and school in the data model should appear in the document.
  for (const role of experience) checks.push([`Role listed: ${role.company}`, has(role.company) && has(role.period) && has(role.scope)]);
  for (const school of education) {
    checks.push([`School listed: ${school.shortName}`, has(school.degree)]);
  }

  /* ---- Report -------------------------------------------------------------- */

  for (const role of Object.values(resume.roles)) {
    for (const [group, items] of role.groups) {
      checks.push([`Experience keywords: ${group} / ${items[0]}`, items.every(has)]);
    }
  }
  const folderCopy = await readFile(path.join(ROOT, 'output/pdf/resumes', variant.folderFilename));
  checks.push(['Organised folder copy matches the website PDF', sourceBytes.equals(folderCopy)]);

  const { size } = await stat(FILE);
  console.log(`${variant.filename} — ${(size / 1024).toFixed(0)} kB, ${pdf.numPages} page(s)`);
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
  await document.destroy();
  return failed;
}

let failures = 0;
for (const variant of Object.values(cvVariants)) failures += await verify(variant);
process.exitCode = failures ? 1 : 0;
