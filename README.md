# danialriazati.ir

Personal site and CV of Danial Riazati — software engineer, Kiel, Germany.

Live at **[danialriazati.ir](https://danialriazati.ir)**. The portfolio is at `/`,
the general CV at `/cv/`, and the Working Student IT CV at `/cv/werkstudent/`.
Specialised CVs are at `/cv/data/`, `/cv/backend/` and `/cv/frontend/`. Each page
offers browser printing and a matching PDF download.

## How it works

Contact details, dates and education come from
[`src/data/profile.mjs`](src/data/profile.mjs). Confirmed skills, experience keywords
and the five CV variants come from [`src/data/resume.mjs`](src/data/resume.mjs).
The portfolio, CV pages, PDF exports and metadata use these shared sources.

The output is plain HTML and CSS with about 4 kB of JavaScript, written to the
repository root so the existing GitHub Pages setup (branch, root directory, `CNAME`)
keeps working with no CI step. There is no framework and no runtime dependency;
everything under `devDependencies` is build tooling.

```
src/
  data/profile.mjs      contact details, dates, education and portfolio projects
  data/resume.mjs       confirmed skills, experience keywords and CV variants
  templates/            layout, home page, CV document
  styles/               design tokens, site, CV (print rules included)
  lib/                  HTML escaping, static server, browser launcher
  build.mjs             renders pages, sitemap, robots.txt, favicon, vCard
  pdf.mjs               exports five A4 CV PDFs and their organised folder copies
  resume.mjs            invokes the five-variant PDF export
  og.mjs                renders the social preview card
```

## Commands

```sh
npm install
npm run build     # pages + PDF + social card
npm run dev       # build, then serve on http://localhost:4321
npm run build:resumes # regenerate the five CVs in output/pdf/resumes/
```

Verification, all of which should pass before deploying:

```sh
npm run verify            # parses the PDF: text layer, every field, page count
node src/check-links.mjs  # every link in the portfolio and all CV variants
node src/shots.mjs / /cv/ /cv/werkstudent/ # screenshots at 1440/1280/768/390/320, flags overflow
```

Occasional tasks:

```sh
npm run fonts         # re-download the self-hosted font subsets
npm run images        # re-encode assets/*.{png,jpg} to WebP
npm run preview:pdf   # rasterise each PDF page to .preview/ for review
```

## The CV PDFs

Headless Chrome prints the same CV pages visitors see. All variants use
`src/styles/cv.css` and produce PDFs with selectable text. The general version
keeps the existing `/Danial_Riazati_CV.pdf` address, and the Working Student IT
version keeps `/Danial_Riazati_Werkstudent_CV.pdf`.

Every PDF build also writes five clearly named files to `output/pdf/resumes/`.
This local folder is ignored by Git. The root PDFs are the website downloads.

`src/verify-pdf.mjs` parses all five generated files and asserts the things that are easy
to break silently: that the text layer extracts cleanly, that every contact detail
and date is present, that each CV stays within two pages, and that no word is split by a
lost ligature or by letter-spacing. Run it after any change to the CV.

## Content rules

Nothing on this site is placeholder or illustrative. Every role, date, metric,
certification and screenshot is real, and the images are genuine screenshots of
shipped work. If a fact is not known, it is left out rather than approximated.
