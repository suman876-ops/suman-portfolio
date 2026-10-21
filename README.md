# Suman Mahata — Portfolio

A dark, space-themed personal portfolio for **Suman Mahata**, Full Stack Developer — built as a small multi-language project rather than one giant file.

**Live:** https://suman876-ops.github.io/suman-portfolio/

---

## What's inside

The site itself is a static front end, but the repository deliberately spreads across several languages so each concern lives in its own file:

| Language | Files | What it does |
|---|---|---|
| **HTML** | `index.html` | Page structure and markup |
| **CSS** | `css/style.css` | The whole design system — layout, theme variables, animation |
| **JavaScript** | `js/data.js` | All site content (one plain object) |
| | `js/main.js` | UI logic — navigation, reveals, tilt, modal, command palette, cursor |
| | `js/scene.js` | The Three.js 3D background |
| **Node.js** | `server/server.js` | Zero-dependency local dev server |
| **Python** | `server/app.py` | The same dev server, in the standard library |
| **Bash** | `deploy.sh` | One-command commit + push |
| **JSON** | `package.json` | Project metadata and run scripts |

## Features

- **3D background** with Three.js — a drifting starfield, a wireframe planet with orbiting rings, floating geometry and glow sprites, with mouse and scroll parallax.
- **Modern UI** — animated preloader, custom cursor, scroll-progress bar, 3D tilt cards, magnetic buttons, animated counters, a marquee strip and a project detail modal.
- **Glass-pill navigation** with a frosted brand pill and an active-section highlight.
- **Binary rain** — falling `0`/`1` columns animate behind the hero portrait, which is a
  cut-out (`images/profile-cutout.webp`) so the code shows through around the subject.
- **Command palette** — press `Ctrl`/`Cmd` + `K` to navigate, copy the email or cycle themes.
- **Four accent themes** — Cyan/Violet, Violet/Pink, Emerald/Sky, Amber/Coral (the dots in the footer).
- **Graceful fallback** — if Three.js can't load, the page drops back to a 2D canvas starfield.

## Project showcase

All eight projects appear in the Projects section, and every card carries three actions:

- **Live Demo** — opens the real deployment. Where no verified deployment exists, the card shows *Live Demo Coming Soon* instead of a link.
- **Source Code** — opens the public repository. Where none is published, it shows *Source Code Not Publicly Available*.
- **View Details** — opens a modal with the full description and the same links.

Cards can be searched by name and filtered by category, status and technology.

## Design

- **Glassmorphism** — the navigation, cards, contact tiles, modal and command
  palette are frosted panels (`backdrop-filter: blur()` over a translucent
  gradient), with a soft inner highlight and a deep shadow so they read as
  glass on the dark background.
- **Glass-pill navigation** — the brand sits in its own rounded glass pill with a
  glowing dot, and the links sit in a second pill where the active section is
  highlighted with an inner pill.
- **Contact tiles** — email (with a copy button), location, timezone, response
  time and status are presented as a grid of glass cards with icon badges,
  followed by the social links as glass pills.
- **Palette** — a deep navy-black base with cyan, violet and pink accents, four
  switchable themes, and higher-contrast text.

## Honesty notes

Every link in `js/data.js` was added only after being checked:

- **Live demos verified reachable:** SMX, Smart Bhumi, Apna Mess, and this portfolio.
- **Public source available:** `suman-portfolio` only.
- Projects with no verified deployment or repository show the informational labels
  above rather than a guessed URL.
- `techVerified: false` marks a stack that has not been confirmed against the real
  build; those chips render as unconfirmed.

## Running it locally

The site uses ES modules, so it must be served over HTTP (opening `index.html` directly from the filesystem won't work).

**Node.js**
```bash
npm start            # or: node server/server.js
```

**Python 3** (no Node required)
```bash
python3 server/app.py
```

Then open http://localhost:3000

## Editing the content

Everything you see on the page comes from `js/data.js` — name, tagline, about text, stats, education timeline, skills, projects and contact links. Change a value there and the site updates; no build step.

## Deploying

```bash
./deploy.sh "your commit message"
```

This stages, commits and pushes to `main`. GitHub Pages rebuilds automatically.

## Notes

- Three.js and the Google Fonts are loaded from CDNs, so the 3D scene needs an internet connection (the 2D fallback does not).
- The profile photo lives at `images/profile.jpg`.

## License

[MIT](LICENSE) © 2026 Suman Mahata
