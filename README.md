# Cosmic Birth

Cosmic Birth is a cinematic, space-themed discovery website built with plain HTML, CSS, and JavaScript. It features NASA’s Astronomy Picture of the Day, an interactive guide to the eight planets, a lookup for the APOD entry on a chosen birthday, and a collection of discoveries saved in the browser.

The app uses NASA’s current APOD service without an API key. It includes a fallback to the most recent published entry when today’s image is not available yet. NASA updates its planetary moon counts as new moons are confirmed, so those figures may change over time.

## Run locally

From this directory, start Python's built-in web server:

```sh
python3 -m http.server
```

Open [http://localhost:8000](http://localhost:8000) in a browser. Use a local server because the JavaScript files are native ES modules.

## Project files

- `index.html` — single-page structure and placeholder content.
- `css/styles.css` — responsive visual design and accessibility styles.
- `js/app.js` — page initialization, planet details, birthday lookup, and collection interactions.
- `js/api.js` — NASA APOD requests and response normalization.
- `js/storage.js` — browser-local discovery collection.
- `data/planets.js` — planet facts used by the interactive guide.
- `fixtures/` — reserved for local sample data.

See [AGENTS.md](AGENTS.md) for project constraints, coding conventions, and the milestone plan.
