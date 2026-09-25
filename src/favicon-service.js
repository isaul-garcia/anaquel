import { readIcon, writeIcon, invalidateIcon } from './favicon-cache.js';
const pending = new Map();
let active = 0;
const waiting = [];
const defaultIcons = new Map();
const CACHE_VERSION = 4;
// Match the largest grid icon (110 CSS px), including high-density screens.
// Preview thumbnails share this resolution so they cannot seed a blurry grid cache.
export function faviconSize() {
  const pixels = 110 * 0.64 * (globalThis.devicePixelRatio || 1);
  return [128, 256, 512].find(size => size >= pixels) || 512;
}
export function websiteUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    url.username = ''; url.password = ''; url.hash = '';
    return url;
  } catch { return null; }
}
function browserIconUrl(pageUrl, size) {
  const url = new URL(chrome.runtime.getURL('/_favicon/'));
  url.searchParams.set('pageUrl', pageUrl); url.searchParams.set('size', String(size));
  return url.href;
}
async function readImage(url, refresh = false) {
  try {
    const response = await fetch(url, { credentials: 'omit', referrerPolicy: 'no-referrer', cache: refresh ? 'reload' : 'default', signal: AbortSignal.timeout(6000) });
    if (!response.ok || Number(response.headers.get('content-length')) > 262144) return null;
    const reader = response.body.getReader(), chunks = []; let length = 0;
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      length += value.length;
      if (length > 262144) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    if (!length) return null;
    const bytes = new Uint8Array(length); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let mime = (response.headers.get('content-type') || '').split(';')[0].toLowerCase();
    if (!mime.startsWith('image/')) {
      // Brave's built-in favicon endpoint supplies PNG bytes without a Content-Type.
      // Some websites also serve their icons as application/octet-stream.
      if ([137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => bytes[index] === value)) mime = 'image/png';
      else if (bytes[0] === 0 && bytes[1] === 0 && bytes[2] === 1 && bytes[3] === 0) mime = 'image/x-icon';
      else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) mime = 'image/jpeg';
      else if (String.fromCharCode(...bytes.subarray(0, 6)).match(/^GIF8[79]a$/)) mime = 'image/gif';
      else if (String.fromCharCode(...bytes.subarray(0, 4)) === 'RIFF' && String.fromCharCode(...bytes.subarray(8, 12)) === 'WEBP') mime = 'image/webp';
      else return null;
    }
    let binary = '';
    for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return { dataUrl: `data:${mime};base64,${btoa(binary)}`, fingerprint: [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].join(',') };
  } catch { return null; }
}
async function imageSize(icon) {
  if (!icon) return 0;
  const image = new Image();
  image.src = icon.dataUrl;
  try {
    await image.decode();
    return icon.dataUrl.startsWith('data:image/svg+xml;') ? Infinity : Math.min(image.naturalWidth, image.naturalHeight);
  } catch { return 0; }
}
async function browserIcon(pageUrl, size, refresh) {
  // Compare against the generic globe at each resolution: the browser may return
  // a small fallback even when a larger request was made.
  if (!defaultIcons.has(size)) defaultIcons.set(size, readImage(browserIconUrl('https://anaquel-favicon-probe.invalid/', size)));
  const [candidate, placeholder] = await Promise.all([
    readImage(browserIconUrl(pageUrl, size), refresh),
    defaultIcons.get(size)
  ]);
  return candidate && (!placeholder || candidate.fingerprint !== placeholder.fingerprint) ? candidate : null;
}
async function fetchIcon(pageUrl, refresh, iconUrl, size) {
  let best = null;
  let bestSize = 0;
  // Ask for progressively larger browser icons only until the displayed icon's
  // density target is met. This avoids downloading 512px assets unnecessarily.
  for (const requestSize of [128, 256, 512]) {
    if (requestSize < size) continue;
    const candidate = await browserIcon(pageUrl, requestSize, refresh);
    const candidateSize = await imageSize(candidate);
    if (candidateSize > bestSize) { best = candidate; bestSize = candidateSize; }
    if (bestSize >= size) break;
  }
  // Original sources can contain larger raster images, multiple ICO sizes, or SVG.
  // Stop as soon as the requested resolution is met, retaining the sharpest fallback.
  const sources = [...new Set([iconUrl, new URL('/favicon.ico', pageUrl).href].filter(Boolean))];
  for (const source of sources) {
    const candidate = await readImage(source, refresh);
    const candidateSize = await imageSize(candidate);
    if (candidateSize > bestSize) { best = candidate; bestSize = candidateSize; }
    if (bestSize >= size) break;
  }
  return best?.dataUrl || null;
}
async function acquire() {
  // A small queue prevents opening a large collection from competing with
  // rendering and input handling while still keeping the next few icons warm.
  if (active >= 2) await new Promise(resolve => waiting.push(resolve));
  else active++;
}
function release() { const next = waiting.shift(); if (next) next(); else active--; }
async function loadIcon(url, size) {
  await acquire();
  try {
    for (let attempt = 0; attempt < 3; attempt++) {
      const existing = await readIcon(url.origin);
      if (existing && !existing.dirty && existing.cacheVersion === CACHE_VERSION && existing.requestedSize >= size) return { origin: url.origin, dataUrl: existing.dataUrl };
      const pageUrl = existing?.pageUrl || url.href;
      const iconUrl = existing?.iconUrl;
      const dataUrl = await fetchIcon(pageUrl, Boolean(existing), iconUrl, size) || existing?.dataUrl || null;
      const saved = await writeIcon(url.origin, existing?.revision || 0, { dataUrl, pageUrl, iconUrl, cacheVersion: CACHE_VERSION, requestedSize: size, checkedAt: Date.now() });
      if (saved) return { origin: url.origin, dataUrl };
      // A visit occurred during the lookup. Do not overwrite the newer invalidation.
    }
    return { origin: url.origin, dataUrl: (await readIcon(url.origin))?.dataUrl || null };
  } finally { release(); }
}
export async function getBookmarkIcon(id) {
  const [bookmark] = await chrome.bookmarks.get(id);
  const url = websiteUrl(bookmark.url);
  if (!url) return { dataUrl: null };
  const size = faviconSize();
  const key = `${url.origin}:${size}`;
  if (!pending.has(key)) {
    // The page loads icons directly. A shared lock still deduplicates requests
    // across multiple Anaquel tabs using the same persistent cache.
    const task = navigator.locks.request(`anaquel-favicon:${url.origin}`, () => loadIcon(url, size))
      .finally(() => pending.delete(key));
    pending.set(key, task);
  }
  return pending.get(key);
}
export async function markSiteVisited(value, faviconUrl) {
  const url = websiteUrl(value);
  if (!url) return;
  // Only sites previously requested by visible bookmarks have cache entries.
  const iconUrl = websiteUrl(faviconUrl)?.href ||
    (typeof faviconUrl === 'string' && faviconUrl.length < 350000 && /^data:image\//i.test(faviconUrl) ? faviconUrl : undefined);
  if (await invalidateIcon(url.origin, url.href, iconUrl)) {
    await chrome.storage.local.set({ faviconUpdate: { origin: url.origin, token: crypto.randomUUID() } });
  }
}
let watchingVisits = false;
export function watchFaviconVisits() {
  if (watchingVisits) return;
  watchingVisits = true;
  const visits = new Map();
  chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (change.status !== 'complete' && !change.favIconUrl) return;
    if (!websiteUrl(tab.url) || tab.incognito) return;
    clearTimeout(visits.get(tabId));
    visits.set(tabId, setTimeout(() => {
      visits.delete(tabId); markSiteVisited(tab.url, tab.favIconUrl).catch(() => {});
    }, 350));
  });
  chrome.tabs.onRemoved.addListener(tabId => { clearTimeout(visits.get(tabId)); visits.delete(tabId); });
}
