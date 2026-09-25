/**
 * In-process static file server over the build output. Used by the PDF and
 * screenshot scripts so they render the site exactly as GitHub Pages serves
 * it — absolute asset paths and directory index routing included.
 */
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.vcf': 'text/vcard',
};

const isFile = async (file) => {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
};

/** Resolves a request path the way GitHub Pages does. */
export async function resolveFile(urlPath) {
  let file = path.join(ROOT, urlPath);
  if (urlPath.endsWith('/')) file = path.join(file, 'index.html');
  if (!(await isFile(file)) && (await isFile(`${file}.html`))) file = `${file}.html`;
  if (!(await isFile(file)) && (await isFile(path.join(file, 'index.html')))) {
    file = path.join(file, 'index.html');
  }
  if (!file.startsWith(ROOT) || !(await isFile(file))) return null;
  return file;
}

/** @param {number} [port] 0 picks a free port. */
export function startServer(port = 0) {
  const server = createServer(async (req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = await resolveFile(urlPath);

    if (!file) {
      res.writeHead(404, { 'content-type': 'text/plain' }).end('404');
      return;
    }

    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
    });
    createReadStream(file).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      resolve({
        origin: `http://127.0.0.1:${server.address().port}`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}
