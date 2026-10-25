# Cosmic Birth — project instructions

## Stack rules and constraints

- Use plain HTML, CSS, and JavaScript with native ES modules.
- Do not use frameworks, npm dependencies, a build step, or external image assets.
- The site must run with `python3 -m http.server` from the project root.
- Never hardcode or commit a real API key.
- Keep this project within the milestone currently requested; do not implement later milestones early.

## File structure and responsibilities

- `index.html` — semantic page structure, navigation, forms, and landmarks.
- `css/styles.css` — design tokens, responsive layout, visual styling, and motion preferences.
- `js/app.js` — page initialization, APOD and birthday rendering, planet interactions, and collection UI.
- `js/api.js` — NASA APOD requests and response normalization.
- `js/storage.js` — guarded localStorage helpers for saved discoveries.
- `data/planets.js` — solar-system facts shown in the planet guide.
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

1. Layout and styling — complete
2. APOD of the day — complete
3. Planets — complete
4. Birthday lookup — complete
5. Collection — complete
6. Polish and accessibility — complete

## Non-goals for v1

- No accounts
- No backend
- No search
