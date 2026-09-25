import { html, each, icons } from '../lib/html.mjs';
import {
  site,
  person,
  contact,
  experience,
  projects,
  cvSkills,
  education,
  certifications,
  languages,
} from '../data/profile.mjs';

/**
 * The CV document. Deliberately more conservative than the portfolio: one
 * column, real text, no graphics, no skill bars — so that both a human and an
 * ATS parser read it the same way. This markup is what Puppeteer prints to
 * Danial_Riazati_CV.pdf, so the print stylesheet is the source of truth for
 * the final document.
 */

const section = (title, content) => html`
  <section class="cv-section">
    <h2 class="cv-section__title">${title}</h2>
    ${content}
  </section>
`;

const contactBar = () => {
  const items = [
    { text: person.location.label, href: null },
    { text: contact.phone.display, href: contact.phone.href },
    { text: contact.email.display, href: contact.email.href },
    { text: contact.linkedin.display, href: contact.linkedin.href },
    { text: contact.github.display, href: contact.github.href },
    { text: contact.website.display, href: contact.website.href },
  ];

  return html`
    <ul class="cv-contact">
      ${each(
        items,
        (item) => html`
          <li>${item.href ? html`<a href="${item.href}">${item.text}</a>` : item.text}</li>
        `,
      )}
    </ul>
  `;
};

const experienceEntries = () =>
  each(
    experience,
    (role) => html`
      <article class="cv-entry">
        <div class="cv-entry__head">
          <h3 class="cv-entry__role">
            ${role.role}<span class="cv-entry__at">,</span>
            <span class="cv-entry__org"
              >${role.company}${role.product ? ` (${role.product})` : ''}</span
            >
          </h3>
          <p class="cv-entry__meta">${role.period}</p>
        </div>
        <p class="cv-entry__place">${role.location}</p>
        <ul class="cv-bullets">
          ${each(
            role.bullets.filter((b) => b.cv),
            (bullet) => html`<li>${bullet.cvText ?? bullet.text}</li>`,
          )}
        </ul>
        ${role.cvTech && role.tech.length
          ? html`<p class="cv-entry__tech"><span>Stack</span>${role.tech.join(' · ')}</p>`
          : ''}
      </article>
    `,
  );

const educationEntries = () =>
  each(
    education,
    (item) => html`
      <article class="cv-entry">
        <div class="cv-entry__head">
          <h3 class="cv-entry__role">${item.degree}</h3>
          <p class="cv-entry__meta">${item.period}</p>
        </div>
        <p class="cv-entry__place">
          ${item.institution} — ${item.location}${item.grade ? html` · <b>${item.grade}</b>` : ''}
        </p>
        ${item.notes
          ? html`<ul class="cv-bullets">
              ${each(item.notes, (note) => html`<li>${note}</li>`)}
            </ul>`
          : ''}
      </article>
    `,
  );

const projectEntries = () =>
  each(
    projects.filter((p) => p.cv),
    (project) => html`
      <article class="cv-entry cv-entry--tight">
        <div class="cv-entry__head">
          <h3 class="cv-entry__role">
            ${project.name}
            ${project.npm ? html`<span class="cv-entry__org">— ${project.npm}</span>` : ''}
          </h3>
          <p class="cv-entry__meta">${project.year}</p>
        </div>
        <p class="cv-project__text">${project.cvLine}</p>
        ${project.repo || project.url
          ? html`<p class="cv-project__link">
              <a href="${project.repo ?? project.url}">${(project.repo ?? project.url).replace(/^https?:\/\//, '')}</a>
            </p>`
          : ''}
      </article>
    `,
  );

export const cvDocument = () => html`
  <article class="cv" id="cv-document">
    <header class="cv-header">
      <h1 class="cv-name">${person.name}</h1>
      <p class="cv-role">${person.headline}</p>
      ${contactBar()}
    </header>

    ${section('Professional Summary', html`<p class="cv-summary">${person.summary}</p>`)}
    ${section('Professional Experience', experienceEntries())}
    ${section(
      'Technical Skills',
      html`
        <dl class="cv-skills">
          ${each(
            cvSkills,
            (group) => html`
              <div>
                <dt>${group.group}</dt>
                <dd>${group.items.join(' · ')}</dd>
              </div>
            `,
          )}
        </dl>
      `,
    )}
    ${section('Education', educationEntries())}
    ${section('Selected Projects', projectEntries())}
    ${section(
      'Certifications & Languages',
      html`
        <ul class="cv-certs">
          ${each(
            certifications.filter((c) => c.cv !== false),
            (cert) => html`
              <li>
                <b>${cert.name}</b>
                <span>
                  ${cert.issuer} · ${cert.date}${cert.detail ? ` · ${cert.detail}` : ''}${cert.id
                    ? ` · ID ${cert.id}`
                    : ''}
                </span>
              </li>
            `,
          )}
          <li>
            <b>Languages</b>
            <span>${languages.map((l) => `${l.name} — ${l.level}`).join(' · ')}</span>
          </li>
        </ul>
      `,
    )}
  </article>
`;

/** Screen-only chrome around the document. Excluded from the PDF. */
export const cvPage = () => html`
  <a class="skip-link" href="#cv-document">Skip to CV</a>

  <div class="cv-bar" data-print-hide>
    <div class="cv-bar__inner">
      <a class="cv-bar__back" href="/">
        <span aria-hidden="true">←</span> ${person.name}
      </a>
      <p class="cv-bar__title">Curriculum Vitae</p>
      <div class="cv-bar__actions">
        <a class="btn btn--accent btn--sm" href="${site.cvPdf}" download="${site.cvPdfFilename}">
          ${icons.download} Download PDF
        </a>
        <button class="btn btn--ghost btn--sm" type="button" id="cv-print">
          ${icons.print} Print
        </button>
      </div>
    </div>
  </div>

  <main class="cv-stage">${cvDocument()}</main>

  <footer class="cv-foot" data-print-hide>
    <p>
      Also available as a
      <a class="link link--always" href="${site.cvPdf}" download="${site.cvPdfFilename}">PDF</a>.
      Back to the <a class="link link--always" href="/">portfolio</a>.
    </p>
    <p>© ${new Date().getFullYear()} ${person.name} · ${person.location.label}</p>
  </footer>
`;
