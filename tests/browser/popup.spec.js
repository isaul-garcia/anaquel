import { test, expect, chromium } from '@playwright/test';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

test('toolbar popup lists bookmarks from every folder for the active domain', async () => {
  const profile = await mkdtemp(path.join(tmpdir(), 'anaquel-popup-test-'));
  let context;
  try {
    const extension = path.resolve('.');
    context = await chromium.launchPersistentContext(profile, {
      executablePath: process.env.BROWSER_PATH || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      headless: true,
      args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`, '--no-first-run']
    });
    const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
    const bookmarkIds = await worker.evaluate(async () => {
      const [root] = await chrome.bookmarks.getTree();
      const bar = root.children.find(node => !node.unmodifiable);
      const folder = await chrome.bookmarks.create({ parentId: bar.id, title: 'Video references' });
      const home = await chrome.bookmarks.create({ parentId: bar.id, title: 'YouTube home', url: 'https://youtube.com/' });
      const nested = await chrome.bookmarks.create({ parentId: folder.id, title: 'Nested video', url: 'https://www.youtube.com/watch?v=123' });
      await chrome.bookmarks.create({ parentId: folder.id, title: 'Different site', url: 'https://vimeo.com/123' });
      return { home: home.id, nested: nested.id };
    });

    const extensionUrl = worker.url().replace('/src/background.js', '');
    const popup = await context.newPage();
    const favicon = (await readFile('icons/icon32.png')).toString('base64');
    await popup.addInitScript(({ favicon }) => {
      chrome.tabs.query = async () => [{
        url: 'https://www.youtube.com/watch?v=current',
        favIconUrl: `data:image/png;base64,${favicon}`
      }];
    }, { favicon });
    await popup.goto(`${extensionUrl}/popup.html`);

    await expect(popup.locator('#popup-title')).toHaveText('youtube.com');
    await expect(popup.locator('.bookmark-row')).toHaveCount(2);
    await expect(popup.locator('#site-favicon img')).toBeVisible();
    expect((await popup.locator('.bookmark-mark').allTextContents()).sort()).toEqual(['N', 'Y']);
    await popup.getByRole('button', { name: 'Pin YouTube home', exact: true }).click();
    await expect.poll(() => worker.evaluate(async id => (await chrome.storage.local.get('preferences')).preferences?.pins?.all?.includes(id), bookmarkIds.home)).toBe(true);
    await expect(popup.getByRole('button', { name: 'Unpin YouTube home', exact: true })).toBeVisible();
    await expect(popup.getByRole('button', { name: 'Manage bookmarks', exact: true })).toBeVisible();
    await expect(popup.getByRole('button', { name: 'Open Anaquel pinned bookmarks', exact: true })).toBeVisible();
    const managerPromise = context.waitForEvent('page');
    await popup.getByRole('button', { name: 'Manage bookmarks', exact: true }).click();
    const manager = await managerPromise;
    await manager.waitForLoadState('domcontentloaded');
    await expect(manager).toHaveURL(/index\.html\?domain=youtube\.com#all$/);
    await expect(manager.locator('.collection[data-id="all"] .collection-open')).toHaveAttribute('aria-current', 'page');
    await expect(manager.locator('#breadcrumbs')).toHaveText('Search results');
    await expect(manager.locator('#search')).toHaveValue('youtube.com');
    await expect(manager.locator('#grid .tile')).toHaveCount(2);
    await expect(manager.locator('#grid')).toContainText('YouTube home');
    await expect(manager.locator('#grid')).toContainText('Nested video');
    await expect(manager.locator('#grid')).not.toContainText('Different site');

    const homePopup = await context.newPage();
    await homePopup.addInitScript(({ favicon }) => {
      chrome.tabs.query = async () => [{
        url: 'https://www.youtube.com/watch?v=current',
        favIconUrl: `data:image/png;base64,${favicon}`
      }];
    }, { favicon });
    await homePopup.goto(`${extensionUrl}/popup.html`);
    await homePopup.getByRole('button', { name: 'Open Anaquel pinned bookmarks', exact: true }).click();
    await expect.poll(() => context.pages().map(page => page.url())).toContain(`${extensionUrl}/index.html`);
    const pinnedManager = context.pages().find(page => page.url() === `${extensionUrl}/index.html`);
    await expect(pinnedManager.locator('#breadcrumbs')).toHaveText('Pinned');
    await expect(pinnedManager.locator('#search')).toHaveValue('');
  } finally {
    await context?.close();
    await rm(profile, { recursive: true, force: true });
  }
});
