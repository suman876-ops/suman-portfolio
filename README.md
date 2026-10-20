# Suman Mahata — Portfolio

A dark, space-themed personal portfolio for **Suman Mahata**, Full Stack Developer.

Built as a single self-contained `index.html` — no build step, no dependencies to install. Just open it in a browser or host it anywhere static.

## Highlights

- **3D background** built with [Three.js](https://threejs.org/): a drifting starfield, a wireframe planet with orbiting rings, floating geometry and glow sprites, with mouse and scroll parallax.
- **Modern UI**: animated preloader, custom cursor, scroll-progress bar, 3D tilt cards, magnetic buttons, animated counters, a marquee strip, and a project detail modal.
- **Command palette** — press `Ctrl`/`Cmd` + `K` to navigate, open the admin, copy the email or cycle themes.
- **Accent themes** — four colour palettes (Cyan/Violet, Violet/Pink, Emerald/Sky, Amber/Coral).
- **Built-in admin console** — edit every piece of content (identity, about, stats, timeline, skills, projects, contact, marquee) right in the browser. Open it with the ⚙ button at the bottom-right. Default password: `admin123`. Changes save to your browser's local storage, and you can export/import the content as JSON.

## Tech

HTML, CSS, vanilla JavaScript, Three.js (loaded from a CDN). The profile photo is embedded in the file as a data URI.

## Run locally

Just open `index.html` in a browser. For a local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes

- The Three.js library and Google Fonts load from the internet. If Three.js is unavailable the site automatically falls back to a 2D starfield.
- The content shipped in the file is placeholder text — replace it with your real details via the admin console before sharing.
