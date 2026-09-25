/** Tiny templating helpers — no framework, no runtime. */
import { createRequire } from 'node:module';

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escapes a value for interpolation into HTML text or an attribute. */
export const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (character) => ENTITIES[character]);

/** Marks a string as already-safe HTML so `html` will not escape it again. */
export class Raw {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export const raw = (value) => new Raw(value);

const render = (value) => {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof Raw) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return esc(value);
};

/**
 * Tagged template that escapes interpolated values by default.
 * Wrap nested markup in `raw()` or build it with `html` to opt out.
 */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += render(values[i]) + strings[i + 1];
  }
  return raw(out);
}

/** Joins an iterable into safe HTML. */
export const each = (items, fn) => raw(items.map((item, i) => render(fn(item, i))).join(''));

/** Zero-pads a section or project index: 1 -> "01". */
export const pad = (n) => String(n).padStart(2, '0');

const sizes = createRequire(import.meta.url)('../data/images.json');

/**
 * Renders an <img> with intrinsic dimensions taken from the build-time image
 * manifest, so every image reserves its space before it loads.
 *
 * @param {{src: string, alt: string}} image
 * @param {{priority?: boolean, sizes?: string}} [options]
 */
export function img(image, { priority = false } = {}) {
  const size = sizes[image.src];
  return html`<img
    src="${image.src}"
    alt="${image.alt}"
    ${size ? raw(`width="${size.width}" height="${size.height}"`) : ''}
    loading="${priority ? 'eager' : 'lazy'}"
    decoding="${priority ? 'sync' : 'async'}"
    ${priority ? raw('fetchpriority="high"') : ''}
  />`;
}

export const icons = {
  arrowUpRight: raw(
    '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"/></svg>',
  ),
  download: raw(
    '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v8m0 0L5 7m3 3 3-3M2.5 11.5v1a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5v-1"/></svg>',
  ),
  arrowDown: raw(
    '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3v10m0 0 4-4m-4 4-4-4"/></svg>',
  ),
  plus: raw(
    '<svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg>',
  ),
  print: raw(
    '<svg class="btn__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 6V2.5h7V6M4.5 12H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.5M4.5 10h7v3.5h-7z"/></svg>',
  ),
};
