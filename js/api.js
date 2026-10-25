const APOD_ENDPOINT = 'https://science.nasa.gov/wp-json/wp/v2/apod-basic';

function dateToNasaPath(date) {
  return date.replaceAll('-', '').slice(2);
}

async function requestApod(url) {
  return fetch(url, { headers: { Accept: 'application/json' } });
}

function previousDate(date) {
  const [year, month, day] = date.split('-').map(Number);
  const previous = new Date(Date.UTC(year, month - 1, day));
  previous.setUTCDate(previous.getUTCDate() - 1);
  return previous.toISOString().slice(0, 10);
}

export async function fetchApod(date, { fallbackToLatest = false } = {}) {
  let requestDate = date;
  let response;
  for (let attempt = 0; attempt < (fallbackToLatest ? 7 : 1); attempt += 1) {
    response = await requestApod(requestDate ? `${APOD_ENDPOINT}/${dateToNasaPath(requestDate)}` : APOD_ENDPOINT);
    if (response.status !== 404 || !requestDate) break;
    requestDate = previousDate(requestDate);
  }
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('NASA’s image service is receiving too many requests. Please try again shortly.');
    }
    throw new Error(date && !fallbackToLatest ? 'NASA has not published an image for this date yet. Please choose an earlier date.' : 'NASA’s image service could not load today’s discovery. Please try again later.');
  }

  const payload = await response.json();
  const data = Array.isArray(payload) ? payload[0] : payload;
  if (!data || typeof data !== 'object') {
    throw new Error('NASA returned an unexpected response. Please try again later.');
  }

  const imageUrl = data.hdurl || data.url;
  if (!data.title || !data.explanation || !data.date || !data.media_type || !imageUrl) {
    throw new Error('Today’s discovery is missing information. Please try again later.');
  }

  const plainText = (value) => new DOMParser().parseFromString(value, 'text/html').body.textContent
    .replace(/^\s*Explanation:\s*/i, '')
    .split(/Tomorrow['’]s picture:/i)[0]
    .replace(/\s+/g, ' ')
    .trim();

  return {
    date: data.date,
    title: data.title,
    permalink: data.permalink || data.url,
    imageUrl,
    media_type: data.media_type,
    alt: data.alt || data.title,
    explanation: plainText(data.explanation),
    copyright: data.copyright ? plainText(data.copyright) : '',
  };
}
