# Suman Mahata — Portfolio

A dark, space-themed personal portfolio for **Suman Mahata**, Full Stack Developer.

**Live:** https://suman876-ops.github.io/suman-portfolio/

## Overview

A static front end with a Three.js 3D background, built as a small multi-language project so each concern lives in its own file rather than one oversized page.

## Structure

| Path | Purpose |
|---|---|
| `index.html` | Page structure and markup |
| `css/style.css` | Design system — layout, theme tokens, animation |
| `js/data.js` | All site content as a single object |
| `js/main.js` | UI logic — navigation, reveals, tilt, modal, command palette |
| `js/scene.js` | Three.js background scene |
| `js/brands.js` | Technology marks used by the skill cards |
| `server/server.js` | Zero-dependency Node dev server |
| `server/app.py` | The same dev server, Python standard library |
| `deploy.sh` | One-command commit and push |

## Features

- Three.js starfield, wireframe planet and floating geometry with mouse and scroll parallax
- Command palette (`Ctrl`/`Cmd` + `K`) for navigation, email copy and theme switching
- Four accent themes, custom cursor, scroll progress and reveal animations
- Graceful fallback to a 2D canvas starfield if Three.js fails to load

## Run locally

```bash
node server/server.js        # or: python3 server/app.py
```

Then open http://localhost:3000. No dependencies, no build step.

## Author

Suman Mahata — [portfolio](https://suman876-ops.github.io/suman-portfolio/) · [GitHub](https://github.com/suman876-ops)

## License

MIT
