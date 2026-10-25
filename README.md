# Cosmic Birth

Cosmic Birth is a cinematic, space-themed discovery website built with plain HTML, CSS, and JavaScript. This repository is currently at **Milestone 1: Layout and styling**. Its page establishes the visual foundation and placeholders for the daily NASA image, planets, cosmic birthdays, and a personal collection; those features are intentionally not wired up yet.

## Run locally

From this directory, start Python's built-in web server:

```sh
python3 -m http.server
```

Open [http://localhost:8000](http://localhost:8000) in a browser. Use a local server because the JavaScript files are native ES modules.

## Project files

- `index.html` — single-page structure and placeholder content.
- `css/styles.css` — responsive visual design and accessibility styles.
- `js/app.js` — minimal page initialization, including the birthday input's latest allowed date.
- `js/api.js` — reserved for NASA APOD integration.
- `js/storage.js` — reserved for browser collection storage.
- `data/planets.js` — reserved for planet content.
- `fixtures/` — reserved for local sample data.

See [AGENTS.md](AGENTS.md) for project constraints, coding conventions, and the milestone plan.
