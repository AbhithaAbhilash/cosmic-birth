const COLLECTION_KEY = 'cosmic-birth-discoveries';

export function readCollection() {
  try {
    const storedValue = localStorage.getItem(COLLECTION_KEY);
    const parsed = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleCollectionItem(item) {
  try {
    const items = readCollection();
    const index = items.findIndex((saved) => saved.date === item.date);
    const saved = index === -1;

    if (saved) {
      items.unshift({
        date: item.date,
        title: item.title,
        explanation: item.explanation,
        imageUrl: item.imageUrl,
        media_type: item.media_type,
        alt: item.alt,
        permalink: item.permalink,
        copyright: item.copyright,
      });
    } else {
      items.splice(index, 1);
    }

    localStorage.setItem(COLLECTION_KEY, JSON.stringify(items));
    return { ok: true, saved, items };
  } catch {
    return { ok: false, saved: false, items: readCollection() };
  }
}
