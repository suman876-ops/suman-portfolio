/* ============================================================================
 * data.js — all site content lives here, as a plain JavaScript object.
 * Change the values below and the whole site updates.
 *
 * NOTE ON HONESTY
 * ---------------
 * `live` and `github` are only filled in with URLs that were actually
 * checked. Where a project has no verified live deployment, `live` is an
 * empty string and the card shows "Live Demo Coming Soon" instead of a link.
 * Where no public repository is known, `github` is empty and the card shows
 * "Source Code Not Publicly Available". Nothing here is a guessed URL.
 *
 * `techVerified: false` means the stack has not been confirmed against the
 * real implementation yet — the card labels those chips as unconfirmed.
 * ==========================================================================*/

export const DATA = {
  brand: "SUMAN<b>.dev</b>",
  name: "Suman Mahata",
  nameUpper: "SUMAN",
  roleShort: "FULL STACK DEV",
  roles: ["FULL STACK DEV", "WEB ENGINEER", "PROBLEM SOLVER"],
  heroTag: "Digital Portfolio",
  tagline: "Building fast, scalable and purposeful web experiences — from database to pixel.",
  coordinates: "22.45° N / 86.99° E",
  status: "AVAILABLE FOR FREELANCE",
  statusShort: "Available",
  focus: "Full Stack Development",
  accent: "cyan",

  aboutText:
    "I'm a Full Stack Developer who enjoys turning ideas into clean, fast and reliable web products. I like working across the whole stack — from designing a friendly interface to structuring the data and APIs that power it.\n" +
    "I care about the details that make software feel effortless: readable code, thoughtful UX and performance that holds up under real use. Every project is a chance to learn something new, so I build, break and rebuild until it feels right.",

  location: "Jhargram<br>West Bengal, India",
  locationShort: "Jhargram, West Bengal",
  locationTz: "IST +5:30",
  locationUtc: "UTC+05:30 IST",

  protocols: [
    "Full Stack Developer", "Curious Builder", "Problem Solver",
    "Continuous Learner", "Detail-Oriented", "Team Player"
  ],

  email: "sumanmahata711@gmail.com",
  githubUser: "suman876-ops",
  github: "https://github.com/suman876-ops",
  linkedin: "https://www.linkedin.com/in/suman-mahata-067a76327",
  twitter: "https://x.com/m79235_suman",
  latency: "24–48 Hours",

  marquee: [
    "FULL STACK DEVELOPMENT", "REACT", "NEXT.JS", "NODE.JS",
    "TYPESCRIPT", "TAILWIND CSS", "UI / UX", "MOTION"
  ],

  stats: [
    { value: 20, suffix: "+", label: "Projects Built" },
    { value: 15, suffix: "+", label: "Technologies" },
    { value: 3, suffix: "+", label: "Years Coding" },
    { value: 100, suffix: "%", label: "Commitment" }
  ],

  timeline: [
    {
      year: "2026 – Present", tag: "education",
      role: "BCA — Computer Application", org: "Midnapore City College",
      desc: "Currently pursuing a Bachelor of Computer Applications, focusing on programming, web development, and software engineering.",
      tags: ["Programming", "Web Development", "Software Engineering"]
    },
    {
      year: "2026", tag: "education",
      role: "Higher Secondary", org: "WBCHSE — West Bengal Council of Higher Secondary Education",
      desc: "Completed Higher Secondary education with Computer Application as a subject.",
      tags: ["Computer Application"]
    },
    {
      year: "2024", tag: "education",
      role: "Secondary", org: "WBBSE — West Bengal Board of Secondary Education",
      desc: "Completed secondary education, building a foundation for further academic learning.",
      tags: ["Foundation"]
    },
    {
      year: "2024 – 2025", tag: "certification",
      role: "Diploma in Office Automation and Publishing (DOAP)",
      org: "Rajeev Gandhi Computer Saksharta Mission (RGCSM)",
      desc: "Professional training in office automation and publishing tools. Grade: A+",
      tags: ["Office Automation", "Publishing", "Grade A+"]
    }
  ],

  skills: [
    { name: "HTML & CSS", level: 95, code: "SYS_UI" },
    { name: "JavaScript", level: 88, code: "SYS_JS" },
    { name: "React", level: 85, code: "SYS_FRO" },
    { name: "Next.js", level: 75, code: "SYS_FRO" },
    { name: "Node.js", level: 82, code: "SYS_BAC" },
    { name: "Express", level: 80, code: "SYS_BAC" },
    { name: "MongoDB", level: 78, code: "SYS_DB" },
    { name: "PostgreSQL", level: 72, code: "SYS_DB" },
    { name: "Tailwind CSS", level: 90, code: "SYS_UI" },
    { name: "Git & GitHub", level: 85, code: "SYS_DEV" }
  ],

  /* Allowed vocabularies for projects (kept for reference and future use). */
  categories: [
    "Web Applications",
    "Student Productivity",
    "AI and Machine Learning",
    "Hackathon Projects",
    "Personal Projects"
  ],
  statuses: ["Completed", "Live", "In Development", "Prototype", "Concept", "Archived"],

  projects: [
    {
      title: "SMX — Personal College OS",
      category: "Student Productivity",
      status: "In Development",
      desc: "A personal student productivity platform with Study Hub, Notes, Assignments, Mock Tests, Skills Tracker, Calendar, Document Management and personal academic tools.",
      longDesc: "SMX is a personal college operating system: a single workspace for Study Hub, Notes, Assignments, Mock Tests, a Skills Tracker, Calendar, Document Management and other personal academic tools. A live deployment is available and reachable — the build is still in active development.",
      tech: ["React", "Vite", "Supabase", "TanStack Router"],
      techVerified: true,
      live: "https://private-record-hub.lovable.app/app",
      github: ""
    },
    {
      title: "Smart Bhumi — Land Management Platform",
      category: "Hackathon Projects",
      status: "Prototype",
      desc: "A land management concept involving land information, GIS mapping, AI/OCR-assisted document processing and land data validation.",
      longDesc: "Smart Bhumi is a land-records platform built around digitising, validating and verifying land information. It combines land information, GIS mapping, AI/OCR-assisted document processing and data validation. Built as a hackathon project and still evolving; a live prototype is deployed.",
      tech: [],
      techVerified: false,
      live: "https://smart-bhumi.ai.studio",
      github: ""
    },
    {
      title: "Apna Mess — Roommate Management App",
      category: "Web Applications",
      status: "In Development",
      desc: "A mobile-friendly PWA for two roommates, featuring electricity bills, meal tracking, shared expenses, payments, personal wallets, activity logs and offline synchronisation.",
      longDesc: "Apna Mess is a private, mobile-friendly PWA built for two roommates. It handles electricity bills, meal tracking, shared expenses, payments, personal wallets and activity logs, with offline synchronisation so it keeps working without a connection. A live deployment is available; the feature set is still growing.",
      tech: ["React", "Supabase", "PWA"],
      techVerified: false,
      techNote: "planned stack — not yet confirmed against the build",
      live: "https://dwelling-duo-fin.lovable.app",
      github: ""
    },
    {
      title: "Personal Developer Portfolio",
      category: "Personal Projects",
      status: "Live",
      desc: "A modern personal website introducing Suman Mahata, displaying skills, projects, social profiles, GitHub repositories and freelance availability.",
      longDesc: "This site — a dark, space-themed portfolio with a Three.js 3D background, animated reveals, a command palette and a project showcase. The source is split by language: HTML markup, a CSS design system, ES modules for content/UI/3D, plus Node.js and Python dev servers.",
      tech: ["HTML", "CSS", "JavaScript", "Three.js"],
      techVerified: true,
      live: "https://suman876-ops.github.io/suman-portfolio/",
      github: "https://github.com/suman876-ops/suman-portfolio"
    },
    {
      title: "Portfolio Management Platform",
      category: "Personal Projects",
      status: "Concept",
      desc: "A portfolio platform concept featuring project galleries, resume presentation, blog content, contact functionality and optional analytics.",
      longDesc: "A concept for a reusable portfolio platform: project galleries, resume presentation, blog content, contact functionality and optional analytics. No deployment or public repository exists yet.",
      tech: [],
      techVerified: false,
      live: "",
      github: ""
    },
    {
      title: "SMARTWASTE AI",
      category: "AI and Machine Learning",
      status: "Concept",
      desc: "A hackathon concept applying AI to waste management, waste classification and smarter waste-handling workflows.",
      longDesc: "A hackathon concept exploring how AI can improve waste management — automatic waste classification and smarter waste-handling workflows. Still at the idea stage: the concept landing page is live, but there is no working prototype yet.",
      tech: ["Computer Vision", "Python"],
      techVerified: false,
      image: "images/projects/smartwaste-ai.png",
      live: "https://suman876-ops.github.io/smartwaste-ai/",
      github: "https://github.com/suman876-ops/smartwaste-ai"
    },
    {
      title: "AI Legal Metrology Product Scanner",
      category: "AI and Machine Learning",
      status: "Concept",
      desc: "A project concept for scanning product labels and helping validate packaged-product information using image processing or OCR.",
      longDesc: "A concept for scanning product labels and helping validate packaged-product information — the kind of data covered by legal metrology rules — using image processing or OCR. Still at the idea stage: the concept landing page is live, but there is no working prototype yet.",
      tech: ["OCR", "Python"],
      techVerified: false,
      image: "images/projects/ai-legal-metrology-scanner.png",
      live: "https://suman876-ops.github.io/ai-legal-metrology-scanner/",
      github: "https://github.com/suman876-ops/ai-legal-metrology-scanner"
    },
    {
      title: "Personal Record Hub",
      category: "Web Applications",
      status: "Concept",
      desc: "A personal records and document management application concept involving private records, document storage and user data management.",
      longDesc: "A concept for a personal records and document management application: private records, document storage and user data management. Its development status still needs to be confirmed, and no separate public repository has been verified.",
      tech: [],
      techVerified: false,
      live: "",
      github: ""
    }
  ],

};

/* Accent colour themes — each one drives both the CSS variables and the 3D scene. */
export const THEMES = {
  cyan:    { cyan: "#3fe0ff", mag: "#9d7bff", pink: "#ff5c9e", lime: "#7dffc0", hex: 0x3fe0ff, hex2: 0x9d7bff },
  violet:  { cyan: "#b18cff", mag: "#7c5cff", pink: "#ff6bd6", lime: "#a6ffd4", hex: 0xb18cff, hex2: 0x7c5cff },
  emerald: { cyan: "#46f2b4", mag: "#38d0ff", pink: "#9bff62", lime: "#c8ffe0", hex: 0x46f2b4, hex2: 0x38d0ff },
  amber:   { cyan: "#ffc24d", mag: "#ff8a5c", pink: "#ff4d6d", lime: "#ffe6a6", hex: 0xffc24d, hex2: 0xff8a5c }
};
