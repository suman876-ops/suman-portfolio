/* ============================================================================
 * data.js — all site content lives here, as a plain JavaScript object.
 * Change the values below and the whole site updates.
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

  projects: [
    {
      title: "Portfolio Website", category: "Personal / Web", status: "Deployed",
      desc: "A responsive personal portfolio with an animated dark UI, smooth scroll and a Three.js 3D background.",
      longDesc: "A fully responsive portfolio featuring a Three.js 3D background, animated reveals, a project detail modal and a command palette. The codebase is split by language — HTML markup, a CSS design system, and ES modules for content, UI logic and the 3D scene — plus Node.js and Python static servers.",
      tags: ["HTML", "CSS", "JavaScript"], link: "https://github.com/suman876-ops/suman-portfolio"
    },
    {
      title: "E-Commerce Store", category: "Full Stack", status: "Deployed",
      desc: "Product catalogue, cart and checkout with secure authentication and an admin dashboard for orders.",
      longDesc: "An end-to-end store with a product catalogue, search and filters, a persistent cart, secure JWT authentication and a checkout flow. Includes an admin dashboard to manage products, stock and orders, plus order confirmation emails.",
      tags: ["React", "Node.js", "MongoDB"], link: ""
    },
    {
      title: "Task Manager App", category: "Web App", status: "Deployed",
      desc: "A productivity app with projects, due dates, drag-and-drop boards and real-time sync across devices.",
      longDesc: "A kanban-style productivity tool with multiple boards, drag-and-drop tasks, due dates and labels. Data syncs in real time across devices, and the UI stays snappy with optimistic updates and keyboard shortcuts.",
      tags: ["Next.js", "PostgreSQL", "Tailwind"], link: ""
    },
    {
      title: "Blog Platform", category: "Full Stack", status: "Deployment Pending",
      desc: "A publishing platform with a rich editor, tags, comments and SEO-friendly server-rendered pages.",
      longDesc: "A content platform with a markdown-rich editor, tags, comments and server-rendered, SEO-friendly pages. Supports drafts, scheduled publishing and role-based access for authors and editors.",
      tags: ["Next.js", "Express", "PostgreSQL"], link: ""
    }
  ]
};

/* Accent colour themes — each one drives both the CSS variables and the 3D scene. */
export const THEMES = {
  cyan:    { cyan: "#3ee6ff", mag: "#a974ff", pink: "#ff4d9d", lime: "#8affc1", hex: 0x3ee6ff, hex2: 0xa974ff },
  violet:  { cyan: "#b98bff", mag: "#7c5cff", pink: "#ff6bd6", lime: "#9dffd0", hex: 0xb98bff, hex2: 0x7c5cff },
  emerald: { cyan: "#4dffb8", mag: "#39d0ff", pink: "#a6ff5c", lime: "#c8ffe0", hex: 0x4dffb8, hex2: 0x39d0ff },
  amber:   { cyan: "#ffc24d", mag: "#ff7a59", pink: "#ff4d6d", lime: "#ffe6a6", hex: 0xffc24d, hex2: 0xff7a59 }
};
