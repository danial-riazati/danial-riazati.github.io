import { html, each, icons } from '../lib/html.mjs';
import { resume, prioritise } from '../data/resume.mjs';
import {
  cvVariants,
  person,
  contact,
  experience,
  education,
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

const keywordGroups = (items) => html`
  <div class="cv-keywords">
    ${each(items, ([label, values]) => html`<p><b>${label}</b> - ${values.join(' · ')}</p>`)}
  </div>
`;

const experienceEntries = (variant, ids) => each(ids, id => {
  const role = experience.find(item => item.id === id);
  const content = resume.roles[id];
  return html`
    <article class="cv-entry">
      <div class="cv-entry__head">
        <h3 class="cv-entry__role">${role.studentRole ?? role.role}<span class="cv-entry__at">,</span>
          <span class="cv-entry__org">${role.company}${role.product ? ` (${role.product})` : ''}</span>
        </h3>
        <p class="cv-entry__meta">${role.period}</p>
      </div>
      <p class="cv-entry__place">${role.scope} · ${role.location}</p>
      <p class="cv-context">${content.context}</p>
      ${keywordGroups(prioritise(content.groups, variant.groupOrder))}
    </article>
  `;
});

const educationEntries = () => each(education, item => html`
  <article class="cv-entry">
    <div class="cv-entry__head">
      <h3 class="cv-entry__role">${item.degree}</h3>
      <p class="cv-entry__meta">${item.period}</p>
    </div>
    <p class="cv-project__text">${item.institution}</p>
    <p class="cv-entry__place">${item.location}${item.grade ? ' · GPA 17.27 / 20' : ' · English-taught programme'}</p>
  </article>
`);

const projectEntries = variant => each(
  prioritise(resume.projects, variant.projectOrder ?? []),
  ([title, year, technologies]) => html`
    <article class="cv-entry">
      <div class="cv-entry__head">
        <h3 class="cv-entry__role">${title}</h3>
        <p class="cv-entry__meta">${year}</p>
      </div>
      <p class="cv-project__text">${technologies.join(' · ')}</p>
    </article>
  `,
);

export const cvDocument = variant => {
  const remaining = experience.map(role => role.id).filter(id => !variant.firstRoles.includes(id));
  return html`
    <article class="cv" id="cv-document">
      <header class="cv-header">
        <h1 class="cv-name">${person.name}</h1>
        <p class="cv-role">${variant.headline}</p>
        ${contactBar()}
      </header>
      ${section('Profile', html`<p class="cv-summary">${variant.summary}</p>`)}
      ${variant.educationFirst ? section('Education', educationEntries()) : ''}
      ${section('Technical Skills', keywordGroups(prioritise(resume.skills, variant.skillOrder)))}
      ${section('Professional Experience', experienceEntries(variant, variant.firstRoles))}
      <div class="cv-continuation">
        <p class="cv-continuation__name">${person.name} · ${variant.label}</p>
        ${section('Professional Experience - Continued', experienceEntries(variant, remaining))}
        ${section('Selected Projects', projectEntries(variant))}
        ${variant.educationFirst ? '' : section('Education', educationEntries())}
        ${section('Languages', html`
          <div class="cv-keywords">
            ${each(languages, language => html`<p><b>${language.name}</b> — ${language.level}</p>`)}
          </div>
        `)}
      </div>
    </article>
  `;
};

/** Screen-only chrome around the document. Excluded from the PDF. */
export const cvPage = (variant) => html`
  <a class="skip-link" href="#cv-document">Skip to CV</a>

  <div class="cv-bar" data-print-hide>
    <div class="cv-bar__inner">
      <a class="cv-bar__back" href="/">
        <span aria-hidden="true">←</span> ${person.name}
      </a>
      <div class="cv-bar__actions">
        <a class="btn btn--accent btn--sm" href="/${variant.filename}" download="${variant.filename}">
          ${icons.download} Download PDF
        </a>
        <button class="btn btn--ghost btn--sm" type="button" id="cv-print">
          ${icons.print} Print
        </button>
      </div>
    </div>
  </div>

  <nav class="cv-variants" aria-label="CV version" data-print-hide>
    ${each(Object.values(cvVariants), (option) => html`
      <a class="btn btn--ghost btn--sm" href="${option.path}" aria-current="${option === variant ? 'page' : 'false'}">
        ${option.label}
      </a>
    `)}
  </nav>

  <main class="cv-stage">${cvDocument(variant)}</main>

  <footer class="cv-foot" data-print-hide>
    <p>
      Also available as a
      <a class="link link--always" href="/${variant.filename}" download="${variant.filename}">PDF</a>.
      Back to the <a class="link link--always" href="/">portfolio</a>.
    </p>
    <p>© ${new Date().getFullYear()} ${person.name} · ${person.location.label}</p>
  </footer>
`;
