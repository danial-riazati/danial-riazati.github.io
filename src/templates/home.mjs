import { html, each, raw, pad, icons, img } from '../lib/html.mjs';
import {
  site,
  person,
  contact,
  experience,
  projects,
  skills,
  education,
  certifications,
  languages,
  facts,
  sections,
} from '../data/profile.mjs';

const sectionIndex = (id) => pad(sections.findIndex((s) => s.id === id) + 1);

const sectionHead = ({ id, title, lede }) => html`
  <header class="section-head" data-reveal>
    <p class="eyebrow">
      <span class="eyebrow__index">${sectionIndex(id)}</span>
      <span>${sections.find((s) => s.id === id)?.label ?? title}</span>
    </p>
    <h2 class="section-title">${title}</h2>
    ${lede ? html`<p class="section-lede">${lede}</p>` : ''}
  </header>
`;

const tagList = (items) =>
  items.length
    ? html`<ul class="tags">
        ${each(items, (tech) => html`<li class="tag">${tech}</li>`)}
      </ul>`
    : '';

/* -------------------------------------------------------------------------- */

const nav = () => html`
  <header class="nav" id="nav" data-stuck="false">
    <div class="shell nav__inner">
      <a class="nav__brand" href="#top" aria-label="Danial Riazati — back to top">
        <span class="nav__brand-mark" aria-hidden="true">DR</span>
        <span>
          Danial Riazati
          <span class="nav__brand-role">Software Engineer</span>
        </span>
      </a>

      <nav class="nav__links" aria-label="Sections">
        ${each(
          sections,
          (s) => html`<a class="nav__link" href="#${s.id}" data-nav-link="${s.id}">${s.label}</a>`,
        )}
      </nav>

      <div class="nav__actions">
        <a class="btn btn--accent btn--sm btn--desktop" href="${site.cvPdf}" download="${site.cvPdfFilename}">
          ${icons.download} Download CV
        </a>
        <button
          class="nav__toggle"
          type="button"
          id="nav-toggle"
          aria-expanded="false"
          aria-controls="nav-panel"
        >
          <span class="nav__toggle-bars" aria-hidden="true"><i></i><i></i><i></i></span>
          <span id="nav-toggle-text">Menu</span>
        </button>
      </div>
    </div>

    <div class="nav__panel" id="nav-panel" data-open="false">
      <nav class="nav__panel-links" aria-label="Sections">
        ${each(
          sections,
          (s, i) => html`
            <a class="nav__panel-link" href="#${s.id}">
              <span>${pad(i + 1)}</span>${s.label}
            </a>
          `,
        )}
      </nav>
      <div class="nav__panel-actions">
        <a class="btn btn--accent" href="${site.cvPdf}" download="${site.cvPdfFilename}">
          ${icons.download} Download CV (PDF)
        </a>
        <a class="btn btn--ghost" href="/cv/">View CV online</a>
        <a class="btn btn--ghost" href="${contact.email.href}">Email me</a>
      </div>
      <div class="nav__panel-meta">
        <span>${person.location.label}</span>
        <span>${contact.phone.display}</span>
      </div>
    </div>
  </header>
`;

/* -------------------------------------------------------------------------- */

const hero = () => html`
  <section class="section section--flush hero" id="top" aria-labelledby="hero-name">
    <div class="shell">
      <div class="hero__top" data-reveal>
        <p class="hero__status">
          <span class="status-dot" aria-hidden="true"></span>
          ${person.availability.statement}
        </p>
        <p class="hero__availability">
          ${each(person.availability.modes, (m) => html`<span>${m.mode} <b>${m.place}</b></span>`)}
        </p>
      </div>

      <div class="hero__masthead" data-reveal>
        <h1 class="hero__name" id="hero-name"><span>Danial</span> <em>Riazati</em></h1>
      </div>

      <p class="hero__roles" data-reveal>
        ${each(person.roles, (role, i) =>
          i === 0 ? html`<b>${role}</b>` : html`<i aria-hidden="true">/</i><b>${role}</b>`,
        )}
      </p>

      <div class="hero__grid">
        <div class="hero__lede" data-reveal>
          <p class="hero__intro">${person.intro}</p>

          <div class="hero__cta">
            <a class="btn" href="#experience">${icons.arrowDown} View experience</a>
            <a class="btn btn--ghost" href="${site.cvPdf}" download="${site.cvPdfFilename}">
              ${icons.download} Download CV
            </a>
            <a class="btn btn--ghost" href="${contact.github.href}" target="_blank" rel="noopener">
              ${icons.arrowUpRight} GitHub
            </a>
          </div>
        </div>

        <figure class="hero__portrait" data-reveal>
          ${img(person.photo, { priority: true })}
          <figcaption>
            <span>${person.location.label}</span>
            <span aria-hidden="true">54.32°N</span>
          </figcaption>
        </figure>
      </div>

      <dl class="hero__facts" data-reveal>
        ${each(
          facts,
          (fact) => html`
            <div class="hero__fact">
              <dt class="visually-hidden">${fact.label}</dt>
              <dd>
                <b>${fact.value}</b>
                <span>${fact.label}</span>
              </dd>
            </div>
          `,
        )}
      </dl>
    </div>
  </section>
`;

/* -------------------------------------------------------------------------- */

const about = () => html`
  <section class="section" id="about" aria-labelledby="about-title">
    <div class="shell">
      ${sectionHead({ id: 'about', title: 'Backend systems, shipped and kept running.' })}
      <div class="about">
        <div class="about__body" data-reveal>
          <p>
            I am a software engineer with <strong>five years of production experience</strong>,
            mostly on the backend. My work has been the unglamorous, load-bearing kind: designing
            domain models and REST APIs, getting data access and caching right, wiring up payments
            and third-party providers, and making sure there is enough logging and health checking
            to understand what a system is doing at three in the morning.
          </p>
          <p>
            Most recently I was <strong>Software Engineer &amp; Team Lead at Eyvan Group</strong>,
            where I owned the architecture of a live travel-booking platform — a .NET 8
            clean-architecture API over SQL Server and Redis, a Next.js client, and the Docker and
            GitLab CI/CD pipeline that put both into production behind Nginx. Before that I worked
            on payment infrastructure at Hasin Technology and led Piki Smart Cart, an IoT
            retail-automation product.
          </p>
          <p>
            I like problems where the hard part is the system rather than the syntax: consistency
            across services, failure modes, observability, and the design decisions that make a
            codebase survivable two years later. I also maintain
            <a class="link link--always" href="https://github.com/danial-riazati/avan-persian-date-picker" target="_blank" rel="noopener">Avan</a>,
            an open-source Persian calendar library for React published on npm.
          </p>
          <p>
            I moved to <strong>Kiel</strong> to read for an MSc in Computer Science at
            Christian-Albrechts-Universität, and I am looking for backend or full-stack engineering
            work in Germany where I can keep building systems that carry real traffic.
          </p>
        </div>

        <dl class="about__aside" data-reveal>
          <div class="about__row">
            <dt>Based in</dt>
            <dd>${person.location.city}, ${person.location.region}, ${person.location.country}</dd>
          </div>
          <div class="about__row">
            <dt>Experience</dt>
            <dd>${person.yearsOfExperience} years, production software</dd>
          </div>
          <div class="about__row">
            <dt>Focus</dt>
            <dd>Backend · APIs · distributed systems · full-stack</dd>
          </div>
          <div class="about__row">
            <dt>Studying</dt>
            <dd>MSc Computer Science, Kiel University (CAU)</dd>
          </div>
          <div class="about__row">
            <dt>Languages</dt>
            <dd>${languages.map((l) => `${l.name} (${l.level.split(' —')[0]})`).join(' · ')}</dd>
          </div>
          <div class="about__row">
            <dt>Open to</dt>
            <dd>
              ${each(
                person.availability.modes,
                (m, i) => html`${i > 0 ? ' · ' : ''}${m.mode} ${m.place}`,
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
`;

/* -------------------------------------------------------------------------- */

const experienceSection = () => html`
  <section class="section" id="experience" aria-labelledby="experience-title">
    <div class="shell">
      ${sectionHead({
        id: 'experience',
        title: 'Five years of building and operating software.',
        lede: 'Roles are listed most recent first. Open any one for the engineering detail.',
      })}

      <div class="roles">
        ${each(
          experience,
          (role, i) => html`
            <article
              class="role ${role.featured ? 'role--featured' : ''}"
              data-reveal
              itemscope
              itemtype="https://schema.org/OrganizationRole"
            >
              <h3>
                <button
                  class="role__head"
                  type="button"
                  aria-expanded="${i === 0 ? 'true' : 'false'}"
                  aria-controls="role-body-${role.id}"
                  data-role-toggle
                >
                  <span class="role__period">
                    ${role.period}
                    ${role.end === 'Present' ? html`<b>Current</b>` : ''}
                  </span>
                  <span>
                    <span class="role__title">${role.role}</span>
                    <span class="role__company">
                      <b>${role.company}</b>${role.product ? ` · ${role.product}` : ''} —
                      ${role.location}
                    </span>
                  </span>
                  <span class="role__toggle" aria-hidden="true">${icons.plus}</span>
                </button>
              </h3>

              <div class="role__body" id="role-body-${role.id}" data-open="${i === 0 ? 'true' : 'false'}">
                <div class="role__body-inner">
                  <div class="role__content">
                    <div>
                      <p class="role__summary">${role.summary}</p>
                      <ul class="role__bullets">
                        ${each(role.bullets, (bullet) => html`<li>${bullet.text}</li>`)}
                      </ul>
                      ${role.links
                        ? html`<div class="project__links">
                            ${each(
                              role.links,
                              (link) => html`
                                <a class="project__link" href="${link.href}" target="_blank" rel="noopener">
                                  ${link.label} ${icons.arrowUpRight}
                                </a>
                              `,
                            )}
                          </div>`
                        : ''}
                      ${tagList(role.tech)}
                    </div>
                    ${role.image
                      ? html`<figure class="role__media frame">${img(role.image)}</figure>`
                      : ''}
                  </div>
                </div>
              </div>
            </article>
          `,
        )}
      </div>
    </div>
  </section>
`;

/* -------------------------------------------------------------------------- */

const projectStory = (project) => html`
  <dl class="project__story">
    <div><dt>Problem</dt><dd>${project.problem}</dd></div>
    <div><dt>Role</dt><dd>${project.role}</dd></div>
    <div><dt>Engineering</dt><dd>${project.engineering}</dd></div>
    <div><dt>Outcome</dt><dd>${project.outcome}</dd></div>
  </dl>
`;

const projectsSection = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return html`
    <section class="section" id="projects" aria-labelledby="projects-title">
      <div class="shell">
        ${sectionHead({
          id: 'projects',
          title: 'Selected work.',
          lede: 'Four projects that show the range: a production platform, a published open-source library, an IoT thesis, and a hardware product.',
        })}

        <div class="projects">
          ${each(
            featured,
            (project, i) => html`
              <article class="project" data-reveal>
                <div>
                  <p class="project__index">
                    <span>${pad(i + 1)}</span>${project.kind} · ${project.year}
                  </p>
                  <h3 class="project__name">${project.name}</h3>
                  <p class="project__tagline">${project.tagline}</p>
                  ${projectStory(project)}
                  ${project.packages
                    ? html`<ul class="project__packages">
                        ${each(
                          project.packages,
                          (pkg) => html`<li><code>${pkg.name}</code><span>${pkg.role}</span></li>`,
                        )}
                      </ul>`
                    : ''}
                  <div class="project__links">
                    ${project.url
                      ? html`<a class="project__link" href="${project.url}" target="_blank" rel="noopener">
                          ${project.repo ? 'Live demo' : 'Visit site'} ${icons.arrowUpRight}
                        </a>`
                      : ''}
                    ${project.repo
                      ? html`<a class="project__link" href="${project.repo}" target="_blank" rel="noopener">
                          Source ${icons.arrowUpRight}
                        </a>`
                      : ''}
                    ${project.npmUrl
                      ? html`<a class="project__link" href="${project.npmUrl}" target="_blank" rel="noopener">
                          npm ${icons.arrowUpRight}
                        </a>`
                      : ''}
                  </div>
                  ${tagList(project.tech)}
                </div>

                ${project.image
                  ? html`<div class="project__media">
                      <figure class="frame">${img(project.image)}</figure>
                      ${project.gallery
                        ? html`<div class="project__gallery">
                            ${each(
                              project.gallery,
                              (shot) => html`<figure class="frame frame--tall">${img(shot)}</figure>`,
                            )}
                          </div>`
                        : ''}
                      <p class="frame__caption">${project.name} — ${project.year}</p>
                    </div>`
                  : ''}
              </article>
            `,
          )}
        </div>

        <div class="more-projects">
          ${each(
            rest,
            (project) => html`
              <a class="mini" href="${project.url}" target="_blank" rel="noopener">
                <span class="mini__kind">${project.kind} · ${project.year}</span>
                <span class="mini__name">${project.name} ${icons.arrowUpRight}</span>
                <span class="mini__text">${project.tagline}</span>
              </a>
            `,
          )}
          <a class="mini" href="${contact.github.href}" target="_blank" rel="noopener">
            <span class="mini__kind">Open source</span>
            <span class="mini__name">More on GitHub ${icons.arrowUpRight}</span>
            <span class="mini__text">Libraries, experiments and coursework at ${contact.github.display}.</span>
          </a>
        </div>
      </div>
    </section>
  `;
};

/* -------------------------------------------------------------------------- */

const skillsSection = () => html`
  <section class="section" id="skills" aria-labelledby="skills-title">
    <div class="shell">
      ${sectionHead({
        id: 'skills',
        title: 'Technical expertise.',
        lede: 'Grouped by what I actually use in production, not by what looks good in a list.',
      })}

      <div class="skills">
        ${each(
          skills,
          (group, i) => html`
            <section class="skill-group" data-reveal>
              <h3 class="skill-group__name"><i>${pad(i + 1)}</i> ${group.group}</h3>
              <ul class="skill-group__items">
                ${each(group.items, (item) => html`<li>${item}</li>`)}
              </ul>
            </section>
          `,
        )}
      </div>
    </div>
  </section>
`;

/* -------------------------------------------------------------------------- */

const educationSection = () => html`
  <section class="section" id="education" aria-labelledby="education-title">
    <div class="shell">
      ${sectionHead({ id: 'education', title: 'Education & certifications.' })}

      <div class="split">
        <div data-reveal>
          <div class="edu">
            ${each(
              education,
              (item) => html`
                <article class="edu__item">
                  <div class="edu__period">
                    ${item.period}
                    ${item.current
                      ? html`<span class="edu__current">
                          <span class="status-dot" aria-hidden="true"></span>In progress
                        </span>`
                      : ''}
                  </div>
                  <div>
                    <h3 class="edu__degree">${item.degree}</h3>
                    <p class="edu__school">${item.institution} — ${item.location}</p>
                    ${item.grade ? html`<p class="edu__grade">${item.grade}</p>` : ''}
                    ${item.notes
                      ? html`<ul class="edu__notes">
                          ${each(item.notes, (note) => html`<li>${note}</li>`)}
                        </ul>`
                      : ''}
                  </div>
                </article>
              `,
            )}
          </div>
        </div>

        <div data-reveal>
          <h3 class="eyebrow" style="margin-bottom:var(--space-s)">
            <span class="eyebrow__index">·</span><span>Certifications &amp; tests</span>
          </h3>
          <ul class="certs">
            ${each(
              certifications,
              (cert) => html`
                <li>
                  <b>${cert.name}</b>
                  <span>
                    ${cert.issuer} · ${cert.date}${cert.detail ? ` · ${cert.detail}` : ''}
                  </span>
                  ${cert.id ? html`<code>ID ${cert.id}</code>` : ''}
                </li>
              `,
            )}
          </ul>

          <h3 class="eyebrow" style="margin:var(--space-l) 0 var(--space-s)">
            <span class="eyebrow__index">·</span><span>Languages</span>
          </h3>
          <ul class="certs">
            ${each(
              languages,
              (lang) => html`<li><b>${lang.name}</b><span>${lang.level}</span></li>`,
            )}
          </ul>
        </div>
      </div>
    </div>
  </section>
`;

/* -------------------------------------------------------------------------- */

const contactSection = () => {
  const channels = [
    { label: 'Email', ...contact.email, external: false },
    { label: 'Phone', ...contact.phone, external: false },
    { label: 'LinkedIn', ...contact.linkedin, external: true },
    { label: 'GitHub', ...contact.github, external: true },
  ];

  return html`
    <section class="section contact" id="contact" aria-labelledby="contact-title">
      <div class="shell">
        <header class="section-head" data-reveal>
          <p class="eyebrow">
            <span class="eyebrow__index">${sectionIndex('contact')}</span><span>Contact</span>
          </p>
          <h2 class="contact__title" id="contact-title">Let's build something useful.</h2>
          <p class="contact__lede">
            I am in Kiel and open to backend and full-stack engineering roles across Germany —
            on-site, hybrid or remote. The fastest way to reach me is email or LinkedIn.
          </p>
        </header>

        <div class="contact__grid" data-reveal>
          ${each(
            channels,
            (channel) => html`
              <div class="contact__item">
                <span class="contact__label">${channel.label}</span>
                <a
                  class="contact__value"
                  href="${channel.href}"
                  ${channel.external ? raw('target="_blank" rel="noopener"') : ''}
                >
                  ${channel.display}${channel.external ? icons.arrowUpRight : ''}
                </a>
              </div>
            `,
          )}
          <div class="contact__item">
            <span class="contact__label">Location</span>
            <span class="contact__value">${person.location.label}</span>
          </div>
          <div class="contact__item">
            <span class="contact__label">Availability</span>
            <span class="contact__value">${person.availability.modes.map((m) => `${m.mode} ${m.place}`).join(' · ')}</span>
          </div>
        </div>

        <div class="contact__cta" data-reveal>
          <a class="btn" href="${contact.email.href}">${icons.arrowUpRight} Email me</a>
          <a class="btn btn--ghost" href="${site.cvPdf}" download="${site.cvPdfFilename}">
            ${icons.download} Download CV (PDF)
          </a>
          <a class="btn btn--ghost" href="/cv/">View CV online</a>
        </div>
      </div>
    </section>
  `;
};

const footer = () => html`
  <footer class="footer">
    <div class="shell footer__inner">
      <p>
        <span class="footer__name">${person.name}</span>
        <span class="footer__meta"> · Software Engineer · ${person.location.label}</span>
      </p>
      <nav class="footer__links" aria-label="Elsewhere">
        <a href="${contact.github.href}" target="_blank" rel="noopener">GitHub</a>
        <a href="${contact.linkedin.href}" target="_blank" rel="noopener">LinkedIn</a>
        <a href="${contact.email.href}">Email</a>
        <a href="/cv/">CV</a>
      </nav>
      <p class="footer__meta">© ${new Date().getFullYear()} ${person.name}</p>
    </div>
  </footer>
`;

export const homeBody = () => html`
  <a class="skip-link" href="#main">Skip to content</a>
  <div class="grid-lines" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
  ${nav()}
  <div class="page">
    <main id="main">
      ${hero()} ${about()} ${experienceSection()} ${projectsSection()} ${skillsSection()}
      ${educationSection()} ${contactSection()}
    </main>
    ${footer()}
  </div>
`;
