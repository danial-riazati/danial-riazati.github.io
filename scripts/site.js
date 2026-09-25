/**
 * Progressive enhancement only — every section is readable and every link
 * works with this file blocked. No dependencies.
 */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile navigation ------------------------------------------------ */

  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('nav-panel');
  const toggleText = document.getElementById('nav-toggle-text');

  if (toggle && panel) {
    const setNav = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      panel.dataset.open = String(open);
      document.body.dataset.navOpen = String(open);
      if (toggleText) toggleText.textContent = open ? 'Close' : 'Menu';
    };

    toggle.addEventListener('click', () => {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', (event) => {
      if (event.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // The panel is a fixed overlay sized for small screens; close it if the
    // viewport grows past the breakpoint while it is open.
    window.matchMedia('(min-width: 62.0625rem)').addEventListener('change', (event) => {
      if (event.matches) setNav(false);
    });
  }

  /* ---- Sticky nav border ------------------------------------------------ */

  const nav = document.getElementById('nav');
  if (nav) {
    const sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden', 'true');
    document.body.prepend(sentinel);
    new IntersectionObserver(
      ([entry]) => {
        nav.dataset.stuck = String(!entry.isIntersecting);
      },
      { rootMargin: '0px' },
    ).observe(sentinel);
  }

  /* ---- Expandable experience entries ------------------------------------ */

  document.querySelectorAll('[data-role-toggle]').forEach((button) => {
    const body = document.getElementById(button.getAttribute('aria-controls'));
    if (!body) return;
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      body.dataset.open = String(!open);
    });
  });

  /* ---- Reveal on scroll -------------------------------------------------- */

  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    );
    revealTargets.forEach((el) => observer.observe(el));
  }

  /* ---- Current section in the nav ---------------------------------------- */

  const navLinks = new Map(
    [...document.querySelectorAll('[data-nav-link]')].map((link) => [link.dataset.navLink, link]),
  );
  const observedSections = [...navLinks.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (observedSections.length && 'IntersectionObserver' in window) {
    let current = null;
    const spy = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible || visible.target.id === current) return;
        navLinks.get(current)?.removeAttribute('aria-current');
        current = visible.target.id;
        navLinks.get(current)?.setAttribute('aria-current', 'true');
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.2, 0.5] },
    );
    observedSections.forEach((section) => spy.observe(section));
  }

  /* ---- CV print ---------------------------------------------------------- */

  document.getElementById('cv-print')?.addEventListener('click', () => window.print());
})();
