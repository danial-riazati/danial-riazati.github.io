import { html, each, icons } from '../lib/html.mjs';
import { resume, prioritise } from '../data/resume.mjs';
import {
  person,
  contact,
  experience,
  education,
  languages,
} from '../data/profile.mjs';

/**
 * The CV document. Deliberately more conservative than the portfolio: one
 * column, real text, no skill bars — so that both a human and an
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

const experienceEntries = (variant, ids, content = resume) => each(ids, id => {
  const role = experience.find(item => item.id === id);
  const details = content.roles[id];
  return html`
    <article class="cv-entry">
      <div class="cv-entry__head">
        <h3 class="cv-entry__role">${variant.showLeadership ? role.role : role.studentRole ?? role.role}<span class="cv-entry__at">,</span>
          <span class="cv-entry__org">${role.company}${role.product ? ` (${role.product})` : ''}</span>
        </h3>
        <p class="cv-entry__meta">${role.period}</p>
      </div>
      <p class="cv-entry__place">${role.scope} · ${role.location}</p>
      <p class="cv-context">${details.context}</p>
      ${details.responsibility ? html`<p class="cv-project__text">${details.responsibility}</p>` : ''}
      ${details.highlights ? html`<ul style="list-style:disc; margin:4pt 0 4pt 11pt; font-size:9.5pt; line-height:1.4">
        ${each(details.highlights, highlight => html`<li>${highlight}</li>`)}
      </ul>` : ''}
      ${keywordGroups(prioritise(details.groups, variant.groupOrder))}
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

const projectEntries = (variant, content = resume) => each(
  prioritise(content.projects, variant.projectOrder ?? []),
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

const languageEntries = compact => html`
  <div class="cv-keywords">
    ${compact
      ? html`<p>${languages.map(language => `${language.name} — ${language.level}`).join(' · ')}</p>`
      : each(languages, language => html`<p><b>${language.name}</b> — ${language.level}</p>`)}
  </div>
`;

export const cvDocument = (variant, content = resume) => {
  const remaining = (variant.roleIds ?? experience.map(role => role.id)).filter(id => !variant.firstRoles.includes(id));
  return html`
    <article class="cv" id="cv-document">
      <header class="cv-header ${variant.photo ? 'cv-header--photo' : ''}">
        <div class="cv-header__text">
        <h1 class="cv-name">${person.name}</h1>
        <p class="cv-role">${variant.headline}</p>
        ${variant.subtitle ? html`<p class="cv-context">${variant.subtitle}</p>` : ''}
        ${contactBar()}
        </div>
        ${variant.photo ? html`<img class="cv-photo" src="${person.photo.src}" alt="${person.photo.alt}" width="84" height="96">` : ''}
      </header>
      ${section('Profile', variant.profileNote ? html`
        <p class="cv-summary">${variant.summary}</p>
        <p class="cv-entry__place" style="margin-top:6pt"><b>Work authorisation</b> — ${variant.profileNote}</p>
      ` : html`
        <div class="cv-authorization">
          <p><b>Working Student</b> — ${content.workAuthorization.workingStudent}</p>
          <p><b>Full-time employment</b> — ${content.workAuthorization.fullTime}</p>
        </div>
        <p class="cv-summary">${variant.summary}</p>
      `)}
      ${variant.educationFirst ? section('Education', educationEntries()) : ''}
      ${variant.languagesFirst ? section('Languages', languageEntries(variant.compactLanguages)) : ''}
      ${section('Technical Skills', keywordGroups(prioritise(content.skills, variant.skillOrder)))}
      ${section(variant.experienceHeading ?? 'Professional Experience', experienceEntries(variant, variant.firstRoles, content))}
      <div class="cv-continuation">
        <p class="cv-continuation__name">${person.name} · ${variant.label}</p>
        ${section(variant.continuationHeading ?? 'Professional Experience - Continued', experienceEntries(variant, remaining, content))}
        ${section('Selected Projects', projectEntries(variant, content))}
        ${variant.educationFirst ? '' : section('Education', educationEntries())}
        ${variant.languagesFirst ? '' : section('Languages', languageEntries(variant.compactLanguages))}
      </div>
    </article>
  `;
};

/** Screen-only chrome around the document. Excluded from the PDF. */
export const cvPage = (variant, content = resume) => html`
  <a class="skip-link" href="#cv-document">Skip to CV</a>

  <div class="cv-bar" data-print-hide>
    <div class="cv-bar__inner">
      <a class="cv-bar__back" href="/">
        ${person.name}
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

  <main class="cv-stage">${cvDocument(variant, content)}</main>

  <footer class="cv-foot" data-print-hide>
    <p>
      Also available as a
      <a class="link link--always" href="/${variant.filename}" download="${variant.filename}">PDF</a>.
      Back to the <a class="link link--always" href="/">portfolio</a>.
    </p>
    <p>© ${new Date().getFullYear()} ${person.name} · ${person.location.label}</p>
  </footer>
`;
