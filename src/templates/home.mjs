import { html, each, img } from '../lib/html.mjs';
import { person, contact, experience, education, languages, publicResume } from '../data/profile.mjs';

const keywordGroups = groups => html`<dl class="expertise-list">
  ${each(groups, ([title, items]) => html`<div><dt>${title}</dt><dd>${items.join(' · ')}</dd></div>`)}
</dl>`;

const roleEntry = (id, expanded = false) => {
  const role = experience.find(item => item.id === id);
  const details = publicResume.roles[id];
  return html`<details class="experience-entry" ${expanded ? 'open' : ''}>
    <summary>
      <span><b>${role.company}${role.product ? ` / ${role.product}` : ''}</b><span class="role-name">${role.role}</span></span>
      <span class="role-date">${role.period}<span class="expand-mark" aria-hidden="true">+</span></span>
    </summary>
    <div class="experience-content">
      <p class="role-meta">${role.scope} · ${role.location}</p>
      <p class="role-context">${details.context}</p>
      ${details.highlights ? html`<ul class="highlights">${each(details.highlights, text => html`<li>${text}</li>`)}</ul>` : ''}
      ${keywordGroups(details.groups)}
    </div>
  </details>`;
};

const links = () => html`<div class="social-links">
  <a href="${contact.email.href}">Email</a>
  <a href="${contact.github.href}" target="_blank" rel="noopener">GitHub</a>
  <a href="${contact.linkedin.href}" target="_blank" rel="noopener">LinkedIn</a>
</div>`;

export const homeBody = () => html`
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <a class="wordmark" href="#top">Danial Riazati<span class="wordmark-dot" aria-hidden="true">.</span></a>
    <nav aria-label="Main navigation">
      <a href="#experience">Experience</a><a href="#expertise">Expertise</a><a href="#projects">Projects</a>
      <a class="nav-cv" href="/cv/">View CV</a>
    </nav>
  </header>

  <div class="portfolio" id="top">
    <aside class="profile-rail" aria-label="Profile and contact">
      <figure class="portrait">${img(person.photo, {priority:true})}</figure>
      <p class="rail-name">${person.name}</p>
      <p class="rail-location">${person.location.label}</p>
      ${links()}
      <div class="rail-section">
        <h2>Education</h2>
        ${each(education, school => html`<p><b>${school.degree}</b><span>${school.shortName}${school.id === 'cau' ? ' (CAU)' : ''}</span><small>${school.period}</small></p>`)}
      </div>
      <div class="rail-section rail-languages">
        <h2>Languages</h2>
        ${each(languages, language => html`<p><b>${language.name}</b><span>${language.level.split(' (')[0]}</span></p>`)}
      </div>
      <a class="text-link" href="/Danial_Riazati_CV.pdf" download>Download CV</a>
    </aside>

    <main id="main">
      <section class="intro" aria-labelledby="intro-title">
        <p class="availability"><span aria-hidden="true"></span>${person.availability.statement}</p>
        <h1 id="intro-title">Senior Software<br>Engineer.</h1>
        <p class="specialisation">Backend architecture · .NET &amp; Python · AI systems</p>
        <p class="intro-summary">${publicResume.summary}</p>
        <div class="intro-actions"><a class="button" href="${contact.email.href}">Get in touch</a><a class="text-link" href="/cv/">Read my CV</a></div>
        <details class="work-authorisation"><summary>Work authorisation &amp; availability</summary><p>${person.availability.details}</p></details>
      </section>

      <section class="mobile-background content-section" aria-label="Education and languages">
        <div><h2>Education</h2>${each(education, school => html`<p><b>${school.degree}</b><span>${school.shortName} · ${school.period}</span></p>`)}</div>
        <div><h2>Languages</h2>${each(languages, language => html`<p><b>${language.name}</b><span>${language.level}</span></p>`)}</div>
      </section>

      <section class="content-section" id="experience" aria-labelledby="experience-title">
        <div class="section-heading"><h2 id="experience-title">Experience</h2><p>Architecture, delivery and technical leadership.</p></div>
        ${roleEntry('eyvan', true)}${roleEntry('hasin', true)}
        <div class="additional-heading">Additional experience</div>
        ${each(['freelance','infrafund','radin','sbu-ta'], id => roleEntry(id))}
      </section>

      <section class="content-section" id="expertise" aria-labelledby="expertise-title">
        <div class="section-heading"><h2 id="expertise-title">Technical expertise</h2></div>
        <div class="skills-grid">${each(publicResume.skills, ([group, items]) => html`<div><h3>${group}</h3><p>${items.join(' · ')}</p></div>`)}</div>
      </section>

      <section class="content-section" id="projects" aria-labelledby="projects-title">
        <div class="section-heading"><h2 id="projects-title">Selected projects</h2></div>
        <div class="project-grid">
          <article class="project-card">
            <a class="project-image" href="https://github.com/danial-riazati/avan-persian-date-picker" target="_blank" rel="noopener"><img src="/assets/avan-demo.webp" alt="Avan Persian Date Picker showing a two-month calendar" loading="lazy" width="640" height="400"></a>
            <div><h3><a href="https://github.com/danial-riazati/avan-persian-date-picker" target="_blank" rel="noopener">Avan Persian Date Picker</a></h3><p>Reusable React components · TypeScript · npm · Automated testing</p></div>
          </article>
          <article class="project-card">
            <div class="project-image"><img src="/assets/classnegar8.webp" alt="Class Negar Raspberry Pi classroom attendance terminal" loading="lazy" width="640" height="400"></div>
            <div><h3>Class Negar</h3><p>BSc thesis · IoT · Raspberry Pi · Linux · REST APIs</p></div>
          </article>
        </div>
        <article class="current-project"><span class="project-status">In development</span><h3>Multi-agent systems</h3><p>Agent coordination · Agentic AI</p></article>
      </section>

      <footer class="contact-section" id="contact">
        <h2>Let’s connect.</h2>
        <a class="email-link" href="${contact.email.href}">${contact.email.display}</a>
        <p>Based in Kiel. Open to on-site, hybrid and remote engineering roles across Germany.</p>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${person.name}</span><a href="/cv/">Curriculum vitae</a></div>
      </footer>
    </main>
  </div>
`;
