import { test, expect, chromium } from '@playwright/test';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
let context, page, profile, extensionUrl, folderId, nestedId, bookmarkIds;
const errors = [];
test.beforeAll(async () => {
  profile = await mkdtemp(path.join(tmpdir(), 'anaquel-browser-test-'));
  const extension = path.resolve('.');
  context = await chromium.launchPersistentContext(profile, {
    executablePath: process.env.BROWSER_PATH || '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    headless: true, viewport: { width: 1440, height: 1000 },
    args: [`--disable-extensions-except=${extension}`, `--load-extension=${extension}`, '--no-first-run']
  });
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
  extensionUrl = `chrome-extension://${worker.url().split('/')[2]}/index.html`;
  page = await context.newPage(); page.on('pageerror', e => errors.push(e.message));
  await page.goto(extensionUrl);
  const data = await page.evaluate(async () => {
    const [root] = await chrome.bookmarks.getTree();
    const bar = root.children.find(n => !n.unmodifiable);
    const folder = await chrome.bookmarks.create({ parentId: bar.id, title: 'Design collection' });
    const nested = await chrome.bookmarks.create({ parentId: folder.id, title: 'Typography' });
    const ids = [];
    for (const title of ['Alpha', 'Bravo', 'Charlie']) ids.push((await chrome.bookmarks.create({ parentId: folder.id, title, url: `https://${title.toLowerCase()}.example/` })).id);
    await chrome.bookmarks.create({ parentId: nested.id, title: 'Nested find', url: 'https://nested.example/' });
    return { folder: folder.id, nested: nested.id, ids };
  });
  folderId = data.folder; nestedId = data.nested; bookmarkIds = data.ids;
  await expect(page.locator('#breadcrumbs')).toHaveText('Pinned');
  await expect(page.locator('#grid .tile')).toHaveCount(0);
});
test.afterAll(async () => { await context?.close(); if (profile) await rm(profile, { recursive: true, force: true }); });
test('loads native bookmarks and navigates nested breadcrumbs', async () => {
  expect(await page.locator('#collections .collection').evaluateAll(nodes => nodes.slice(0, 2).map(node => node.dataset.id))).toEqual(['pinned', 'all']);
  await expect(page.locator('.collection[data-id="all"] .collection-icon svg')).toHaveCount(1);
  await expect(page.locator('#collections img')).toHaveCount(0);
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  await expect(page.locator('#grid .tile')).toHaveCount(4);
  await page.locator(`.tile[data-id="${nestedId}"] .tile-main`).click();
  await expect(page.locator('#breadcrumbs')).toContainText('Typography');
  await expect(page.locator('#grid .tile')).toHaveCount(1);
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
});
test('pins nested folders but keeps left-rail folders unpinnable', async () => {
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  await expect(page.locator(`.tile[data-id="${nestedId}"] .pin-button`)).toHaveCount(1);
  await page.getByRole('button', { name: `Pin Typography`, exact: true }).click();
  await expect(page.getByRole('button', { name: `Unpin Typography`, exact: true })).toBeVisible();
  await expect(page.locator(`.collection[data-id="${folderId}"] .pin-button`)).toHaveCount(0);
  await page.locator('.collection[data-id="pinned"] .collection-open').click();
  await expect(page.locator(`.tile[data-id="${nestedId}"]`)).toHaveCount(1);
  await page.getByRole('button', { name: 'Unpin Typography', exact: true }).click();
  await page.locator('.collection[data-id="all"] .collection-open').click();
});
test('creates a bookmark, edits its URL and moves it into a nested folder', async () => {
  await page.getByRole('button', { name: 'Add bookmark or folder', exact: true }).click();
  await page.locator('#item-title').fill('New find'); await page.locator('#item-url').fill('example.com');
  await page.locator('#item-parent').selectOption(folderId); await page.locator('#save-item').click();
  await expect(page.getByRole('link', { name: 'Open New find', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Edit New find', exact: true }).click();
  await page.locator('#item-title').fill('Better find'); await page.locator('#item-url').fill('https://example.org/');
  await page.locator('#item-parent').selectOption(nestedId); await page.locator('#save-item').click();
  const actual = await page.evaluate(async () => (await chrome.bookmarks.search({ title: 'Better find' }))[0]);
  expect(actual.url).toBe('https://example.org/'); expect(actual.parentId).toBe(nestedId);
});
test('pinned bookmarks are hidden from All Bookmarks and persist after reload', async () => {
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  await page.getByRole('button', { name: 'Pin Charlie', exact: true }).click();
  await expect(page.locator('#grid .tile').first()).toHaveAttribute('data-id', bookmarkIds[2]);
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  await expect(page.locator(`.tile[data-id="${bookmarkIds[2]}"]`)).toHaveCount(0);
  await page.reload(); await expect(page.locator(`.tile[data-id="${bookmarkIds[2]}"]`)).toHaveCount(0);
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  await page.getByRole('button', { name: 'Unpin Charlie', exact: true }).click();
});
test('global search finds nested bookmarks and folder filter works', async () => {
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  await page.locator('#search').fill('nested.example'); await expect(page.locator('#grid .tile')).toHaveCount(1);
  await expect(page.locator('#grid')).toContainText('Nested find'); await page.locator('#search').fill('');
  await page.getByRole('button', { name: 'Filter folders', exact: true }).click();
  await page.locator('#folder-sort').selectOption('count');
  await page.getByRole('button', { name: 'Filter folders', exact: true }).click();
});
test('native forward and backward drag ordering matches the visible order', async () => {
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  const source = page.locator(`.tile[data-id="${bookmarkIds[0]}"]`), target = page.locator(`.tile[data-id="${bookmarkIds[2]}"]`);
  await expect(target).toBeVisible();
  const box = await target.boundingBox();
  await source.dragTo(target, { targetPosition: { x: box.width - 2, y: box.height / 2 } });
  await expect.poll(async () => page.evaluate(async id => (await chrome.bookmarks.getChildren(id)).filter(n => n.url).map(n => n.title), folderId)).toEqual(['Bravo', 'Charlie', 'Alpha']);
  const first = page.locator(`.tile[data-id="${bookmarkIds[1]}"]`);
  await source.dragTo(first, { targetPosition: { x: 1, y: 30 } });
  await expect.poll(async () => page.evaluate(async id => (await chrome.bookmarks.getChildren(id)).filter(n => n.url).map(n => n.title), folderId)).toEqual(['Alpha', 'Bravo', 'Charlie']);
  const [alphaBox, bravoBox, gridBox] = await Promise.all([source.boundingBox(), first.boundingBox(), page.locator('#grid').boundingBox()]);
  expect(bravoBox.x).toBeGreaterThan(alphaBox.x + alphaBox.width);
  await target.dragTo(page.locator('#grid'), { targetPosition: {
    x: (alphaBox.x + alphaBox.width + bravoBox.x) / 2 - gridBox.x,
    y: alphaBox.y + alphaBox.height / 2 - gridBox.y
  } });
  await expect.poll(async () => page.evaluate(async id => (await chrome.bookmarks.getChildren(id)).filter(n => n.url).map(n => n.title), folderId)).toEqual(['Alpha', 'Charlie', 'Bravo']);
});
test('drag insertion uses one crisp line at the gap midpoint', async () => {
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  const marker = await page.evaluate(({ sourceId, targetId }) => {
    const source = document.querySelector(`.tile[data-id="${sourceId}"]`);
    const target = document.querySelector(`.tile[data-id="${targetId}"]`);
    const grid = document.querySelector('#grid');
    const transfer = new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    const targetRect = target.getBoundingClientRect();
    target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: transfer, clientX: targetRect.right - 1, clientY: targetRect.top + targetRect.height / 2 }));
    const line = document.querySelector('.drag-indicator');
    const lineRect = line.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(grid).columnGap);
    const expectedLeft = Math.round((targetRect.right + gap / 2) * devicePixelRatio) / devicePixelRatio;
    const result = { count: document.querySelectorAll('.drag-indicator').length, hidden: line.hidden, width: lineRect.width, left: lineRect.left, expectedLeft, boxShadow: getComputedStyle(target).boxShadow };
    source.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: transfer }));
    return result;
  }, { sourceId: bookmarkIds[0], targetId: bookmarkIds[1] });
  expect(marker.count).toBe(1); expect(marker.hidden).toBe(false); expect(marker.width).toBe(1);
  expect(marker.left).toBeCloseTo(marker.expectedLeft, 3); expect(marker.boxShadow).toBe('none');
});
test('drag insertion hides no-op gaps beside the source tile', async () => {
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  const result = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('#grid .tile')].filter(tile => tile.querySelector('.tile-domain')?.textContent.includes('.example'));
    const [before, source, after] = tiles;
    const transfer = new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    for (const [target, x] of [[before, 'right'], [after, 'left']]) {
      const rect = target.getBoundingClientRect();
      target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: transfer, clientX: x === 'right' ? rect.right - 1 : rect.left + 1, clientY: rect.top + rect.height / 2 }));
      if (document.querySelector('.drop-before,.drop-after') || !document.querySelector('.drag-indicator')?.hidden) return false;
    }
    source.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: transfer }));
    return true;
  });
  expect(result).toBe(true);
});
test('list drag insertion centers the line in the rendered row gap', async () => {
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#size-setting').selectOption('list'); await page.getByRole('button', { name: 'All set', exact: true }).click();
  const marker = await page.evaluate(() => {
    const tiles = [...document.querySelectorAll('#grid .tile')].filter(tile => tile.querySelector('.tile-domain')?.textContent.includes('.example'));
    const source = tiles[0], target = tiles.at(-1), previous = target.previousElementSibling;
    const transfer = new DataTransfer();
    source.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: transfer }));
    const targetRect = target.getBoundingClientRect(), previousRect = previous.getBoundingClientRect();
    target.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: transfer, clientX: targetRect.left + targetRect.width / 2, clientY: targetRect.top + 1 }));
    const line = document.querySelector('.drag-indicator');
    const expectedTop = Math.round(((previousRect.bottom + targetRect.top) / 2) * devicePixelRatio) / devicePixelRatio;
    const result = { hidden: line.hidden, top: line.getBoundingClientRect().top, expectedTop };
    source.dispatchEvent(new DragEvent('dragend', { bubbles: true, dataTransfer: transfer }));
    return result;
  });
  expect(marker.hidden).toBe(false); expect(marker.top).toBeCloseTo(marker.expectedTop, 3);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#size-setting').selectOption('comfortable'); await page.getByRole('button', { name: 'All set', exact: true }).click();
});
test('list view does not reposition folder-side edit controls', async () => {
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#size-setting').selectOption('list'); await page.getByRole('button', { name: 'All set', exact: true }).click();
  await page.getByRole('button', { name: 'Organize bookmarks', exact: true }).click();
  const positions = await page.locator(`.collection[data-id="${folderId}"]`).evaluate(card => {
    const edit = card.querySelector('.more-button').getBoundingClientRect();
    const remove = card.querySelector('.delete-button').getBoundingClientRect();
    const tile = card.getBoundingClientRect();
    return { editTop: edit.top - tile.top, editRight: tile.right - edit.right, removeTop: remove.top - tile.top };
  });
  expect(positions.editTop).toBeCloseTo(positions.removeTop, 3);
  expect(positions.editRight).toBeCloseTo(0, 3);
  await page.locator('#done').click();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#size-setting').selectOption('comfortable'); await page.getByRole('button', { name: 'All set', exact: true }).click();
});
test('drag into a folder changes the actual native parent', async () => {
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  const source = page.locator(`.tile[data-id="${bookmarkIds[2]}"]`), folder = page.locator(`.tile[data-id="${nestedId}"]`);
  await source.dragTo(folder);
  await expect.poll(async () => page.evaluate(async id => (await chrome.bookmarks.get(id))[0].parentId, bookmarkIds[2])).toBe(nestedId);
});
test('edit mode deletes bookmarks after confirmation', async () => {
  await page.getByRole('button', { name: 'Organize bookmarks', exact: true }).click();
  await page.getByRole('button', { name: 'Delete Bravo', exact: true }).click();
  await expect(page.locator('#delete-description')).toContainText('Bravo');
  await page.locator('#confirm-delete').click();
  await expect(page.locator(`.tile[data-id="${bookmarkIds[1]}"]`)).toHaveCount(0);
  expect(await page.evaluate(async () => (await chrome.bookmarks.search({ title: 'Bravo' })).length)).toBe(0);
  await page.locator('#done').click();
});
test('creates a main folder and a nested folder, then deletes their tree', async () => {
  await page.getByRole('button', { name: 'New main folder', exact: true }).click();
  await page.locator('#item-title').fill('Temporary collection'); await page.locator('#save-item').click();
  await page.getByRole('button', { name: 'Temporary collection, 0 bookmarks', exact: true }).click();
  await page.getByRole('button', { name: 'Add bookmark or folder', exact: true }).click();
  await page.locator('[data-create-type="folder"]').click(); await page.locator('#item-title').fill('Inside'); await page.locator('#save-item').click();
  await expect(page.locator('#grid')).toContainText('Inside');
  await page.getByRole('button', { name: 'Organize bookmarks', exact: true }).click();
  await page.getByRole('button', { name: 'Delete Temporary collection', exact: true }).click();
  await page.locator('#confirm-delete').click();
  await expect(page.locator('#breadcrumbs')).toHaveText('All Bookmarks');
  expect(await page.evaluate(async () => (await chrome.bookmarks.search({ title: 'Inside' })).length)).toBe(0);
  await page.locator('#done').click();
});
test('settings persist and narrow screens avoid horizontal overflow', async () => {
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#theme-setting').selectOption('light'); await page.locator('#size-setting').selectOption('compact'); await page.locator('#folder-view-setting').selectOption('tiles');
  await page.getByRole('button', { name: 'All set', exact: true }).click(); await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light'); await expect(page.locator('body')).toHaveClass(/compact/); await expect(page.locator('body')).toHaveClass(/folder-tile-view/);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.locator('#size-setting').selectOption('spacious');
  await page.getByRole('button', { name: 'All set', exact: true }).click(); await page.reload();
  await expect(page.locator('body')).toHaveClass(/spacious/);
  await page.setViewportSize({ width: 600, height: 850 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Settings', exact: true }).click(); await page.locator('#folder-view-setting').selectOption('list'); await page.getByRole('button', { name: 'All set', exact: true }).click();
  expect(errors).toEqual([]);
});
test('All Bookmarks drag order persists without changing native folders', async () => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  const source = page.locator(`.tile[data-id="${bookmarkIds[0]}"]`);
  const target = page.locator(`.tile[data-id="${bookmarkIds[2]}"]`);
  await expect(target).toBeVisible();
  const box = await target.boundingBox();
  await source.dragTo(target, { targetPosition: { x: box.width - 8, y: box.height / 2 } });
  await expect.poll(async () => page.evaluate(async () => (await chrome.storage.local.get('preferences')).preferences.allOrder)).toContain(bookmarkIds[0]);
  await page.reload();
  const ids = await page.locator('#grid .tile').evaluateAll(nodes => nodes.map(n => n.dataset.id));
  expect(ids.indexOf(bookmarkIds[0])).toBe(ids.indexOf(bookmarkIds[2]) + 1);
  expect(await page.evaluate(async id => (await chrome.bookmarks.get(id))[0].parentId, bookmarkIds[0])).toBe(folderId);
  await page.getByRole('button', { name: 'Filter this view', exact: true }).click();
  await page.locator('#reset-filters').click(); await expect(page.locator('#grid .tile')).toHaveCount(4);
  expect(errors).toEqual([]);
});
test('existing folders receive persistent colors and use their own initial', async () => {
  await page.goto(extensionUrl);
  const initial = page.locator(`.collection[data-id="${folderId}"] .folder-initial`);
  await expect(initial).toHaveText('D');
  const colors = await page.evaluate(async () => Object.fromEntries(Object.entries(await chrome.storage.local.get(null)).filter(([key]) => key.startsWith('folderColor:'))));
  expect(colors[`folderColor:${folderId}`]).toMatch(/^#[0-9a-f]{6}$/i);
  expect(colors[`folderColor:${nestedId}`]).toMatch(/^#[0-9a-f]{6}$/i);
  const color = await initial.evaluate(n => n.style.color);
  await expect(page.locator(`.collection[data-id="${folderId}"] .mini-icon`)).toHaveCount(1);
  await page.reload(); await expect(initial).toHaveText('D');
  expect(await initial.evaluate(n => n.style.color)).toBe(color);
  expect(await page.evaluate(async id => (await chrome.storage.local.get(`folderColor:${id}`))[`folderColor:${id}`], folderId)).toBe(colors[`folderColor:${folderId}`]);
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  await expect(page.locator(`.tile[data-id="${nestedId}"] .folder-initial`)).toHaveText('T');
  await expect(page.locator(`.tile[data-id="${nestedId}"] .mini-icon`)).toHaveCount(4);
});
test('folder creation and editing save chosen colors across rename and move', async () => {
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  await page.getByRole('button', { name: 'New main folder', exact: true }).click();
  await page.locator('#item-title').fill('Colored folder');
  await expect(page.locator('#folder-initial-preview')).toHaveText('C');
  await page.getByRole('button', { name: 'Purple', exact: true }).click();
  await page.locator('#save-item').click();
  const node = await page.evaluate(async () => (await chrome.bookmarks.search({ title: 'Colored folder' }))[0]);
  const card = page.locator(`.collection[data-id="${node.id}"]`);
  await expect(card.locator('.folder-initial')).toHaveText('C');
  expect(await card.locator('.folder-initial').evaluate(n => n.style.getPropertyValue('--folder-initial-color'))).toBe('#ac91ff');
  await page.getByRole('button', { name: 'Organize bookmarks', exact: true }).click();
  await page.getByRole('button', { name: 'Edit Colored folder', exact: true }).click();
  await expect(page.locator('#folder-color')).toHaveValue('#ac91ff');
  await page.locator('#item-title').fill('Renamed folder');
  await page.locator('#folder-color').fill('#ff3300');
  await expect(page.locator('#folder-initial-preview')).toHaveText('R');
  await page.locator('#item-parent').selectOption(folderId);
  await page.locator('#save-item').click();
  await page.locator('#done').click();
  await page.reload(); await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  const initial = page.locator(`.tile[data-id="${node.id}"] .folder-initial`);
  await expect(initial).toHaveText('R');
  expect(await initial.evaluate(n => n.style.getPropertyValue('--folder-initial-color'))).toBe('#ff3300');
  expect(await page.evaluate(async id => (await chrome.storage.local.get(`folderColor:${id}`))[`folderColor:${id}`], node.id)).toBe('#ff3300');
  // Canceling a color change must not persist it.
  await page.getByRole('button', { name: 'Edit Renamed folder', exact: true }).click();
  await page.getByRole('button', { name: 'Blue', exact: true }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(await initial.evaluate(n => n.style.getPropertyValue('--folder-initial-color'))).toBe('#ff3300');
});
test('browser root folder colors can change without editing native root properties', async () => {
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  const root = await page.evaluate(async () => (await chrome.bookmarks.getTree())[0].children.find(n => !n.unmodifiable));
  await page.getByRole('button', { name: 'Organize bookmarks', exact: true }).click();
  await page.locator(`.collection[data-id="${root.id}"] .more-button`).click();
  await expect(page.locator('#item-title')).toBeDisabled();
  await expect(page.locator('#item-parent')).toBeHidden();
  await page.getByRole('button', { name: 'Coral', exact: true }).click(); await page.locator('#save-item').click();
  expect(await page.evaluate(async id => (await chrome.bookmarks.get(id))[0].title, root.id)).toBe(root.title);
  expect(await page.locator(`.collection[data-id="${root.id}"] .folder-initial`).evaluate(n => n.style.getPropertyValue('--folder-initial-color'))).toBe('#ed9487');
  await page.locator('#done').click();
  await page.getByRole('button', { name: 'Add bookmark or folder', exact: true }).click();
  await expect(page.locator('#item-title')).toBeEnabled(); await expect(page.locator('#item-parent')).toBeEnabled();
  await expect(page.locator('#folder-appearance')).toBeHidden();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  expect(errors).toEqual([]);
});

test('batch edit selects visible bookmarks and confirms deletion', async () => {
  await page.goto(extensionUrl);
  await page.getByRole('button', { name: 'All Bookmarks', exact: true }).click();
  const ids = await page.evaluate(async () => {
    const root = (await chrome.bookmarks.getTree())[0].children.find(n => !n.unmodifiable);
    const result = [];
    for (let i = 0; i < 2; i++) result.push((await chrome.bookmarks.create({ parentId: root.id, title: `Batch deletion check ${i}`, url: 'https://example.com/' })).id);
    return result;
  });
  await page.locator('#search').fill('Batch deletion check');
  await expect(page.locator('#grid .tile')).toHaveCount(2);
  await page.locator('#edit-mode').click();
  await expect(page.locator('#grid .pin-button').first()).toBeHidden();
  await expect(page.locator('#grid .more-button').first()).toBeHidden();
  await page.locator('#batch-toggle').check();
  await page.locator('#select-visible').click();
  await expect(page.locator('#delete-selected')).toHaveText('Delete selected (2)');
  await page.locator('#delete-selected').click();
  await expect(page.locator('#delete-description')).toContainText('2 bookmarks');
  await page.locator('#delete-dialog .secondary').click();
  expect(await page.evaluate(async ids => (await chrome.bookmarks.get(ids)).length, ids)).toBe(2);
  await page.locator('#delete-selected').click();
  await page.locator('#confirm-delete').click();
  await expect(page.locator('#grid .tile')).toHaveCount(0);
  expect(await page.evaluate(async () => (await chrome.bookmarks.search('Batch deletion check')).length)).toBe(0);
  await page.locator('#done').click();
  await expect(page.locator('#batch-tools')).toBeHidden();
});

test('Shift-selected bookmarks and folders drag together', async () => {
  await page.goto(extensionUrl);
  await page.locator(`.collection[data-id="${folderId}"] .collection-open`).click();
  const alpha = page.locator(`.tile[data-id="${bookmarkIds[0]}"] .tile-main`);
  const bravo = page.locator(`.tile[data-id="${bookmarkIds[1]}"] .tile-main`);
  await alpha.click({ modifiers: ['Shift'] });
  await bravo.click({ modifiers: ['Shift'] });
  await expect(page.locator(`.tile[data-id="${bookmarkIds[0]}"]`)).toHaveClass(/batch-selected/);
  await expect(page.locator(`.tile[data-id="${bookmarkIds[1]}"]`)).toHaveClass(/batch-selected/);
  await page.locator(`.tile[data-id="${bookmarkIds[0]}"]`).dragTo(page.locator(`.tile[data-id="${nestedId}"]`));
  await expect.poll(() => page.evaluate(async ids => (await chrome.bookmarks.get(ids)).map(node => node.parentId), [bookmarkIds[0], bookmarkIds[1]])).toEqual([nestedId, nestedId]);
  const ids = await page.evaluate(async () => {
    const root = (await chrome.bookmarks.getTree())[0].children.find(node => !node.unmodifiable);
    const target = await chrome.bookmarks.create({ parentId: root.id, title: 'Group drop target' });
    const first = await chrome.bookmarks.create({ parentId: root.id, title: 'Group drop first' });
    const second = await chrome.bookmarks.create({ parentId: root.id, title: 'Group drop second' });
    return { target: target.id, first: first.id, second: second.id };
  });
  await expect(page.locator(`.collection[data-id="${ids.target}"]`)).toBeVisible();
  await page.locator(`.collection[data-id="${ids.first}"] .collection-open`).click({ modifiers: ['Shift'] });
  await page.locator(`.collection[data-id="${ids.second}"] .collection-open`).click({ modifiers: ['Shift'] });
  await expect(page.locator(`.collection[data-id="${ids.first}"]`)).toHaveClass(/batch-selected/);
  await expect(page.locator(`.collection[data-id="${ids.second}"]`)).toHaveClass(/batch-selected/);
  await page.locator(`.collection[data-id="${ids.first}"]`).dragTo(page.locator(`.collection[data-id="${ids.target}"]`));
  await expect.poll(() => page.evaluate(async values => (await chrome.bookmarks.get([values.first, values.second])).map(node => node.parentId), ids)).toEqual([ids.target, ids.target]);
});
