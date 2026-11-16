# danialriazati.ir

Personal site and CV of Danial Riazati — software engineer, Kiel, Germany.

Live at **[danialriazati.ir](https://danialriazati.ir)**. The portfolio is at `/`,
the full-time CV at `/cv/`, and the working student CV at `/cv/werkstudent/`. Both pages offer browser printing and a matching PDF download.

## How it works

Everything on the site comes from one file, [`src/data/profile.mjs`](src/data/profile.mjs).
The build renders that data into the portfolio page, the CV page, the PDF and the
schema.org metadata, so the four can never disagree with each other. If a date or a
job title needs to change, it changes in one place.

The output is plain HTML and CSS with about 4 kB of JavaScript, written to the
repository root so the existing GitHub Pages setup (branch, root directory, `CNAME`)
keeps working with no CI step. There is no framework and no runtime dependency;
everything under `devDependencies` is build tooling.

```
src/
  data/profile.mjs      every fact on the site
  templates/            layout, home page, CV document
  styles/               design tokens, site, CV (print rules included)
  lib/                  HTML escaping, static server, browser launcher
  build.mjs             renders pages, sitemap, robots.txt, favicon, vCard
  pdf.mjs               prints both CV routes to their downloadable A4 PDFs
  og.mjs                renders the social preview card
```

## Commands

```sh
npm install
npm run build     # pages + PDF + social card
npm run dev       # build, then serve on http://localhost:4321
```

Verification, all of which should pass before deploying:

```sh
npm run verify            # parses the PDF: text layer, every field, page count
node src/check-links.mjs  # every link in both pages
node src/shots.mjs / /cv/ /cv/werkstudent/ # screenshots at 1440/1280/768/390/320, flags overflow
```

Occasional tasks:

```sh
npm run fonts         # re-download the self-hosted font subsets
npm run images        # re-encode assets/*.{png,jpg} to WebP
npm run preview:pdf   # rasterise each PDF page to .preview/ for review
```

## The CV PDFs

Headless Chrome prints `/cv/` to `Danial_Riazati_CV.pdf` and `/cv/werkstudent/` to
`Danial_Riazati_Werkstudent_CV.pdf`. Both routes use the A4 rules in
`src/styles/cv.css` and produce PDFs with selectable text.

`src/verify-pdf.mjs` parses both generated files and asserts the things that are easy
to break silently: that the text layer extracts cleanly, that every contact detail
and date is present, that each CV stays within two pages, and that no word is split by a
lost ligature or by letter-spacing. Run it after any change to the CV.

## Content rules

Nothing on this site is placeholder or illustrative. Every role, date, metric,
certification and screenshot is real, and the images are genuine screenshots of
shipped work. If a fact is not known, it is left out rather than approximated.
