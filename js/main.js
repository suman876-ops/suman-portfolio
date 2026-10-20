/* ============================================================================
 * main.js — UI logic for the portfolio.
 *
 * Content comes from ./data.js, the 3D background from ./scene.js.
 * Everything else (navigation, reveals, tilt, project filters, the GitHub
 * repository feed, modal, command palette, cursor, preloader) lives here.
 * ==========================================================================*/

import { DATA, THEMES } from "./data.js";
import { initScene } from "./scene.js";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;

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
      <div class="v"><span class="cnt" data-to="${esc(s.value)}">0</span>${esc(s.suffix || "")}</div>
      <div class="l">${esc(s.label)}</div>
    </div>`).join("");

  const items = (DATA.marquee || []).map((m) => `<span class="it">${esc(m)}</span>`).join("");
  $("#marquee").innerHTML = items + items; // duplicated for a seamless loop

  $("#timeline").innerHTML = (DATA.timeline || []).map((it) => `
    <div class="item reveal">
      <div class="top"><span class="yr">${esc(it.year)}</span><span class="tag">${esc(it.tag)}</span></div>
      <h3>${esc(it.role)}</h3>
      <div class="org">// ${esc(it.org)}</div>
      <p>${esc(it.desc)}</p>
      <div class="chips">${(it.tags || []).map((t) => `<span class="chip"># ${esc(t)}</span>`).join("")}</div>
    </div>`).join("");

  $("#skillsWrap").innerHTML = (DATA.skills || []).map((s) => `
    <div class="skill reveal">
      <div class="row">
        <span class="nm"><i>${esc(s.code || "SYS")}</i>${esc(s.name)}</span>
        <span class="pc">${esc(s.level)}%</span>
      </div>
      <div class="pbar"><span data-lvl="${esc(s.level)}"></span></div>
    </div>`).join("");

  const socials = [["GitHub", DATA.github], ["LinkedIn", DATA.linkedin], ["Twitter", DATA.twitter]]
    .filter((s) => s[1]);
  $("#socials").innerHTML = socials
    .map(([n, u]) => `<a href="${esc(u)}" target="_blank" rel="noopener">${n}</a>`).join("");

  $("#accentDots").innerHTML = Object.keys(THEMES).map((k) => `
    <button data-accent="${k}" title="${k}" class="${k === DATA.accent ? "on" : ""}"
      style="background:linear-gradient(135deg,${THEMES[k].cyan},${THEMES[k].mag})"></button>`).join("");
  $$("#accentDots button").forEach((b) => b.addEventListener("click", () => {
    DATA.accent = b.getAttribute("data-accent");
    applyTheme(DATA.accent);
    renderBindings();
  }));

  applyTheme(DATA.accent);
}

/* ============================================================================
 * PROJECTS — search + category / status / tech filters
 * ==========================================================================*/

const filter = { q: "", category: "All", status: "All", tech: "All" };
let visibleProjects = [];   // the indices currently shown (used by the modal)

function allTech() {
  const set = new Set();
  (DATA.projects || []).forEach((p) => (p.tech || []).forEach((t) => set.add(t)));
  return [...set].sort();
}

function buildFilters() {
  const cats = ["All", ...(DATA.categories || [])];
  $("#pCats").innerHTML = cats.map((c) =>
    `<button class="fchip ${filter.category === c ? "on" : ""}" data-fcat="${esc(c)}">${esc(c)}</button>`).join("");

  const usedStatuses = [...new Set((DATA.projects || []).map((p) => p.status))];
  const stats = ["All", ...usedStatuses];
  $("#pStats").innerHTML = stats.map((s) =>
    `<button class="fchip ${filter.status === s ? "on" : ""}" data-fstatus="${esc(s)}">${esc(s)}</button>`).join("");

  const techs = ["All", ...allTech()];
  $("#pTech").innerHTML = techs.map((t) =>
    `<option value="${esc(t)}" ${filter.tech === t ? "selected" : ""}>${t === "All" ? "All technologies" : esc(t)}</option>`).join("");

  $$("#pCats [data-fcat]").forEach((b) => b.addEventListener("click", () => {
    filter.category = b.getAttribute("data-fcat"); buildFilters(); renderProjects();
  }));
  $$("#pStats [data-fstatus]").forEach((b) => b.addEventListener("click", () => {
    filter.status = b.getAttribute("data-fstatus"); buildFilters(); renderProjects();
  }));
  $("#pTech").addEventListener("change", (e) => { filter.tech = e.target.value; renderProjects(); });
  $("#pSearch").addEventListener("input", (e) => { filter.q = e.target.value.toLowerCase().trim(); renderProjects(); });
}

function matches(p) {
  if (filter.q && !p.title.toLowerCase().includes(filter.q)) return false;
  if (filter.category !== "All" && p.category !== filter.category) return false;
  if (filter.status !== "All" && p.status !== filter.status) return false;
  if (filter.tech !== "All" && !(p.tech || []).includes(filter.tech)) return false;
  return true;
}

function projectCard(p, i) {
  const pending = /pending/i.test(p.status);
  const techChips = (p.tech || []).length
    ? (p.tech || []).map((t) => `<span class="${p.techVerified ? "" : "unconfirmed"}" title="${p.techVerified ? "" : "Stack not yet confirmed"}">${esc(t)}</span>`).join("")
    : `<span class="unconfirmed">Stack to be confirmed</span>`;

  const liveBtn = p.live
    ? `<a class="pact live" href="${esc(p.live)}" target="_blank" rel="noopener noreferrer" aria-label="Open the live demo of ${esc(p.title)}">Live Demo ↗</a>`
    : `<span class="pact off" aria-disabled="true" title="No verified live deployment yet">Live Demo Coming Soon</span>`;

  const srcBtn = p.github
    ? `<a class="pact src" href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" aria-label="Open the source code of ${esc(p.title)} on GitHub">Source Code ↗</a>`
    : `<span class="pact off" aria-disabled="true" title="No public repository verified for this project">Source Code Not Publicly Available</span>`;

  return `
    <article class="proj tilt reveal" data-tilt="7" data-p="${i}">
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
        <button class="pact detail" data-detail="${i}" aria-label="View details of ${esc(p.title)}">View Details</button>
      </div>
      <span class="idx">${String(i + 1).padStart(2, "0")}</span>
    </article>`;
}

function renderProjects() {
  const list = (DATA.projects || []).map((p, i) => [p, i]).filter(([p]) => matches(p));
  visibleProjects = list.map(([, i]) => i);
  $("#pCount").textContent = `${list.length} of ${(DATA.projects || []).length} projects`;

  $("#projectsWrap").innerHTML = list.length
    ? list.map(([p, i]) => projectCard(p, i)).join("")
    : `<div class="no-results">No projects match those filters. Try clearing the search or picking “All”.</div>`;

  observeReveals();
  bindTilt();
}

/* ============================================================================
 * GITHUB REPOSITORY DISCOVERY
 * Fetches the real public repos from the GitHub REST API at runtime, and
 * falls back to the saved snapshot if the API is unavailable or rate limited.
 * ==========================================================================*/

function repoCard(r) {
  const meta = [];
  if (r.language) meta.push(`<span class="rlang">${esc(r.language)}</span>`);
  meta.push(`<span>★ ${r.stars}</span>`);
  meta.push(`<span>⑂ ${r.forks}</span>`);
  if (r.updated_at) meta.push(`<span>updated ${esc(String(r.updated_at).slice(0, 10))}</span>`);

  const links = [
    `<a class="pact src" href="${esc(r.html_url)}" target="_blank" rel="noopener noreferrer">Repository ↗</a>`
  ];
  if (r.homepage) {
    links.push(`<a class="pact live" href="${esc(r.homepage)}" target="_blank" rel="noopener noreferrer">Live ↗</a>`);
  }
  return `
    <article class="repo reveal">
      <h3>${esc(r.name)}</h3>
      <p>${esc(r.description || "No description provided.")}</p>
      <div class="rmeta">${meta.join("")}</div>
      <div class="proj-actions">${links.join("")}</div>
    </article>`;
}

async function loadRepos() {
  const host = $("#repoList");
  host.innerHTML = `<div class="repo-note">Fetching repositories from GitHub…</div>`;
  let repos = null, live = false;

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(DATA.githubUser)}/repos?per_page=100&sort=updated`,
      { headers: { Accept: "application/vnd.github+json" } }
    );
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) {
        repos = json.map((r) => ({
          name: r.name,
          description: r.description,
          html_url: r.html_url,
          language: r.language,
          stars: r.stargazers_count,
          forks: r.forks_count,
          updated_at: r.updated_at,
          homepage: r.homepage
        }));
        live = true;
      }
    }
  } catch (err) {
    /* network blocked / offline — fall through to the snapshot */
  }

  if (!repos) repos = DATA.repoFallback;

  $("#repoStatus").innerHTML = live
    ? `<span class="ok">●</span> Live from the GitHub API — ${repos.length} public repositories`
    : `<span class="warn">●</span> GitHub API unavailable right now — showing a saved snapshot from 20 Oct 2026`;
  host.innerHTML = repos.length
    ? repos.map(repoCard).join("")
    : `<div class="repo-note">No public repositories found.</div>`;
  observeReveals();
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

function initBars() {
  const bo = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.getAttribute("data-lvl") + "%";
      bo.unobserve(e.target);
    }
  }), { threshold: 0.4 });
  $$(".pbar span").forEach((el) => { el.style.width = "0"; bo.observe(el); });
}

function initCounters() {
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
    })(t0);
  }), { threshold: 0.5 });
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
  $$(".pbar span").forEach((el, i) => setTimeout(() => {
    el.style.width = "0";
    requestAnimationFrame(() => { el.style.width = el.getAttribute("data-lvl") + "%"; });
  }, i * 80));
});

/* ---------- nav + scroll progress ---------- */
const nav = $("#nav");
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 30);
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  $("#progress").style.width = (docH > 0 ? clamp(y / docH, 0, 1) * 100 : 0) + "%";
  $("#toTop").classList.toggle("on", y > 600);
  let cur = "";
  for (const s of $$("section[id]")) if (y >= s.offsetTop - 140) cur = s.id;
  $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
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
  cp.textContent = "COPIED ✓";
  setTimeout(() => { cp.textContent = "CLICK TO COPY"; }, 1400);
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
  { t: "Go to GitHub Repositories", s: "section", k: "github" },
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
  const hot = "a,button,.proj,.repo,.chip,input,textarea,select,[data-tilt]";
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

/* ---------- boot ---------- */
$("#yr2").textContent = new Date().getFullYear();
renderBindings();
buildFilters();
renderProjects();
loadRepos();
type();
onScroll();

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
