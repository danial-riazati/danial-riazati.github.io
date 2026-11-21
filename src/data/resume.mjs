/** Resume-specific facts from the existing profile and Danial's clarifications.
 * Role-specific technology lists describe use in that role. General skills
 * are kept separate when the employer or project was not specified.
 * Copilot Studio and Power Automate use has not been confirmed.
 */
export const resume = {
  headline: 'Software Engineer | Data Analytics & AI',
  summary: '5+ years in software engineering. Backend and full-stack systems, data analysis, reporting and AI agents. MSc Computer Science student at Kiel University (CAU).',
  workAuthorization: {
    workingStudent: 'Based in Germany on a §16b student residence permit. Available for Working Student roles up to 20 hours/week during lectures.',
    fullTime: 'With a qualifying job offer and my recognized BSc in Computer Engineering, I can apply to switch to an EU Blue Card (§18g) or a skilled-worker residence permit (§18b), subject to approval.',
  },
  skills: [
    ['Backend', ['C# / .NET', 'Node.js', 'Python', 'REST APIs']],
    ['Frontend', ['TypeScript / JavaScript', 'React', 'Next.js', 'Flutter']],
    ['Data & reporting', ['SQL', 'pandas / NumPy', 'Data preparation & analysis', 'Power BI', 'Data visualisation']],
    ['Databases', ['PostgreSQL', 'SQL Server', 'MySQL', 'MongoDB', 'Redis']],
    ['Architecture', ['Clean Architecture', 'Microservices integration', 'API security']],
    ['Delivery & observability', ['Docker', 'Linux', 'Git / CI/CD', 'ELK Stack', 'Automated testing']],
    ['AI & IoT', ['Agentic AI', 'IoT integration', 'Sensor fusion', 'Computer vision']],
    ['Microsoft Office', ['Advanced Excel', 'Word', 'PowerPoint']],
  ],
  roles: {
    eyvan: {
      context: 'Hotel ERP, hospitality & tourism platform',
      groups: [
        ['Backend', ['C# / .NET', 'SQL Server', 'REST APIs', 'Clean Architecture']],
        ['Frontend', ['TypeScript', 'React', 'Next.js']],
        ['Data & reporting', ['Python', 'Power BI', 'ERP reporting', 'Data analysis & visualisation']],
        ['Integration & security', ['Redis', 'RabbitMQ', 'API security']],
        ['Delivery & monitoring', ['Docker', 'Linux', 'GitLab CI/CD', 'ELK Stack', 'Automated testing']],
      ],
    },
    freelance: {
      context: 'International client applications',
      groups: [
        ['Technologies', ['TypeScript', 'React / Next.js', 'Node.js', 'Strapi CMS', 'Docker']],
        ['Focus', ['API integration', 'Content management']],
      ],
    },
    infrafund: {
      context: 'Frontend engineering & analytics interfaces',
      groups: [
        ['Technologies', ['TypeScript', 'React', 'REST APIs']],
        ['Focus', ['API integration', 'Analytics interfaces']],
      ],
    },
    hasin: {
      context: 'Backend engineering & Piki Smart Cart',
      groups: [
        ['Backend', ['C# / .NET', 'SQL Server', 'Redis', 'REST APIs', 'Docker / Linux', 'Monitoring']],
        ['Piki Smart Cart', ['IoT integration', 'Sensor fusion', 'Computer vision', 'Microservices integration']],
      ],
    },
    'sbu-ta': {
      context: 'Teaching assistance & faculty research projects',
      groups: [
        ['Research', ['Python', 'Data preparation & analysis', 'Research scripting']],
        ['Teaching', ['Java / C++', 'Programming', 'Algorithms', 'Web technologies']],
      ],
    },
    radin: {
      context: 'Software engineering internship programme',
      groups: [
        ['Focus', ['Technical mentoring', 'Software engineering', 'Project delivery']],
      ],
    },
  },
  projects: [
    ['Avan Persian Date Picker', '2025', ['TypeScript / React', 'npm: @avan-persian/react', 'Component architecture', 'Automated testing']],
    ['Class Negar - BSc thesis', '2023 - 2024', ['IoT integration', 'Raspberry Pi', 'Linux scripting', 'REST APIs', 'React']],
  ],
};

export const resumeVariants = {
  general: {
    path: '/cv/',
    label: 'General CV',
    filename: 'Danial_Riazati_CV.pdf',
    folderFilename: 'Danial_Riazati_General_CV.pdf',
    headline: resume.headline,
    summary: resume.summary,
    description: 'Software engineering, data analytics and AI. Python, TypeScript, C#/.NET, React, Power BI and Docker. Kiel, Hamburg and Germany-wide.',
    skillOrder: [],
    groupOrder: [],
    firstRoles: ['eyvan', 'freelance', 'infrafund'],
  },
  data: {
    path: '/cv/data/',
    label: 'Data Analytics CV',
    filename: 'Danial_Riazati_Data_CV.pdf',
    folderFilename: 'Danial_Riazati_Data_CV.pdf',
    headline: 'Data Analyst | Python, SQL & Power BI',
    summary: 'Software engineer with 5+ years of experience and practical work in data analysis and reporting. Python, SQL, Power BI and advanced Excel. MSc Computer Science student at Kiel University (CAU).',
    description: 'Data analytics CV with Python, SQL, pandas, NumPy, Power BI and Excel. Research and ERP reporting experience. Kiel, Hamburg and Germany-wide.',
    skillOrder: ['Data & reporting', 'Databases', 'Microsoft Office', 'Backend', 'AI & IoT'],
    groupOrder: ['Data & reporting', 'Research', 'Focus', 'Frontend'],
    firstRoles: ['eyvan', 'freelance', 'infrafund'],
  },
  backend: {
    path: '/cv/backend/',
    label: 'Backend CV',
    filename: 'Danial_Riazati_Backend_CV.pdf',
    folderFilename: 'Danial_Riazati_Backend_CV.pdf',
    headline: 'Backend Software Engineer | .NET, Node.js & Python',
    summary: 'Software engineer with 5+ years of production experience. Backend architecture, REST APIs, database integration, caching, automated testing and deployment. MSc Computer Science student at Kiel University (CAU).',
    description: 'Backend engineering CV with C#/.NET, Node.js, Python, REST APIs, SQL, Redis, Docker and CI/CD. Kiel, Hamburg and Germany-wide.',
    skillOrder: ['Backend', 'Architecture', 'Databases', 'Delivery & observability'],
    groupOrder: ['Backend', 'Integration & security', 'Delivery & monitoring'],
    firstRoles: ['eyvan', 'freelance', 'infrafund'],
  },
  frontend: {
    path: '/cv/frontend/',
    label: 'Frontend CV',
    filename: 'Danial_Riazati_Frontend_CV.pdf',
    folderFilename: 'Danial_Riazati_Frontend_CV.pdf',
    headline: 'Frontend Software Engineer | React, Next.js & TypeScript',
    summary: 'Software engineer with 5+ years of experience across production web applications. TypeScript, React, Next.js, API integration and reusable components. MSc Computer Science student at Kiel University (CAU).',
    description: 'Frontend engineering CV with TypeScript, JavaScript, React, Next.js, Flutter, API integration and automated testing. Kiel, Hamburg and Germany-wide.',
    skillOrder: ['Frontend', 'Backend', 'Delivery & observability', 'Architecture'],
    groupOrder: ['Frontend', 'Technologies', 'Focus'],
    firstRoles: ['eyvan', 'freelance', 'infrafund'],
    projectOrder: ['Avan Persian Date Picker', 'Class Negar - BSc thesis'],
  },
  werkstudent: {
    path: '/cv/werkstudent/',
    label: 'Working Student IT CV',
    filename: 'Danial_Riazati_Werkstudent_CV.pdf',
    folderFilename: 'Danial_Riazati_Working_Student_IT_CV.pdf',
    headline: 'MSc Computer Science Student | IT & Software Engineering',
    summary: 'MSc Computer Science student at Kiel University (CAU), seeking a Working Student role in IT, software engineering or data analysis. Available immediately in Kiel, Hamburg or remotely within Germany, for approximately 12 months. 5+ years of software engineering experience.',
    description: 'Working Student IT and software engineering CV. CAU Kiel MSc student with Python, C#/.NET, TypeScript, React, SQL and Power BI skills.',
    educationFirst: true,
    skillOrder: ['Backend', 'Frontend', 'Data & reporting', 'Delivery & observability', 'Microsoft Office'],
    groupOrder: [],
    firstRoles: ['eyvan'],
  },
};

/** Stable prioritisation keeps unranked groups in their original order. */
export function prioritise(items, order, key = item => item[0]) {
  const rank = item => {
    const index = order.indexOf(key(item));
    return index < 0 ? order.length : index;
  };
  return [...items].sort((left, right) => rank(left) - rank(right));
}
