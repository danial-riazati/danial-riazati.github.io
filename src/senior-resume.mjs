/** Generate a local senior CV draft without rebuilding the website. */
import path from 'node:path';
import { ROOT } from './lib/server.mjs';
import { renderCvPdf } from './pdf.mjs';
import { seniorResume, seniorVariant } from './data/senior-resume.mjs';

const out = path.join(ROOT, 'output/pdf/drafts', seniorVariant.filename);
await renderCvPdf({ variant: seniorVariant, content: seniorResume, out });
console.log('Created the local senior software engineer CV draft.');
