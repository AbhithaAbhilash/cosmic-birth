# Cosmic Birth — project instructions

## Stack rules and constraints

- Use plain HTML, CSS, and JavaScript with native ES modules.
- Do not use frameworks, npm dependencies, a build step, or external image assets.
- The site must run with `python3 -m http.server` from the project root.
- Never hardcode or commit a real API key.
- Keep this project within the milestone currently requested; do not implement later milestones early.

## File structure and responsibilities

- `index.html` — semantic page structure, navigation, placeholders, form, and landmarks.
- `css/styles.css` — design tokens, responsive layout, visual styling, and motion preferences.
- `js/app.js` — small page-level behaviors and initialization.
- `js/api.js` — future NASA API helpers (Milestone 2 onward).
- `js/storage.js` — future browser storage helpers (Milestone 5).
- `data/planets.js` — future solar-system data (Milestone 3).
- `fixtures/` — reserved for local sample data used in later milestones.
- `AGENTS.md` — project instructions and conventions.
- `README.md` — project overview and local run instructions.

## Coding conventions

- Use semantic HTML and keep heading levels in a logical order.
- Prefer small functions with one clear responsibility.
- Do not create global variables; use module-scoped values and functions.
- Wrap every `localStorage` access in `try/catch` because browser storage can be unavailable.
- Keep interactive controls keyboard accessible and provide visible focus styles.
- Respect `prefers-reduced-motion` for animations and scrolling.

## How to run

From the project root, run:

```sh
python3 -m http.server
```

Then open `http://localhost:8000` in a browser.

## Six-milestone plan

1. Layout and styling
2. APOD of the day
3. Planets
4. Birthday lookup
5. Collection
6. Polish and accessibility

## Non-goals for v1

- No accounts
- No backend
- No search
