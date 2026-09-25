import { readSavedIcons } from './favicon-cache.js';
import { getBookmarkIcon, watchFaviconVisits, faviconSize } from './favicon-service.js';

const targets = new Map(), cache = new Map(), pending = new Map(), generations = new Map();
const enabled = Boolean(globalThis.chrome?.bookmarks?.getTree);
let connectionErrorReported = false;
// Keep decoded local images independent of freshness: a refresh must never erase them.
const savedImages = new Map();
async function decodeIcon(dataUrl) {
  const image = new Image(); image.alt = ''; image.draggable = false;
  image.src = dataUrl;
  await image.decode();
  return image;
}
export async function prepareFavicons() {
  if (!enabled) return;
  try {
    const entries = await readSavedIcons();
    await Promise.all(entries.filter(entry => entry.dataUrl).map(async entry => {
      try { savedImages.set(entry.origin, await decodeIcon(entry.dataUrl)); }
      catch { /* A broken cached image retains the letter fallback. */ }
    }));
  } catch (error) { console.warn('Anaquel local favicon cache:', error.message); }
}
function attachSavedIcon(container, target) {
  const saved = savedImages.get(target.origin);
  if (!saved) return;
  const image = saved.cloneNode();
  container.querySelector('img')?.remove();
  target.fallback.hidden = true;
  container.append(image);
}

const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const target = targets.get(entry.target); if (!target) continue;
    target.visible = entry.isIntersecting && entry.intersectionRatio > 0;
    if (target.visible && document.visibilityState === 'visible') displayIcon(entry.target, target);
  }
// Keep a small warm buffer below/above the scroll viewport so the next few
// tiles are ready without starting work for the entire bookmark collection.
// The grid is inside its own scroll container, but the viewport intersection
// still correctly tracks that container's visible area.
}, { rootMargin: '180px 0px', threshold: 0 });
async function iconFor(target) {
  const cacheKey = `${target.origin}:${faviconSize()}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);
  const generation = generations.get(target.origin) || 0;
  const key = `${cacheKey}:${generation}`;
  if (!pending.has(key)) {
    pending.set(key, getBookmarkIcon(target.id)
      .then(result => {
        const dataUrl = result?.dataUrl || null;
        if ((generations.get(target.origin) || 0) === generation) cache.set(cacheKey, dataUrl);
        return dataUrl;
      }).finally(() => pending.delete(key)));
  }
  return pending.get(key);
}
async function displayIcon(container, target) {
  const version = ++target.version;
  try {
    const dataUrl = await iconFor(target);
    if (!dataUrl || !container.isConnected || target.version !== version) return;
    if (savedImages.get(target.origin)?.src === dataUrl) return;
    const image = await decodeIcon(dataUrl);
    if (target.version !== version) return;
    savedImages.set(target.origin, image);
    // Update every copy, including previews, without clearing an existing image.
    for (const [element, copy] of targets) {
      if (copy.origin === target.origin) attachSavedIcon(element, copy);
    }
  } catch (error) {
    // Failed connections used to disappear silently, making a stale extension tab look broken.
    if (!connectionErrorReported) {
      connectionErrorReported = true;
      console.warn('Anaquel favicon loader:', error.message);
      window.dispatchEvent(new CustomEvent('favicon-connection-error'));
    }
  }
}
export function observeFavicon(container, bookmark, fallback) {
  if (!enabled || !/^https?:/i.test(bookmark.url || '')) return;
  const target = { id: bookmark.id, origin: new URL(bookmark.url).origin, fallback, visible: false, version: 0 };
  attachSavedIcon(container, target);
  targets.set(container, target); observer.observe(container);
}
export function releaseFavicons(parent) {
  for (const [container, target] of targets) {
    if (!container.isConnected || parent.contains(container)) {
      target.version++; observer.unobserve(container); targets.delete(container);
    }
  }
}
if (enabled) {
  // Loading and visit detection work even if the extension's worker is unavailable.
  watchFaviconVisits();
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.faviconUpdate?.newValue?.origin) return;
    const origin = changes.faviconUpdate.newValue.origin;
    generations.set(origin, (generations.get(origin) || 0) + 1); for (const key of cache.keys()) if (key.startsWith(`${origin}:`)) cache.delete(key);
    for (const [container, target] of targets) {
      if (target.origin === origin && target.visible && document.visibilityState === 'visible') displayIcon(container, target);
    }
  });
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  for (const [container, target] of targets) if (target.visible) displayIcon(container, target);
});
