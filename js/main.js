/* ============================================================================
 * main.js — UI logic for the portfolio.
 *
 * Content comes from ./data.js, the 3D background from ./scene.js.
 * Everything else (navigation, reveals, tilt, the project grid, the GitHub
 * repository feed, modal, command palette, cursor, preloader) lives here.
 * ==========================================================================*/

import { DATA, THEMES } from "./data.js";
import { initScene } from "./scene.js";
import { BRANDS } from "./brands.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

/* Brand marks for the social buttons (24×24 paths, coloured by currentColor). */
const SOCIAL_ICONS = {
  GitHub: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
  LinkedIn: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  Twitter: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>'
};

/* Line icons — one consistent 24x24 stroke set, coloured by currentColor. */
const ICONS = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><rect x="2.5" y="4.75" width="19" height="14.5" rx="2.6"/><path d="m3.4 6.9 7.75 5.7a1.5 1.5 0 0 0 1.7 0l7.75-5.7"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><path d="M12 21.5s7.2-5.9 7.2-11.2A7.2 7.2 0 0 0 4.8 10.3c0 5.3 7.2 11.2 7.2 11.2Z"/><circle cx="12" cy="10.2" r="2.7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.1 1.9"/></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><path d="M13.2 2.6 4.6 13.3a.55.55 0 0 0 .43.9h6.1l-1.33 7.2a.55.55 0 0 0 .98.42l8.6-10.7a.55.55 0 0 0-.43-.9h-6.1l1.33-7.2a.55.55 0 0 0-.98-.42Z"/></svg>',
  spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><path d="M11 3.2 12.7 8l4.8 1.7-4.8 1.7L11 16.2 9.3 11.4 4.5 9.7 9.3 8 11 3.2Z"/><path d="M18 14.5l.85 2.25L21.1 17.6l-2.25.85L18 20.7l-.85-2.25L14.9 17.6l2.25-.85L18 14.5Z"/></svg>',
  "arrow-right": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9"><path d="M4.5 12h14.5"/><path d="m13 6 6 6-6 6"/></svg>',
  "arrow-up": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.9"><path d="M12 19.5V5"/><path d="m6 11 6-6 6 6"/></svg>',
  external: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M13.5 4.5h6v6"/><path d="M19.5 4.5 11.2 12.8"/><path d="M18 14.2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.8"/></svg>',
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="m9 7.5-5 4.5 5 4.5"/><path d="m15 7.5 5 4.5-5 4.5"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><circle cx="11" cy="11" r="6.6"/><path d="m16.2 16.2 4.3 4.3"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M20.4 12a8.4 8.4 0 1 1-2.5-6"/><path d="M20.4 4.6V10h-5.4"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7"><path d="M20.6 13.4 13.4 20.6a1.9 1.9 0 0 1-2.7 0l-7.3-7.3a1.9 1.9 0 0 1-.55-1.35V4.6c0-.6.5-1.1 1.1-1.1h7.35c.5 0 .99.2 1.35.55l7.3 7.3a1.9 1.9 0 0 1 0 2.7Z"/><circle cx="7.6" cy="7.6" r="1.35"/></svg>',
  hash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"><path d="M9.6 3.5 7.4 20.5"/><path d="M16.6 3.5l-2.2 17"/><path d="M4.2 8.8h15.6"/><path d="M3.6 15.2h15.6"/></svg>',
};

function applyIcons(root) {
  (root || document).querySelectorAll("[data-icon]").forEach((el) => {
    const svg = ICONS[el.getAttribute("data-icon")];
    if (svg) el.innerHTML = svg;
  });
}

let scene3d = null; // set once the 3D scene is ready

/* ---------- theme ---------- */
function applyTheme(name) {
  const t = THEMES[name] || THEMES.cyan;
  const r = document.documentElement.style;
  r.setProperty("--cyan", t.cyan);
  r.setProperty("--mag", t.mag);
  r.setProperty("--pink", t.pink);
  r.setProperty("--lime", t.lime);
  if (scene3d) scene3d.setColors(t.hex, t.hex2);
}

/* ---------- generic bindings ---------- */
/* ---------- skills cards ---------- */
const SKILL_BRAND = {
  "HTML & CSS": "html5", "JavaScript": "javascript", "React": "react",
  "Next.js": "nextdotjs", "Node.js": "nodedotjs", "Express": "express",
  "MongoDB": "mongodb", "PostgreSQL": "postgresql", "Tailwind CSS": "tailwindcss",
  "Git & GitHub": "github"
};

/* the bar is tinted by the skill's family, not by the brand */
const SKILL_TINT = {
  SYS_UI: "var(--cyan)", SYS_FRO: "var(--cyan)", SYS_JS: "var(--cyan)",
  SYS_BAC: "var(--mag)", SYS_DB: "var(--mag)",
  SYS_DEV: "var(--lime)", SYS_DES: "var(--pink)"
};

/* a near-black brand colour would disappear on the dark card */
function readableBrand(hex) {
  const h = String(hex).replace("#", "");
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 70 ? "currentColor" : hex;
}

function renderSkillsCards() {
  const list = DATA.skills || [];
  const host = $("#skillsWrap");
  if (!host) return;

  host.innerHTML = list.map((s) => {
    const brand = BRANDS[SKILL_BRAND[s.name]];
    const mark = brand
      ? `<svg viewBox="0 0 24 24" aria-hidden="true" style="color:${readableBrand(brand.hex)}">${brand.svg}</svg>`
      : "";
    const lvl = clamp(Number(s.level) || 0, 0, 100);
    return `
      <article class="skcard reveal" style="--tint:${SKILL_TINT[s.code] || "var(--cyan)"}">
        <div class="skhead">
          <span class="skico">${mark}</span>
          <span class="skcode">${esc(s.code || "SYS")}</span>
        </div>
        <h3 class="skname">${esc(s.name)}</h3>
        <div class="skmeta"><span>Proficiency</span><b>${lvl}%</b></div>
        <div class="skbar" data-lvl="${lvl}"><i></i></div>
      </article>`;
  }).join("");

  initSkillBars();
}

function initSkillBars() {
  const bars = $$(".skbar");
  // widths are set up front so the cards read correctly even if nothing animates
  bars.forEach((el) => {
    const i = el.querySelector("i");
    if (i) i.style.width = (el.getAttribute("data-lvl") || 0) + "%";
  });
  if (typeof IntersectionObserver !== "function") return;

  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const i = e.target.querySelector("i");
    if (!i) return;
    const lvl = e.target.getAttribute("data-lvl") || "0";
    i.style.transition = "none";
    i.style.width = "0";
    requestAnimationFrame(() => { i.style.transition = ""; i.style.width = lvl + "%"; });
  }), { threshold: 0.4 });
  bars.forEach((el) => io.observe(el));
}

function renderBindings() {
  $$("[data-bind]").forEach((el) => {
    const k = el.getAttribute("data-bind");
    const v = DATA[k];
    if (v === undefined) return;
    if (k === "brand") { el.innerHTML = v; return; }
    el.innerHTML = String(v);
  });
  $$("[data-href]").forEach((el) => {
    if (el.getAttribute("data-href") === "mailto") el.href = "mailto:" + DATA.email;
  });

  $("#aboutParas").innerHTML = String(DATA.aboutText)
    .split(/\n\s*\n|\n/).filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`).join("");

  $("#protocols").innerHTML = (DATA.protocols || [])
    .map((p) => `<span class="chip">${esc(p)}</span>`).join("");

  $("#stats").innerHTML = (DATA.stats || []).map((s) => `
    <div class="stat">
      <div class="v"><span class="cnt" data-to="${esc(s.value)}">${esc(s.value)}</span>${esc(s.suffix || "")}</div>
      <div class="l">${esc(s.label)}</div>
    </div>`).join("");

  const items = (DATA.marquee || []).map((m) => `<span class="it">${esc(m)}</span>`).join("");
  $("#marquee").innerHTML = items + items; // duplicated for a seamless loop

  $("#timeline").innerHTML = '<span class="tl-line" aria-hidden="true"><i></i></span>' +
    (DATA.timeline || []).map((it) => `
    <div class="item reveal">
      <div class="top">${it.year ? `<span class="yr">${esc(it.year)}</span>` : ""}<span class="tag">${esc(it.tag)}</span></div>
      <h3>${esc(it.role)}</h3>
      ${it.org ? `<div class="org">// ${esc(it.org)}</div>` : ""}
      ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
      <div class="chips">${(it.tags || []).map((t) => `<span class="chip"><span class="ico">${ICONS.hash}</span>${esc(t)}</span>`).join("")}</div>
    </div>`).join("");

  renderSkillsCards();

  const socials = [["GitHub", DATA.github], ["LinkedIn", DATA.linkedin], ["Twitter", DATA.twitter]]
    .filter((s) => s[1]);
  $("#socials").innerHTML = socials
    .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener" aria-label="${esc(n)}">${SOCIAL_ICONS[n] || ""}<span>${esc(n)}</span></a>`).join("");

  applyTheme(DATA.accent);

  /* these elements were just (re)created above, so (re)wire their behaviour */
  initCounters();
  bindMagnetic();
}

/* ============================================================================
 * PROJECTS — the card grid
 * ==========================================================================*/

let visibleProjects = [];   // the indices currently shown (used by the modal)

function projectCard(p, i) {
  const pending = /pending/i.test(p.status);
  const techChips = (p.tech || []).length
    ? (p.tech || []).map((t) => `<span class="${p.techVerified ? "" : "unconfirmed"}" title="${p.techVerified ? "" : "Stack not yet confirmed"}">${esc(t)}</span>`).join("")
    : `<span class="unconfirmed">Stack to be confirmed</span>`;

  const liveBtn = p.live
    ? `<a class="pact live" href="${esc(p.live)}" target="_blank" rel="noopener noreferrer" aria-label="Open the live demo of ${esc(p.title)}">Live Demo <span class="ico">${ICONS.external}</span></a>`
    : `<span class="pact off" aria-disabled="true" title="No verified live deployment yet">Live Demo Coming Soon</span>`;

  const srcBtn = p.github
    ? `<a class="pact src" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="Open the source code of ${esc(p.title)} on GitHub">Source Code <span class="ico">${ICONS.code}</span></a>`
    : `<span class="pact off" aria-disabled="true" title="No public repository verified for this project">Source Code Not Publicly Available</span>`;

  const shot = p.image
    ? `<figure class="pshot"><img src="${esc(p.image)}" alt="Preview of ${esc(p.title)}" loading="lazy" decoding="async"></figure>`
    : "";

  return `
    <article class="proj tilt reveal" data-tilt="7" data-p="${i}">
      ${shot}
      <div class="ph">
        <span>System_View_${String(i + 1).padStart(2, "0")}</span>
        <span class="st ${pending ? "pend" : ""}">${esc(p.status)}</span>
      </div>
      <h3>${esc(p.title)}</h3>
      <div class="cat">${esc(p.category)}</div>
      <p>${esc(p.desc)}</p>
      <div class="tags">${techChips}</div>
      <div class="proj-actions">
        ${liveBtn}
        ${srcBtn}
        <button class="pact detail" data-detail="${i}" aria-label="View details of ${esc(p.title)}">View Details <span class="ico">${ICONS.eye}</span></button>
      </div>
      <span class="idx">${String(i + 1).padStart(2, "0")}</span>
    </article>`;
}

/* a broken preview should disappear, not show a broken-image icon */
$("#projectsWrap").addEventListener("error", (e) => {
  if (e.target && e.target.tagName === "IMG") {
    const fig = e.target.closest("figure");
    if (fig) fig.style.display = "none";
  }
}, true);

function renderProjects() {
  const all = DATA.projects || [];
  visibleProjects = all.map((_, i) => i);

  $("#projectsWrap").innerHTML = all.length
    ? all.map((p, i) => projectCard(p, i)).join("")
    : `<div class="no-results">No projects to show yet.</div>`;

  observeReveals();
  bindTilt();
}

/* ============================================================================
 * MODAL
 * ==========================================================================*/
const modal = $("#modal");

function openProject(i) {
  const p = (DATA.projects || [])[i];
  if (!p) return;
  $("#mCat").textContent = p.category || "";
  $("#mTitle").textContent = p.title || "";
  $("#mSt").textContent = p.status || "";
  $("#mDesc").textContent = p.longDesc || p.desc || "";

  const tech = (p.tech || []).length
    ? (p.tech || []).map((t) => `<span class="${p.techVerified ? "" : "unconfirmed"}">${esc(t)}</span>`).join("")
    : `<span class="unconfirmed">Stack to be confirmed</span>`;
  $("#mTags").innerHTML = tech;

  const shot = $("#mShot"), shotImg = $("#mShotImg");
  if (shot && shotImg) {
    if (p.image) {
      shotImg.src = p.image;
      shotImg.alt = "Preview of " + (p.title || "");
      shot.hidden = false;
    } else {
      shotImg.removeAttribute("src");
      shot.hidden = true;
    }
  }

  const live = $("#mLive"), src = $("#mSource");
  if (p.live) { live.style.display = "inline-flex"; live.href = p.live; } else live.style.display = "none";
  if (p.github) { src.style.display = "inline-flex"; src.href = p.github; } else src.style.display = "none";
  if (!p.live) $("#mNoLive").style.display = "block"; else $("#mNoLive").style.display = "none";

  modal.classList.add("on");
}

document.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) { modal.classList.remove("on"); return; }
  const detail = e.target.closest("[data-detail]");
  if (detail) { openProject(+detail.getAttribute("data-detail")); return; }
  // clicking the card body (but not a link/button) also opens details
  const card = e.target.closest(".proj");
  if (card && !e.target.closest("a") && !e.target.closest("button")) {
    openProject(+card.getAttribute("data-p"));
  }
});

/* ---------- typewriter ---------- */
let tIdx = 0, tChar = 0, del = false;
function type() {
  const roles = (DATA.roles && DATA.roles.length) ? DATA.roles : ["FULL STACK DEV"];
  const cur = roles[tIdx % roles.length];
  const el = $("#typed");
  if (!el) return;
  if (!del) {
    tChar++;
    el.textContent = cur.slice(0, tChar);
    if (tChar >= cur.length) { del = true; return setTimeout(type, 1500); }
  } else {
    tChar--;
    el.textContent = cur.slice(0, tChar);
    if (tChar <= 0) { del = false; tIdx++; return setTimeout(type, 320); }
  }
  setTimeout(type, del ? 45 : 90);
}

/* ---------- scroll-triggered effects ---------- */
let io;
function observeReveals() {
  if (io) io.disconnect();
  io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));
}

function initCounters() {
  // the final numbers are already rendered, so they stay correct even if the
  // observer never fires — we only play the count-up when a stat scrolls in
  if (typeof IntersectionObserver !== "function") return;
  const co = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    co.unobserve(el);
    const to = parseFloat(el.getAttribute("data-to")) || 0;
    const t0 = performance.now(), dur = 1200;
    (function step(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = to;
    })(t0);
  }), { threshold: 0.4 });
  $$(".cnt").forEach((el) => co.observe(el));
}

/* ---------- 3D tilt + magnetic buttons ---------- */
function bindTilt() {
  $$("[data-tilt]").forEach((el) => {
    if (el.__tilt) return;
    el.__tilt = 1;
    const max = parseFloat(el.getAttribute("data-tilt")) || 8;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

function bindMagnetic() {
  if (window.matchMedia("(hover:none)").matches) return;
  $$(".mag").forEach((el) => {
    if (el.__mag) return;
    el.__mag = 1;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.28}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

$("#scanBtn").addEventListener("click", () => {
  $$(".skbar").forEach((el, n) => setTimeout(() => {
    const i = el.querySelector("i");
    if (!i) return;
    const lvl = el.getAttribute("data-lvl") || "0";
    i.style.transition = "none";
    i.style.width = "0";
    requestAnimationFrame(() => { i.style.transition = ""; i.style.width = lvl + "%"; });
  }, n * 70));
});

/* ---------- nav + scroll progress ---------- */
const nav = $("#nav");
/* ---------- education timeline: the line draws itself as you scroll ---------- */
function updateTimeline() {
  const tl = $("#timeline");
  if (!tl) return;
  const fill = tl.querySelector(".tl-line i");
  if (!fill) return;
  const items = [...tl.querySelectorAll(".item")];

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    fill.style.height = "100%";
    items.forEach((el) => el.classList.add("on"));
    return;
  }

  const r = tl.getBoundingClientRect();
  const vh = window.innerHeight || 800;
  const start = vh * 0.86;   // the draw begins here (viewport-relative)
  const end = vh * 0.34;     // and finishes here
  const span = start - end;
  const p = clamp((start - r.top) / (r.height + span), 0, 1);

  fill.style.height = (p * 100).toFixed(2) + "%";

  // a node lights up once the tip of the line has passed it
  const tip = r.top + p * r.height;
  items.forEach((el) => el.classList.toggle("on", el.getBoundingClientRect().top + 13 <= tip));
}

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 30);
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  $("#progress").style.width = (docH > 0 ? clamp(y / docH, 0, 1) * 100 : 0) + "%";
  $("#toTop").classList.toggle("on", y > 600);
  let cur = "";
  for (const s of $$("section[id]")) if (y >= s.offsetTop - 140) cur = s.id;
  $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  updateTimeline();
  if (scene3d) scene3d.onScroll(y);
}
window.addEventListener("scroll", onScroll, { passive: true });
$("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
$("#menuBtn").addEventListener("click", () => $("#navlinks").classList.toggle("open"));
$$(".nav-links a").forEach((a) => a.addEventListener("click", () => $("#navlinks").classList.remove("open")));

/* ---------- copy email ---------- */
const cp = $("#copyEmail");
cp.addEventListener("click", () => {
  if (navigator.clipboard) navigator.clipboard.writeText(DATA.email);
  cp.textContent = "Copied ✓";
  setTimeout(() => { cp.textContent = "Copy"; }, 1400);
});

/* ---------- contact form ---------- */
$("#contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const subject = encodeURIComponent("Portfolio enquiry from " + d.get("name"));
  const body = encodeURIComponent(d.get("msg") + "\n\n— " + d.get("name") + " (" + d.get("email") + ")");
  window.location.href = "mailto:" + DATA.email + "?subject=" + subject + "&body=" + body;
});

/* ---------- command palette ---------- */
const cmd = $("#cmd"), cmdInput = $("#cmdInput"), cmdList = $("#cmdList");
const COMMANDS = [
  { t: "Go to Home", s: "section", k: "home" },
  { t: "Go to About", s: "section", k: "about" },
  { t: "Go to Skills", s: "section", k: "skills" },
  { t: "Go to Projects", s: "section", k: "projects" },
  { t: "Go to Contact", s: "section", k: "contact" },
  { t: "Copy email address", s: "action", k: "copy" },
  { t: "Cycle accent theme", s: "action", k: "theme" },
  { t: "Scroll to top", s: "action", k: "top" }
];
let cmdSel = 0;

function renderCmd() {
  const q = cmdInput.value.toLowerCase();
  const list = COMMANDS.filter((c) => c.t.toLowerCase().includes(q));
  cmdList.innerHTML = list.length
    ? list.map((c) => `<div class="ci ${COMMANDS.indexOf(c) === cmdSel ? "sel" : ""}" data-i="${COMMANDS.indexOf(c)}"><span>${c.t}</span><small>${c.s}</small></div>`).join("")
    : `<div class="ci"><span>No matches</span></div>`;
}

function runCmd(k) {
  if (k === "copy") { if (navigator.clipboard) navigator.clipboard.writeText(DATA.email); }
  else if (k === "theme") {
    const keys = Object.keys(THEMES);
    DATA.accent = keys[(keys.indexOf(DATA.accent) + 1) % keys.length];
    applyTheme(DATA.accent);
    renderBindings();
  }
  else if (k === "top") window.scrollTo({ top: 0, behavior: "smooth" });
  else { const el = document.getElementById(k); if (el) el.scrollIntoView({ behavior: "smooth" }); }
  cmd.classList.remove("on");
}

function openCmd() {
  cmd.classList.add("on");
  cmdInput.value = "";
  cmdSel = 0;
  renderCmd();
  setTimeout(() => cmdInput.focus(), 50);
}

$("#cmdBtn").addEventListener("click", openCmd);
window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    cmd.classList.contains("on") ? cmd.classList.remove("on") : openCmd();
  }
  if (e.key === "Escape") { cmd.classList.remove("on"); modal.classList.remove("on"); }
});
cmdInput.addEventListener("input", () => { cmdSel = 0; renderCmd(); });
cmdInput.addEventListener("keydown", (e) => {
  const items = [...cmdList.querySelectorAll(".ci[data-i]")];
  if (e.key === "ArrowDown") { cmdSel = clamp(cmdSel + 1, 0, items.length - 1); renderCmd(); }
  if (e.key === "ArrowUp") { cmdSel = clamp(cmdSel - 1, 0, items.length - 1); renderCmd(); }
  if (e.key === "Enter") { const el = items[cmdSel]; if (el) runCmd(COMMANDS[+el.getAttribute("data-i")].k); }
});
cmdList.addEventListener("click", (e) => {
  const el = e.target.closest(".ci[data-i]");
  if (el) runCmd(COMMANDS[+el.getAttribute("data-i")].k);
});
document.addEventListener("click", (e) => { if (e.target.closest("[data-cmdclose]")) cmd.classList.remove("on"); });

/* ---------- custom cursor ---------- */
(function cursor() {
  if (window.matchMedia("(hover:none)").matches) return;
  const c = $("#cur"), d = $("#curD");
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, dx = mx, dy = my;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    document.body.classList.remove("cur-hide");
  });
  (function loop() {
    cx = lerp(cx, mx, 0.18); cy = lerp(cy, my, 0.18);
    dx = lerp(dx, mx, 0.6); dy = lerp(dy, my, 0.6);
    c.style.transform = `translate(${cx}px,${cy}px)`;
    d.style.transform = `translate(${dx}px,${dy}px)`;
    requestAnimationFrame(loop);
  })();
  const hot = "a,button,.proj,.ccard,.chip,input,textarea,select,[data-tilt]";
  document.addEventListener("mouseover", (e) => { if (e.target.closest(hot)) document.body.classList.add("cur-hover"); });
  document.addEventListener("mouseout", (e) => { if (e.target.closest(hot)) document.body.classList.remove("cur-hover"); });
  document.addEventListener("mouseleave", () => document.body.classList.add("cur-hide"));
})();

/* ---------- 2D starfield fallback ---------- */
function starfield2D() {
  const c = $("#stars"), x = c.getContext("2d");
  let w, h, st = [];
  function resize() {
    w = c.width = innerWidth; h = c.height = innerHeight;
    st = Array.from({ length: Math.min(220, innerWidth * innerHeight / 9000) }, () => ({
      x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.4 + 0.2,
      s: Math.random() * 0.16 + 0.02, a: Math.random()
    }));
  }
  function frame() {
    x.clearRect(0, 0, w, h);
    for (const s of st) {
      s.y += s.s;
      if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      s.a += 0.02;
      x.beginPath();
      x.arc(s.x, s.y, s.r, 0, 7);
      x.fillStyle = "rgba(190,225,255," + (0.35 + Math.abs(Math.sin(s.a)) * 0.5) + ")";
      x.fill();
    }
    requestAnimationFrame(frame);
  }
  addEventListener("resize", resize);
  resize(); frame();
}

/* ---------- binary rain behind the hero portrait ---------- */
function initBinaryRain() {
  const canvas = document.getElementById("binRain");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const FS = 13;    // glyph size, CSS px
  const GAP = 4;    // space between columns
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0, cols = 0, drops = [], speeds = [];

  const accent = () => getComputedStyle(document.documentElement).getPropertyValue("--cyan").trim() || "#3fe0ff";
  const glyph = () => (Math.random() < 0.5 ? "0" : "1");

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    W = canvas.width = Math.round(r.width * dpr);
    H = canvas.height = Math.round(r.height * dpr);
    cols = Math.max(1, Math.floor(W / ((FS + GAP) * dpr)));
    drops = []; speeds = [];
    for (let i = 0; i < cols; i++) {
      drops.push(Math.random() * H);
      speeds.push((0.5 + Math.random() * 1.15) * dpr);
    }
    return true;
  }

  function font() {
    ctx.font = "500 " + (FS * dpr) + "px 'JetBrains Mono', ui-monospace, monospace";
    ctx.textBaseline = "top";
  }

  function draw() {
    // fade the existing glyphs towards transparent so trails glow and die out
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0,0,0,0.075)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";

    font();
    ctx.fillStyle = accent();
    for (let i = 0; i < cols; i++) {
      const x = i * (FS + GAP) * dpr;
      const y = drops[i];
      ctx.globalAlpha = 0.95;                 // the bright leading glyph
      ctx.fillText(glyph(), x, y);
      ctx.globalAlpha = 0.28;                 // a dimmer one just behind it
      ctx.fillText(glyph(), x, y - FS * dpr * 1.15);

      drops[i] += speeds[i];
      if (drops[i] > H + FS * dpr) drops[i] = Math.random() * -H * 0.4;
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  function staticFrame() {
    font();
    ctx.fillStyle = accent();
    for (let i = 0; i < cols; i++) {
      for (let y = 0; y < H; y += FS * dpr * 2.6) {
        ctx.globalAlpha = 0.1 + Math.random() * 0.35;
        ctx.fillText(glyph(), i * (FS + GAP) * dpr, y);
      }
    }
    ctx.globalAlpha = 1;
  }

  if (!resize()) { window.addEventListener("load", resize); setTimeout(resize, 400); }
  window.addEventListener("resize", resize);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { staticFrame(); return; }
  draw();
}

/* ---------- boot ---------- */
$("#yr2").textContent = new Date().getFullYear();
renderBindings();
renderProjects();
type();
onScroll();
initBinaryRain();
applyIcons();

scene3d = await initScene();
if (scene3d) applyTheme(DATA.accent);
else starfield2D();

/* preloader */
let pct = 0;
const pl = $("#preloader"), plBar = $("#plBar"), plTxt = $("#plTxt");
const plTimer = setInterval(() => {
  pct = Math.min(100, pct + Math.random() * 16 + 6);
  plBar.style.width = pct + "%";
  plTxt.textContent = "Initializing systems · " + Math.round(pct) + "%";
  if (pct >= 100) {
    clearInterval(plTimer);
    setTimeout(() => pl.classList.add("hide"), 380);
  }
}, 190);
setTimeout(() => {
  clearInterval(plTimer);
  plBar.style.width = "100%";
  pl.classList.add("hide");
}, 4200);
