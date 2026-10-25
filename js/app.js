import { planets } from '../data/planets.js';
import { fetchApod } from './api.js';
import { readCollection, toggleCollectionItem } from './storage.js';

const birthdayInput = document.querySelector('#birth-date');
const birthdayForm = document.querySelector('#birthday-form');
const birthdayResults = document.querySelector('#birthday-results');
const collectionList = document.querySelector('#collection-list');
const collectionMessage = document.querySelector('#collection-message');
let todayApod = null;
let birthdayApod = null;

function getLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
}

function makeElement(tagName, className, content) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = content;
  return element;
}

birthdayInput.min = '1995-06-16';
birthdayInput.max = getLocalDateValue(new Date());

function updateSaveButton(button, item) {
  const saved = readCollection().some((entry) => entry.date === item.date);
  button.disabled = false;
  button.setAttribute('aria-pressed', String(saved));
  button.textContent = saved ? '♥  Saved to collection' : '♡  Save to collection';
  button.classList.toggle('saved', saved);
}

function renderCollection(items = readCollection()) {
  collectionList.replaceChildren();
  if (!items.length) {
    collectionMessage.textContent = 'Your collection is empty. Save a discovery to see it here.';
    return;
  }

  collectionMessage.textContent = `${items.length} ${items.length === 1 ? 'discovery' : 'discoveries'} saved on this device.`;
  items.forEach((item) => {
    const card = makeElement('article', 'collection-card');
    const imageFrame = makeElement('div', 'collection-card-image');
    if (item.media_type === 'image' && item.imageUrl) {
      const image = makeElement('img', '', '');
      image.src = item.imageUrl;
      image.alt = item.alt || item.title;
      image.loading = 'lazy';
      imageFrame.append(image);
    } else {
      imageFrame.append(makeElement('span', 'collection-video', 'Video discovery'));
    }

    const body = makeElement('div', 'collection-card-body');
    const title = makeElement('h3', '', item.title);
    const time = makeElement('time', '', formatDate(item.date));
    time.dateTime = item.date;
    const remove = makeElement('button', 'remove-button', 'Remove from collection');
    remove.type = 'button';
    remove.addEventListener('click', () => changeCollection(item));
    body.append(title, time, remove);
    card.append(imageFrame, body);
    collectionList.append(card);
  });
}

function changeCollection(item) {
  const result = toggleCollectionItem(item);
  if (!result.ok) {
    collectionMessage.textContent = 'Your browser could not save this discovery. Check that local storage is available, then try again.';
    return;
  }

  renderCollection(result.items);
  if (todayApod?.date === item.date) updateSaveButton(document.querySelector('#save-apod'), todayApod);
  if (birthdayApod?.date === item.date) updateSaveButton(document.querySelector('#save-birthday'), birthdayApod);
}

function setImageFallback(placeholder, image) {
  image.hidden = true;
  placeholder.hidden = false;
  placeholder.replaceChildren(
    makeElement('span', 'placeholder-orbit', '✧'),
    makeElement('span', '', 'This image could not be displayed. Open the NASA entry to view it.'),
  );
}

function setApodContent(item) {
  todayApod = item;
  document.querySelector('#apod-title').textContent = item.title;
  document.querySelector('#apod-explanation').textContent = item.explanation;
  document.querySelector('#apod-status').textContent = `NASA APOD · ${formatDate(item.date)}`;
  document.querySelector('#apod-link').href = item.permalink || item.imageUrl;
  document.querySelector('#image-caption').textContent = item.copyright ? `IMAGE: ${item.copyright} · NASA APOD` : 'NASA ASTRONOMY PICTURE OF THE DAY';

  const image = document.querySelector('#apod-image');
  const placeholder = document.querySelector('#image-placeholder');
  if (item.media_type === 'image') {
    image.onerror = () => setImageFallback(placeholder, image);
    image.src = item.imageUrl;
    image.alt = item.alt;
    image.hidden = false;
    placeholder.hidden = true;
  } else {
    placeholder.hidden = false;
    placeholder.replaceChildren(
      makeElement('span', 'placeholder-orbit', '✧'),
      makeElement('span', '', 'This NASA entry is a video. Open it on NASA to view it.'),
    );
  }

  updateSaveButton(document.querySelector('#save-apod'), item);
}

async function loadTodayApod() {
  try {
    const item = await fetchApod(getLocalDateValue(new Date()), { fallbackToLatest: true });
    setApodContent(item);
  } catch (error) {
    document.querySelector('#apod-status').textContent = error instanceof Error ? error.message : 'NASA’s image service is temporarily unavailable.';
    document.querySelector('#apod-title').textContent = 'The cosmos is still out there';
    document.querySelector('#apod-explanation').textContent = 'The daily image could not be loaded. You can still visit NASA’s Astronomy Picture of the Day directly.';
  }
}

function renderPlanetDetail(planet) {
  const panel = document.querySelector('#planet-detail');
  const heading = makeElement('h3', 'planet-detail-title', planet.name);
  const facts = makeElement('dl', 'planet-facts');
  [
    ['Type', planet.type], ['Diameter', planet.diameter], ['Mean temperature', planet.temperature],
    ['Known moons', planet.moons], ['Orbit around the Sun', planet.orbit],
  ].forEach(([label, value]) => {
    facts.append(makeElement('dt', '', label), makeElement('dd', '', value));
  });
  const fact = makeElement('p', 'planet-fact', planet.fact);
  const source = makeElement('a', 'text-link', 'More from NASA ↗');
  source.href = planet.source;
  source.target = '_blank';
  source.rel = 'noreferrer';
  panel.replaceChildren(makeElement('span', 'detail-icon', '✧'), heading, facts, fact, source);
}

function renderPlanets() {
  const grid = document.querySelector('#planet-grid');
  planets.forEach((planet) => {
    const card = makeElement('button', 'planet-card');
    const slug = planet.name.toLowerCase();
    card.type = 'button';
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Explore ${planet.name}`);
    card.append(makeElement('span', `planet-orb ${slug}`, ''));
    card.append(makeElement('span', 'planet-name', planet.name));
    card.append(makeElement('span', 'planet-type', planet.type));
    card.addEventListener('click', () => {
      grid.querySelectorAll('.planet-card').forEach((planetCard) => {
        planetCard.classList.remove('active');
        planetCard.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('active');
      card.setAttribute('aria-pressed', 'true');
      renderPlanetDetail(planet);
    });
    grid.append(card);
  });
}

function renderBirthdayDiscovery(item) {
  birthdayApod = item;
  birthdayResults.replaceChildren();
  const card = makeElement('article', 'birthday-card');
  const imageFrame = makeElement('div', 'birthday-card-image');
  if (item.media_type === 'image') {
    const image = makeElement('img', '', '');
    image.src = item.imageUrl;
    image.alt = item.alt || item.title;
    image.loading = 'lazy';
    imageFrame.append(image);
  } else {
    imageFrame.append(makeElement('p', 'video-note', 'This entry is a video. Open NASA to watch it.'));
  }

  const content = makeElement('div', 'birthday-card-content');
  content.append(makeElement('p', 'eyebrow', `YOUR COSMIC DAY · ${formatDate(item.date)}`));
  content.append(makeElement('h3', '', item.title));
  content.append(makeElement('p', 'birthday-explanation', item.explanation));
  const actions = makeElement('div', 'birthday-card-actions');
  const nasaLink = makeElement('a', 'text-link', 'View on NASA ↗');
  nasaLink.href = item.permalink || item.imageUrl;
  nasaLink.target = '_blank';
  nasaLink.rel = 'noreferrer';
  const save = makeElement('button', 'button button-outline save-button', '♡  Save to collection');
  save.type = 'button';
  save.id = 'save-birthday';
  save.setAttribute('aria-pressed', 'false');
  save.addEventListener('click', () => changeCollection(item));
  updateSaveButton(save, item);
  actions.append(nasaLink, save);
  content.append(actions);
  card.append(imageFrame, content);
  birthdayResults.append(card);
}

async function handleBirthdaySubmit(event) {
  event.preventDefault();
  if (!birthdayInput.value) return;

  const chosenDate = birthdayInput.value;
  const today = getLocalDateValue(new Date());
  if (chosenDate < birthdayInput.min || chosenDate > today) {
    birthdayResults.textContent = chosenDate < birthdayInput.min
      ? 'NASA’s APOD archive begins on June 16, 1995. Choose that date or a later one.'
      : 'That day is still ahead of us. Choose today or an earlier date.';
    return;
  }

  birthdayResults.textContent = 'Searching NASA’s archive for your day…';
  birthdayForm.querySelector('button[type="submit"]').disabled = true;
  try {
    const item = await fetchApod(chosenDate);
    renderBirthdayDiscovery(item);
  } catch (error) {
    birthdayResults.textContent = error instanceof Error ? error.message : 'NASA’s archive is temporarily unavailable.';
  } finally {
    birthdayForm.querySelector('button[type="submit"]').disabled = false;
  }
}

document.querySelector('#save-apod').addEventListener('click', () => {
  if (todayApod) changeCollection(todayApod);
});
birthdayForm.addEventListener('submit', handleBirthdaySubmit);
renderPlanets();
renderCollection();
loadTodayApod();
