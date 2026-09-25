import { access } from 'node:fs/promises';
import puppeteer from 'puppeteer';

/** Chrome installs that can render the CV if Puppeteer's own download is absent. */
const SYSTEM_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
];

const exists = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

async function resolveExecutable() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;

  try {
    const bundled = puppeteer.executablePath();
    if (await exists(bundled)) return bundled;
  } catch {
    // Puppeteer has no browser registered; fall through to a system install.
  }

  for (const candidate of SYSTEM_CHROME) {
    if (await exists(candidate)) return candidate;
  }

  throw new Error(
    'No Chrome found. Run `npx puppeteer browsers install chrome`, or set PUPPETEER_EXECUTABLE_PATH.',
  );
}

/** Launches headless Chrome with rendering flags that keep output deterministic. */
export async function launch() {
  return puppeteer.launch({
    headless: true,
    executablePath: await resolveExecutable(),
    args: ['--font-render-hinting=none', '--disable-lcd-text'],
  });
}
