/** Local review draft, based on Danial's latest confirmed experience.
 * Airflow, n8n, Kafka and DDD were confirmed for EyvanTrip.
 * Multi-agent architecture work is ongoing, with no employer or framework specified.
 * The public general CV and local review export share this content.
 */
import { resume } from './resume.mjs';

export const seniorResume = {
  ...resume,
  headline: 'Senior Software Engineer',
  summary: 'Backend-focused software engineer with 5+ years building and operating production systems. Experience spans .NET architecture, data integration and workflow automation, with technical leadership across delivery and code quality. Currently developing multi-agent systems.',
  workAuthorization: {
    workingStudent: resume.workAuthorization.workingStudent.replace('during lectures', 'during the lecture period'),
    fullTime: resume.workAuthorization.fullTime.replace('recognized', 'recognised'),
  },
  skills: [
    ['Backend', ['C#', '.NET', 'Python', 'REST APIs']],
    ['Architecture', ['System design', 'Clean Architecture', 'Domain-Driven Design', 'Service integration']],
    ['Data & messaging', ['SQL Server', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Kafka']],
    ['Delivery & observability', ['Docker', 'Linux', 'Git', 'CI/CD', 'ELK Stack', 'Integration testing', 'API security']],
    ['AI, data & automation', ['Agentic AI', 'Apache Airflow', 'n8n', 'pandas', 'NumPy', 'Power BI']],
    ['Frontend', ['TypeScript', 'React', 'Next.js']],
    ['Productivity', ['MS Office', 'Advanced Excel', 'Word', 'PowerPoint']],
  ],
  roles: {
    ...resume.roles,
    eyvan: {
      context: 'Hotel ERP and booking platform',
      highlights: [
        'Owned backend architecture and production operations for a hotel ERP and booking platform.',
        'Led code review and integration testing, and hardened API authentication and authorisation.',
      ],
      groups: [
        ['Architecture & services', ['C# / .NET', 'Clean Architecture', 'Domain-Driven Design', 'REST APIs']],
        ['Data & messaging', ['SQL Server', 'Distributed caching (Redis)', 'Asynchronous messaging (RabbitMQ, Kafka)']],
        ['Reporting & automation', ['Python', 'Power BI', 'Workflow orchestration (Airflow)', 'n8n']],
        ['Production', ['Docker', 'Linux', 'GitLab CI/CD', 'Observability (ELK Stack)', 'Automated testing']],
        ['Web application', ['TypeScript', 'React', 'Next.js']],
      ],
    },
    hasin: {
      context: 'Backend services, IoT integration and Piki Smart Cart',
      highlights: [
        'Developed and optimised backend services, with technical leadership for Piki Smart Cart.',
      ],
      groups: [
        ['Technologies', ['C# / .NET', 'SQL Server', 'Redis', 'REST APIs', 'Docker', 'Linux']],
        ['Engineering focus', ['Service integration', 'Production monitoring']],
        ['Connected systems', ['IoT integration', 'Sensor fusion', 'Live sensor data', 'Computer vision']],
      ],
    },
    freelance: {
      context: 'Client applications, API integration and deployment',
      groups: [
        ['Technologies', ['Node.js', 'Strapi CMS', 'TypeScript', 'React / Next.js', 'Docker']],
      ],
    },
    infrafund: {
      context: 'Frontend development and real-time analytics APIs',
      groups: [
        ['Technologies', ['TypeScript', 'React', 'REST APIs']],
      ],
    },
    radin: {
      context: 'Software engineering internship programme',
      groups: [
        ['Focus', ['Technical mentoring', 'Programming fundamentals', 'Project delivery']],
      ],
    },
    'sbu-ta': {
      context: 'Python research and data analysis',
      groups: [
        ['Research', ['Python', 'Data preparation & analysis', 'Python scripting']],
        ['Teaching', ['Programming', 'Algorithms']],
      ],
    },
  },
  projects: [
    ['Multi-agent systems - in development', 'Current', ['Agent coordination', 'Agentic AI']],
    ['Avan Persian Date Picker', '2025', ['Reusable React components', 'TypeScript', 'npm: @avan-persian/react', 'Automated testing']],
    ['Class Negar - BSc thesis', '2023 - 2024', ['IoT', 'Raspberry Pi', 'RFID / QR', 'Linux scripting', 'REST APIs']],
  ],
};

export const seniorVariant = {
  path: '/local-senior-draft/',
  label: 'Senior Software Engineer',
  filename: 'Danial_Riazati_Senior_Software_Engineer_Draft.pdf',
  folderFilename: 'Danial_Riazati_Senior_Software_Engineer_Draft.pdf',
  headline: seniorResume.headline,
  subtitle: 'Backend Architecture · .NET & Python · AI Systems',
  profileNote: 'Germany-based (§16b), available up to 20 hours/week during the lecture period. Full-time employment possible following approval of an EU Blue Card (§18g) or skilled-worker permit (§18b) with a qualifying offer.',
  experienceHeading: 'Relevant Engineering Experience',
  continuationHeading: 'Additional Experience',
  summary: seniorResume.summary,
  description: 'Local review draft focused on backend engineering, software architecture, AI and production operations.',
  skillOrder: [],
  groupOrder: [],
  showLeadership: true,
  roleIds: ['eyvan', 'hasin', 'freelance', 'infrafund', 'radin', 'sbu-ta'],
  firstRoles: ['eyvan'],
  educationFirst: true,
  languagesFirst: true,
  compactLanguages: true,
  photo: true,
};
