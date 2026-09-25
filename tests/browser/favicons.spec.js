import { test, expect, chromium } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import path from 'node:path';
let context, page, worker, profile, extensionUrl, sites, ids;
const errors = [];
async function openAll() { await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click(); }
async function site(missing = false) {
  const png = await readFile('icons/icon32.png');
  const fresh = await readFile('icons/icon48.png');
  const result = { requests: 0, visits: 0, version: 0 };
  const server = createServer((req, res) => {
    if (req.url === '/favicon.ico') {
      result.requests++;
      if (missing) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'no-store' }); res.end(result.version ? fresh : png); return;
    }
    if (req.url === '/brand.png') {
      res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'no-store' }); res.end(fresh); return;
    }
    result.visits++;
    res.writeHead(200, { 'content-type': 'text/html', 'cache-control': 'no-store' });
    res.end(`<html><head><link rel="icon" href="${missing ? '/brand.png' : '/favicon.ico'}"></head><body>Favicon test site</body></html>`);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return Object.assign(result, { url: `http://127.0.0.1:${server.address().port}/`, close: () => new Promise(resolve => server.close(resolve)) });
}
async function cached(url) {
  return page.evaluate(async value => (await import('./src/favicon-cache.js')).readIcon(new URL(value).origin), url);
}
test.beforeAll(async () => {
  sites = await Promise.all([site(), site(), site(true)]);
  profile = await mkdtemp(path.join(tmpdir(), 'anaquel-favicon-test-'));
  const extension = path.resolve('.');
  context = await chromium.launchPersistentContext(profile, {
    executablePath: process.env.BROWSER_PATH || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true, viewport: { width: 1440, height: 1000 },
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`]
  });
  worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  extensionUrl = `chrome-extension://${worker.url().split('/')[2]}/index.html`;
  ids = await worker.evaluate(async urls => {
    const root = (await chrome.bookmarks.getTree())[0].children.find(n => !n.unmodifiable);
    const ids = [];
    for (let i = 0; i < 100; i++) ids.push((await chrome.bookmarks.create({ parentId: root.id, title: `Visible ${i}`, url: `${urls[0]}page-${i}` })).id);
    ids.push((await chrome.bookmarks.create({ parentId: root.id, title: 'Below the fold', url: urls[1] })).id);
    ids.push((await chrome.bookmarks.create({ parentId: root.id, title: 'Missing icon', url: urls[2] })).id);
    return ids;
  }, sites.map(s => s.url));
  page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(extensionUrl);
  await openAll();
});
test.afterAll(async () => {
  await context?.close();
  if (profile) await rm(profile, { recursive: true, force: true });
  await Promise.all(sites?.map(s => s.close()) || []);
});
test('only visible sites load, duplicated bookmarks share one request, and reload uses disk cache', async () => {
  await expect(page.locator(`.tile[data-id="${ids[0]}"] .tile-art img`)).toBeVisible();
  expect(sites[0].requests).toBe(1);
  expect(sites[1].requests).toBe(0); expect(sites[2].requests).toBe(0);
  expect(sites.every(s => s.visits === 0)).toBe(true);
  expect((await cached(sites[0].url)).dataUrl).toMatch(/^data:image\/png;base64,/);
  await page.reload(); await openAll();
  await expect(page.locator(`.tile[data-id="${ids[0]}"] .tile-art img`)).toBeVisible();
  expect(sites[0].requests).toBe(1);
  expect(await cached(sites[1].url)).toBeUndefined();
});
test('scrolling loads new icons and missing icons are not repeatedly fetched', async () => {
  await page.locator(`.tile[data-id="${ids[100]}"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`.tile[data-id="${ids[100]}"] .tile-art img`)).toBeVisible();
  await expect.poll(() => sites[2].requests).toBe(1);
  await expect.poll(async () => (await cached(sites[2].url))?.dataUrl).toBeNull();
  expect(sites[1].requests).toBe(1);
  await page.reload(); await openAll();
  await page.locator(`.tile[data-id="${ids[101]}"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`.tile[data-id="${ids[101]}"] .monogram`)).toBeVisible();
  await expect(page.locator(`.tile[data-id="${ids[100]}"] .tile-art img`)).toBeVisible();
  expect(sites[1].requests).toBe(1); expect(sites[2].requests).toBe(1);
});
test('visiting a missing-icon site discovers its custom icon, refreshing only when visible again', async () => {
  await page.locator('#grid-scroll').evaluate(n => { n.scrollTop = 0; });
  await expect(page.locator(`.tile[data-id="${ids[101]}"]`)).not.toBeInViewport();
  const visitor = await context.newPage(); await visitor.goto(sites[2].url);
  await expect.poll(async () => (await cached(sites[2].url))?.dirty).toBe(true);
  expect((await cached(sites[2].url)).dataUrl).toBeNull();
  await visitor.close(); await page.bringToFront();
  await page.locator(`.tile[data-id="${ids[101]}"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`.tile[data-id="${ids[101]}"] .tile-art img`)).toBeVisible();
  expect((await cached(sites[2].url)).dataUrl).toMatch(/^data:image\/png;base64,/);
  expect(sites[2].requests).toBe(1); // The browser supplied an icon at the requested resolution.
});
test('clicking a bookmark refreshes its saved icon after the page visit', async () => {
  await page.locator(`.tile[data-id="${ids[100]}"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`.tile[data-id="${ids[100]}"] .tile-art img`)).toBeVisible();
  const before = (await cached(sites[1].url)).dataUrl;
  sites[1].version = 1;
  const opened = context.waitForEvent('page');
  await page.locator(`.tile[data-id="${ids[100]}"] .tile-main`).click();
  const visitor = await opened; await visitor.waitForLoadState();
  await expect.poll(async () => (await cached(sites[1].url))?.revision || 0).toBeGreaterThan(0);
  await visitor.close(); await page.bringToFront();
  await expect.poll(async () => (await cached(sites[1].url))?.dataUrl).not.toBe(before);
  const requests = sites[1].requests;
  await page.reload(); await openAll(); await page.locator(`.tile[data-id="${ids[100]}"]`).scrollIntoViewIfNeeded();
  await expect(page.locator(`.tile[data-id="${ids[100]}"] .tile-art img`)).toBeVisible();
  expect(sites[1].requests).toBe(requests);
  expect(errors).toEqual([]);
});
test('cached browser PNGs without MIME headers render without website requests', async () => {
  const png = (await readFile('icons/icon128.png')).toString('base64');
  const id = await page.evaluate(async () => {
    const root = (await chrome.bookmarks.getTree())[0].children.find(n => !n.unmodifiable);
    return (await chrome.bookmarks.create({ parentId: root.id, title: 'Browser cache only', url: 'https://native-cache.example/' })).id;
  });
  await page.evaluate(base64 => {
    const original = globalThis.fetch;
    globalThis.nativeIconRequests = 0; globalThis.unwantedSiteRequests = 0;
    globalThis.fetch = async (value, options) => {
      const url = new URL(value);
      if (url.pathname === '/_favicon/' && url.searchParams.get('pageUrl') === 'https://native-cache.example/') {
        globalThis.nativeIconRequests++;
        // Match Brave's observed response: valid image bytes, no Content-Type.
        return new Response(Uint8Array.from(atob(base64), c => c.charCodeAt(0)), { status: 200 });
      }
      if (url.hostname === 'native-cache.example') {
        globalThis.unwantedSiteRequests++; throw new Error('Website is unreachable');
      }
      return original(value, options);
    };
  }, png);
  await page.locator('#search').fill('Browser cache only');
  await expect(page.locator(`.tile[data-id="${id}"] .tile-art img`)).toBeVisible();
  expect(await page.evaluate(() => globalThis.nativeIconRequests)).toBe(1);
  expect(await page.evaluate(() => globalThis.unwantedSiteRequests)).toBe(0);
});
test('old failed lookups retry once after the fix and remain cached afterward', async () => {
  const origin = new URL(sites[0].url).origin;
  await page.evaluate(async origin => {
    const { readIcon, writeIcon } = await import('./src/favicon-cache.js');
    const existing = await readIcon(origin);
    await writeIcon(origin, existing.revision, { dataUrl: null, pageUrl: origin + '/', checkedAt: Date.now() });
  }, origin);
  const requests = sites[0].requests;
  await page.goto(extensionUrl); await openAll();
  await expect(page.locator(`.tile[data-id="${ids[0]}"] .tile-art img`)).toBeVisible();
  expect(sites[0].requests).toBe(requests + 1);
  expect((await cached(sites[0].url)).cacheVersion).toBe(3);
  await page.reload(); await openAll();
  await expect(page.locator(`.tile[data-id="${ids[0]}"] .tile-art img`)).toBeVisible();
  expect(sites[0].requests).toBe(requests + 1);
});

test('favicons do not depend on an available background message receiver', async () => {
  await page.goto(extensionUrl); await openAll();
  const error = await page.evaluate(async () => {
    try { await chrome.runtime.sendMessage({ type: 'get-bookmark-favicon', id: 'unused' }); }
    catch (error) { return error.message; }
  });
  expect(error).toContain('Receiving end does not exist');
  await expect(page.locator(`.tile[data-id="${ids[0]}"] .tile-art img`)).toBeVisible();
  expect(await page.locator('#toast').isVisible()).toBe(false);
});

test('Retina lookups prefer a larger original and remember unsuccessful size upgrades', async () => {
  const small = (await readFile('icons/icon32.png')).toString('base64');
  const large = (await readFile('icons/icon128.png')).toString('base64');
  const result = await page.evaluate(async ({ small, large }) => {
    const originalFetch = globalThis.fetch;
    const originalDpr = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio');
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 2 });
    const requests = [];
    globalThis.fetch = async (value, options) => {
      const url = new URL(value);
      if (url.searchParams.get('pageUrl') === 'https://sharp.example/' || url.hostname === 'sharp.example') {
        requests.push(url.href);
        return new Response(Uint8Array.from(atob(url.hostname === 'sharp.example' ? large : small), c => c.charCodeAt(0)), { headers: { 'content-type': 'image/png' } });
      }
      return originalFetch(value, options);
    };
    try {
      const bookmark = await chrome.bookmarks.create({ title: 'Sharp icon test', url: 'https://sharp.example/' });
      const { getBookmarkIcon } = await import('./src/favicon-service.js');
      const first = await getBookmarkIcon(bookmark.id);
      const second = await getBookmarkIcon(bookmark.id);
      await chrome.bookmarks.remove(bookmark.id);
      return { first, second, requests };
    } finally {
      globalThis.fetch = originalFetch;
      Object.defineProperty(window, 'devicePixelRatio', originalDpr);
    }
  }, { small, large });
  expect(result.first.dataUrl).toBe(`data:image/png;base64,${large}`);
  expect(result.second).toEqual(result.first);
  expect(result.requests).toHaveLength(2);
  expect(new URL(result.requests[0]).searchParams.get('size')).toBe('256');
});

test('saved grid and preview icons are attached synchronously before insertion', async () => {
  await page.goto(extensionUrl); await openAll();
  await expect(page.locator(`.tile[data-id="${ids[0]}"] .tile-art img`)).toBeVisible();
  const requests = sites[0].requests;
  const results = await page.evaluate(async ({ id, url }) => {
    const { observeFavicon, releaseFavicons } = await import('./src/favicons.js');
    return ['tile-art', 'mini-icon'].map(className => {
      const container = document.createElement('span'); container.className = className;
      const fallback = document.createElement('span'); fallback.textContent = 'V'; container.append(fallback);
      observeFavicon(container, { id, url }, fallback);
      // No observer callback, animation frame, or async image load has run yet.
      const result = { image: Boolean(container.querySelector('img')?.src.startsWith('data:image/')), hidden: fallback.hidden };
      releaseFavicons(container);
      return result;
    });
  }, { id: ids[0], url: sites[0].url });
  expect(results).toEqual([{ image: true, hidden: true }, { image: true, hidden: true }]);
  expect(sites[0].requests).toBe(requests);
});

test('reload inserts cached icons with the initial bookmark render', async () => {
  const requests = sites[0].requests;
  await page.addInitScript(() => {
    window.firstGridIcons = null;
    const observer = new MutationObserver(() => {
      const tile = document.querySelector('.tile .tile-art');
      if (!tile || window.firstGridIcons !== null) return;
      window.firstGridIcons = Boolean(tile.querySelector('img'));
      observer.disconnect();
    });
    observer.observe(document, { subtree: true, childList: true });
  });
  await page.reload(); await openAll();
  await expect.poll(() => page.evaluate(() => window.firstGridIcons)).toBe(true);
  expect(sites[0].requests).toBe(requests);
});
