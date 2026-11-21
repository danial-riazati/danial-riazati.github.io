/**
 * Shared identity, dates, education and portfolio projects. Confirmed skills
 * and CV specialisations are imported from resume.mjs. Edit here; everything downstream regenerates
 * with `npm run build`.
 *
 * Every fact in this file is taken from the previous CV in this repository,
 * from source code in the author's own project repositories, or was supplied
 * directly by the author. Nothing here is inferred or embellished.
 */

import { resume, resumeVariants } from './resume.mjs';

export const site = {
  url: 'https://danialriazati.ir',
  title: 'Danial Riazati — Software Engineer · Data Analytics & AI · Kiel, Germany',
  shortTitle: 'Danial Riazati — Software Engineer',
  description: resumeVariants.general.description,
  locale: 'en',
  ogImage: '/assets/og-image.png',
  cvPdfFilename: 'Danial_Riazati_CV.pdf',
  googleVerification: 'cyOPO8z70xLNQhaveYXwENMDbJk1cBrHa9JIeOiAR3I',
};

export const person = {
  name: 'Danial Riazati',
  givenName: 'Danial',
  familyName: 'Riazati',
  headline: resume.headline,
  yearsOfExperience: '5+',
  location: {
    city: 'Kiel',
    region: 'Schleswig-Holstein',
    country: 'Germany',
    label: 'Kiel, Germany',
  },
  photo: {
    src: '/assets/profile.webp',
    alt: 'Portrait photograph of Danial Riazati',
  },
  /** Hero paragraph — the 10-second pitch. */
  intro: resume.summary,
  availability: {
    statement: 'Open to working student and full-time roles',
    details: Object.values(resume.workAuthorization).join(' '),
    modes: [
      { mode: 'On-site', place: 'Kiel' },
      { mode: 'Hybrid', place: 'Hamburg' },
      { mode: 'Remote', place: 'Germany-wide' },
    ],
  },
};

export const cvVariants = resumeVariants;

export const contact = {
  phone: { display: '+49 163 1311415', href: 'tel:+491631311415' },
  email: { display: 'riazatidanial@gmail.com', href: 'mailto:riazatidanial@gmail.com' },
  linkedin: {
    display: 'linkedin.com/in/danial-riazati',
    href: 'https://www.linkedin.com/in/danial-riazati/',
    label: 'LinkedIn',
  },
  github: {
    display: 'github.com/danial-riazati',
    href: 'https://github.com/danial-riazati',
    label: 'GitHub',
  },
  website: { display: 'danialriazati.ir', href: 'https://danialriazati.ir', label: 'Portfolio' },
};

/**
 * `cv: true` marks bullets that also belong on the two-page PDF; the website
 * shows the full list. Where the CV needs a tighter line than the page reads
 * well with, `cvText` overrides `text` in the PDF only. `cvTech` controls
 * whether the role prints its stack line, which is space the CV cannot always
 * afford on older roles.
 */
export const experience = [
  {
    id: 'eyvan',
    scope: 'Full-time',
    company: 'Eyvan Group',
    product: 'EyvanTrip',
    url: 'https://eyvantrip.com',
    role: 'Software Engineer & Team Lead',
    studentRole: 'Software Engineer',
    start: 'April 2024',
    end: 'November 2025',
    period: 'Apr 2024 – Nov 2025',
    isoStart: '2024-04',
    isoEnd: '2025-11',
    location: 'Tehran, Iran',
    featured: true,
    cvTech: true,
    summary:
      'Technical lead for EyvanTrip, a production hotel and tour booking platform. I owned the backend architecture, the release pipeline and day-to-day production operation, and led a small engineering team across the API and the web client.',
    bullets: [
      {
        cv: true,
        text: 'Led engineering for a live booking platform, owning backend architecture, release process and production operations, and directing a small team across the API and the Next.js web client.',
        cvText:
          'Led engineering for a live hotel and tour booking platform, owning backend architecture, release process and production operations across the API and the Next.js client.',
      },
      {
        cv: true,
        text: 'Designed a modular .NET backend on SQL Server with Redis distributed caching.',
      },
      {
        cv: true,
        text: 'Designed versioned REST APIs with JWT authentication, role-based authorisation, request rate limiting and OpenAPI documentation, consumed by the React / Next.js front end.',
        cvText:
          'Designed versioned REST APIs with JWT authentication, role-based authorisation, rate limiting and OpenAPI documentation for the React / Next.js front end.',
      },
      {
        cv: true,
        text: 'Integrated online payment gateways, QR and voucher generation, and server-side PDF document rendering into the booking and check-in flow.',
        cvText:
          'Integrated online payment gateways, QR voucher generation and server-side PDF rendering into the booking and check-in flow.',
      },
      {
        cv: true,
        text: 'Added structured logging and dependency health checks to improve production observability.',
      },
      {
        cv: true,
        text: 'Containerised the stack with multi-stage Docker builds and automated build, image publishing and deployment through GitLab CI/CD to a private registry and Linux/Nginx hosts.',
        cvText:
          'Containerised the stack with multi-stage Docker builds and automated deployment through GitLab CI/CD to a private registry and Linux/Nginx hosts.',
      },
      {
        cv: true,
        text: 'Drove remediation of an external security assessment based on ISO/IEC 15408 and the OWASP testing guides, hardening authentication, session invalidation, authorisation, audit logging and file-upload policy across the API.',
        cvText:
          'Drove remediation of an external ISO/IEC 15408 and OWASP-based security assessment, hardening authentication, session invalidation, authorisation and audit logging.',
      },
      {
        cv: true,
        text: 'Established HTTP integration testing and led code review for the team.',
      },
    ],
    tech: ['C#', '.NET', 'SQL Server', 'Redis', 'TypeScript', 'React', 'Next.js', 'Docker', 'Linux', 'CI/CD'],
    image: {
      src: '/assets/eyvantrip-preview.webp',
      alt: 'The EyvanTrip booking platform home page, showing hotel search and listings',
    },
  },
  {
    id: 'freelance',
    scope: 'Contract / Project-based',
    company: 'Independent Client Projects',
    role: 'Software Engineer',
    start: 'April 2024',
    end: 'December 2025',
    period: 'Apr 2024 – Dec 2025',
    isoStart: '2024-04',
    isoEnd: '2025-12',
    location: 'Remote — international clients',
    featured: false,
    cvTech: true,
    summary:
      'Web products delivered end to end for startups and business clients, with full ownership from architecture through to deployment.',
    bullets: [
      {
        cv: true,
        text: 'Delivered web products end to end for international clients, owning architecture, implementation, deployment and handover.',
      },
      {
        cv: true,
        text: 'Built and launched perspectivedesign.co for an architecture and design studio in Muscat, Oman, on a headless Strapi CMS so the studio can publish its own project portfolio.',
        cvText:
          'Built and launched perspectivedesign.co for an architecture studio in Muscat, Oman, on a headless Strapi CMS the studio maintains itself.',
      },
    ],
    tech: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Strapi', 'Docker', 'Nginx'],
    links: [{ label: 'perspectivedesign.co', href: 'https://perspectivedesign.co' }],
  },
  {
    id: 'infrafund',
    scope: 'Contract / Part-time',
    company: 'InfraFund',
    url: 'https://infrafund.net',
    role: 'Software Engineer',
    start: 'April 2024',
    end: 'July 2024',
    period: 'Apr 2024 – Jul 2024',
    isoStart: '2024-04',
    isoEnd: '2024-07',
    location: 'Remote — London, United Kingdom',
    featured: false,
    cvTech: true,
    summary:
      'Web3 crowdfunding platform financing NetZero and renewable-infrastructure projects, backed by University of Exeter R&D, Santander and the SETsquared incubator.',
    bullets: [
      {
        cv: true,
        text: 'Developed features for a Web3 crowdfunding platform combining blockchain settlement, AI-assisted asset management and KYC onboarding.',
      },
      {
        cv: true,
        text: 'Built DEX/STO components and the APIs behind real-time investor analytics.',
      },
    ],
    tech: ['Web3', 'Blockchain', 'TypeScript', 'React', 'REST APIs', 'KYC integrations'],
    image: {
      src: '/assets/infrafund1.webp',
      alt: 'The InfraFund platform home page, a Web3 crowdfunding site for NetZero projects',
    },
  },
  {
    id: 'hasin',
    scope: 'Full-time',
    company: 'Hasin Technology Co.',
    url: 'https://hasin.ir',
    role: 'Software Engineer — Backend & Team Lead',
    studentRole: 'Software Engineer',
    start: 'March 2021',
    end: 'February 2024',
    period: 'Mar 2021 – Feb 2024',
    isoStart: '2021-03',
    isoEnd: '2024-02',
    location: 'Tehran, Iran',
    featured: true,
    cvTech: true,
    summary:
      'Backend engineering on high-throughput payment infrastructure, then technical lead of the company Startup Studio.',
    bullets: [
      {
        cv: true,
        text: 'Optimised a high-throughput transaction processing service handling 2M+ daily requests and implemented monitoring and security controls.',
      },
      {
        cv: true,
        text: 'Led the company Startup Studio and acted as technical lead for Piki Smart Cart, a retail-automation product combining IoT sensors and computer vision.',
      },
    ],
    tech: ['C#', '.NET', 'SQL Server', 'Redis', 'Docker', 'Linux', 'IoT', 'Computer Vision'],
  },
  {
    id: 'radin',
    scope: 'Part-time',
    company: 'Radin Technology Co.',
    role: 'Internship Mentor',
    start: 'June 2021',
    end: 'December 2023',
    period: 'Jun 2021 – Dec 2023',
    isoStart: '2021-06',
    isoEnd: '2023-12',
    location: 'Tehran, Iran',
    featured: false,
    summary: 'Mentoring programme for undergraduate software engineering interns.',
    bullets: [
      {
        cv: true,
        text: 'Mentored 30+ undergraduate interns through software engineering fundamentals and project delivery.',
      },
    ],
    tech: [],
  },
  {
    id: 'sbu-ta',
    scope: 'Part-time',
    company: 'Shahid Beheshti University',
    role: 'Teaching & Research Assistant',
    start: 'September 2020',
    end: 'September 2023',
    period: 'Sep 2020 – Sep 2023',
    isoStart: '2020-09',
    isoEnd: '2023-09',
    location: 'Tehran, Iran',
    featured: false,
    summary:
      'Head teaching assistant for core computer science courses, alongside research project support.',
    bullets: [
      {
        cv: true,
        text: 'Served as head TA for Advanced Programming and Algorithms and supported Internet Engineering and faculty research projects. Worked with Python, Java and C++.',
      },
    ],
    tech: [],
  },
];

export const projects = [
  {
    id: 'eyvantrip',
    name: 'EyvanTrip',
    kind: 'Hotel ERP platform',
    year: '2024 – 2025',
    url: 'https://eyvantrip.com',
    featured: true,
    cv: true,
    tagline: 'Hotel ERP and tourism platform with booking, internal operations and reporting.',
    problem:
      'A hotel group was selling rooms and tours through disconnected channels, with pricing, availability and payment handled manually across several systems.',
    role: 'Software Engineer & Team Lead — backend architecture, API design, infrastructure and production operations.',
    engineering:
      'C#/.NET and SQL Server backend, React/Next.js frontend, Redis caching and RabbitMQ messaging. Python and Power BI support ERP reporting, with Docker deployment and ELK monitoring.',
    outcome:
      'Runs in production as the group\'s booking platform, deployed continuously from GitLab CI/CD to Dockerised Linux hosts behind Nginx.',
    tech: ['C# / .NET', 'SQL Server', 'Redis', 'RabbitMQ', 'React / Next.js', 'Python', 'Power BI', 'Docker', 'ELK Stack'],
    image: {
      src: '/assets/eyvantrip-preview.webp',
      alt: 'EyvanTrip home page with hotel and tour search',
    },
    cvLine:
      'Production hotel and tour booking platform with a modular .NET API, SQL Server, Redis caching and a Next.js client deployed through Docker and CI/CD.',
  },
  {
    id: 'avan',
    name: 'Avan Persian Date Picker',
    kind: 'Open source · npm',
    year: '2025',
    url: 'https://danialriazati.ir/avan-persian-date-picker/',
    repo: 'https://github.com/danial-riazati/avan-persian-date-picker',
    npm: '@avan-persian/react',
    npmUrl: 'https://www.npmjs.com/package/@avan-persian/react',
    featured: true,
    cv: true,
    tagline: 'A Jalali (Shamsi) calendar and date-range picker for React, published to npm.',
    problem:
      'Persian-calendar date pickers for React are typically unmaintained, bundle their own styling and handle RTL, holidays and range selection poorly — a recurring problem in every Iranian product I worked on.',
    role: 'Author and maintainer.',
    engineering:
      'A TypeScript monorepo of four published packages: a headless core for Jalali conversion, calendar grids and digit handling; a React layer with calendar, single-date and range pickers built on custom hooks for dismissible layers and controllable open state; an Iran public-holiday dataset; and a CSS-token theme package. Built with pnpm workspaces and Turborepo, unit-tested with Vitest, released through Changesets.',
    outcome:
      'Published on npm as @avan-persian/react with a live demo built from the repository and deployed on every push.',
    tech: ['TypeScript', 'React', 'pnpm', 'Turborepo', 'Vitest', 'Changesets', 'RTL', 'a11y'],
    image: {
      src: '/assets/avan-demo.webp',
      alt: 'The Avan two-month Jalali date-range picker, showing Persian numerals in a right-to-left calendar grid with a selected range and a holiday marker',
    },
    packages: [
      { name: '@avan-persian/react', role: 'Calendar, date and range pickers' },
      { name: 'core', role: 'Jalali conversion, grid generation, digit handling' },
      { name: 'holidays', role: 'Iran public holidays' },
      { name: 'themes', role: 'CSS design tokens and theming' },
    ],
    cvLine:
      'Open-source Jalali (Persian) calendar and date-range picker for React, published to npm. TypeScript monorepo (pnpm + Turborepo) split into a headless core, React components, holiday data and CSS themes; unit-tested with Vitest.',
  },
  {
    id: 'classnegar',
    name: 'Class Negar',
    kind: 'BSc thesis · IoT',
    year: '2023 – 2024',
    featured: true,
    cv: true,
    tagline: 'Smart classroom and attendance system built on Raspberry Pi, RFID and QR codes.',
    problem:
      'University attendance was still taken on paper: slow, easy to falsify, and producing no usable data for the faculty.',
    role: 'Sole author — hardware integration, backend and progressive web application. Supervised by Dr. Mojtaba Vahidi-Asl.',
    engineering:
      'Raspberry Pi classroom terminals read student RFID cards and time-limited QR codes, posting attendance events to a backend that exposes them to a progressive web application for students, lecturers and faculty administration.',
    outcome:
      'Selected as a Best Thesis Project candidate in the Computer Science & Engineering faculty at Shahid Beheshti University.',
    tech: ['Raspberry Pi', 'RFID', 'QR', 'React', 'PWA', 'IoT', 'REST APIs'],
    image: {
      src: '/assets/classnegar8.webp',
      alt: 'The Class Negar classroom terminal mounted on a wall: a wood-fronted enclosure housing an RFID reader and camera',
    },
    gallery: [
      {
        src: '/assets/classnegar3.webp',
        alt: 'Class Negar student home screen showing enrolled classes and a QR check-in action',
      },
      {
        src: '/assets/classnegar1.webp',
        alt: 'Class Negar progressive web app sign-in screen',
      },
    ],
    cvLine:
      'Smart classroom and attendance system (BSc thesis). Raspberry Pi terminals with RFID and time-limited QR check-in feeding a REST backend and a progressive web app. Best Thesis Project candidate, CSE faculty.',
  },
  {
    id: 'piki',
    name: 'Piki Smart Cart',
    kind: 'Product · Technical lead',
    year: '2021 – 2024',
    featured: true,
    // Covered by the Hasin Technology role on the CV; kept off it to save space.
    cv: false,
    tagline: 'Self-checkout shopping cart for retail stores, using IoT sensors and computer vision.',
    problem:
      'Supermarket checkout queues are the slowest part of the shopping trip, and retrofitting full self-checkout infrastructure into an existing store is expensive.',
    role: 'Technical Lead within the Hasin Technology Startup Studio.',
    engineering:
      'An IoT retail prototype combining live sensor data, sensor fusion and computer vision, with Linux scripting and microservices integration.',
    outcome: 'Built and trialled in-store as a working retail prototype.',
    tech: ['IoT integration', 'Sensor fusion', 'Computer vision', 'Linux', 'C#', 'REST APIs'],
    image: {
      src: '/assets/pikicart1.webp',
      alt: 'Piki Smart Cart terminal mounted on a shopping trolley in a store, showing a scanned product',
    },
    cvLine:
      'Self-checkout smart shopping cart for retail. Technical lead for a cart-mounted terminal using weight sensors and computer vision for item recognition and fraud detection.',
  },
  {
    id: 'infrafund-project',
    name: 'InfraFund',
    kind: 'Web3 platform',
    year: '2024',
    url: 'https://infrafund.net',
    featured: false,
    cv: false,
    tagline: 'Web3 crowdfunding platform for NetZero and renewable-infrastructure projects.',
    problem:
      'Renewable-infrastructure projects struggle to reach retail investors through conventional financing channels.',
    role: 'Software Engineer (remote, London).',
    engineering:
      'TypeScript and React frontend engineering, API integration and real-time investor analytics interfaces.',
    outcome: 'Platform live at infrafund.net.',
    tech: ['TypeScript', 'React', 'REST APIs', 'Data analytics'],
    image: {
      src: '/assets/infrafund1.webp',
      alt: 'InfraFund platform home page',
    },
  },
  {
    id: 'perspective',
    name: 'Perspective Design',
    kind: 'Client project',
    year: '2024',
    url: 'https://perspectivedesign.co',
    featured: false,
    cv: false,
    tagline: 'Portfolio site for an architecture and design studio in Muscat, Oman.',
    problem:
      'An architecture studio needed to present built and in-progress work, and to keep publishing it without a developer in the loop.',
    role: 'Sole engineer — design implementation, front end, CMS and deployment.',
    engineering:
      'A headless Strapi CMS models projects, products and media; the front end renders the studio\'s editorial grid with responsive imagery.',
    outcome: 'Live at perspectivedesign.co and maintained by the studio itself.',
    tech: ['Strapi', 'Node.js', 'TypeScript', 'React', 'Docker'],
    image: {
      src: '/assets/perspectivedesign-preview.webp',
      alt: 'Perspective Design studio website showing a grid of architecture projects',
    },
  },
];

export const skills = resume.skills.map(([group, items]) => ({ group, items }));

export const education = [
  {
    id: 'cau',
    institution: 'Christian-Albrechts-Universität zu Kiel (CAU)',
    shortName: 'Kiel University',
    degree: 'MSc Computer Science',
    period: '2026 – present',
    start: '2026',
    end: null,
    location: 'Kiel, Germany',
    current: true,
    notes: ['English-taught Master\'s programme in Computer Science.'],
  },
  {
    id: 'sbu',
    institution: 'Shahid Beheshti University',
    shortName: 'Shahid Beheshti University',
    degree: 'BSc Computer Engineering',
    period: 'Sep 2019 – Aug 2024',
    start: '2019-09',
    end: '2024-08',
    location: 'Tehran, Iran',
    current: false,
    grade: 'GPA 17.27 / 20 (German equiv. ~1.8 — Good/Very Good)',
    notes: [
      'Thesis: Class Negar — Smart Classroom & Attendance System (Raspberry Pi, RFID, QR attendance, PWA). Best Thesis Project candidate in the CSE faculty.',
      'Supervisor: Dr. Mojtaba Vahidi-Asl.',
    ],
  },
];

export const certifications = [
  {
    name: 'Certified Scrum Professional',
    issuer: 'Scrum Alliance',
    date: 'December 2023',
    id: '001605847',
  },
  {
    name: 'JavaCup Certified Java Programmer',
    issuer: 'JavaCup',
    date: 'October 2020',
  },
];

export const languages = [
  { name: 'English', level: 'C1 (Full Professional Proficiency)' },
  { name: 'German', level: 'A2 (Actively studying)' },
  { name: 'Persian', level: 'Native' },
];

/** Numbers shown in the hero strip. Each must be derivable from the data above. */
export const facts = [
  { value: '5+', label: 'years building production software' },
  { value: 'Backend', label: 'APIs and full-stack systems' },
  { value: 'MSc', label: 'Computer Science, Kiel University' },
  { value: 'Kiel', label: 'based in Germany' },
];

export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
];
