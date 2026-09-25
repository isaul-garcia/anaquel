import { bookmarksForDomain, domainKey } from './model.js';
import { icon } from './icons.js';
import { store } from './store.js';

const $ = selector => document.querySelector(selector);
let bookmarks = [], preferences = { pins: {} }, deleteBookmark = null, noticeTimer, activeDomain = '';

function bookmarkLabel(bookmark) {
  return bookmark.title || domainKey(bookmark.url) || 'Untitled bookmark';
}

function bookmarkLocation(bookmark) {
  try {
    const url = new URL(bookmark.url);
    return `${url.hostname}${url.pathname === '/' ? '' : url.pathname}${url.search}`;
  } catch {
    return bookmark.url;
  }
}

function showEmpty(message, detail = '') {
  const empty = document.createElement('div');
  empty.className = 'empty-state';
  const title = document.createElement('p');
  title.textContent = message;
  empty.append(title);
  if (detail) {
    const description = document.createElement('p');
    description.textContent = detail;
    empty.append(description);
  }
  $('#bookmark-list').replaceChildren(empty);
}

function showSiteFavicon(tab) {
  const container = $('#site-favicon');
  const fallback = container.querySelector('span');
  const browserIcon = new URL(chrome.runtime.getURL('/_favicon/'));
  browserIcon.searchParams.set('pageUrl', tab.url);
  browserIcon.searchParams.set('size', '64');
  const sources = [...new Set([tab.favIconUrl, browserIcon.href].filter(Boolean))];
  function trySource(index) {
    if (!sources[index]) return;
    const image = new Image();
    image.alt = '';
    image.onload = () => {
      container.querySelector('img')?.remove();
      fallback.hidden = true;
      container.prepend(image);
    };
    image.onerror = () => trySource(index + 1);
    image.src = sources[index];
  }
  trySource(0);
}

function showNotice(message) {
  clearTimeout(noticeTimer);
  const notice = $('#popup-notice');
  notice.textContent = message;
  notice.hidden = false;
  noticeTimer = setTimeout(() => { notice.hidden = true; }, 2500);
}

function isPinned(id) {
  return Object.values(preferences.pins || {}).some(ids => Array.isArray(ids) && ids.includes(id));
}

function updatePinButton(button, bookmark) {
  const pinned = isPinned(bookmark.id);
  button.classList.toggle('pin-active', pinned);
  button.setAttribute('aria-pressed', String(pinned));
  button.setAttribute('aria-label', `${pinned ? 'Unpin' : 'Pin'} ${bookmarkLabel(bookmark)}`);
  button.title = pinned ? 'Unpin' : 'Pin';
}

async function togglePin(bookmark, button) {
  button.disabled = true;
  try {
    const latest = await store.preferences();
    const pins = structuredClone(latest.pins || {});
    const pinned = Object.values(pins).some(ids => Array.isArray(ids) && ids.includes(bookmark.id));
    if (pinned) {
      for (const key of Object.keys(pins)) pins[key] = pins[key].filter(id => id !== bookmark.id);
    } else {
      pins.all = [...new Set([...(pins.all || []), bookmark.id])];
    }
    preferences = { ...latest, pins };
    await store.savePreferences(preferences);
    updatePinButton(button, bookmark);
    showNotice(pinned ? 'Bookmark unpinned.' : 'Bookmark pinned.');
  } catch (error) {
    showNotice(error.message || 'Could not update this pin.');
  } finally {
    button.disabled = false;
  }
}

function askDelete(bookmark) {
  deleteBookmark = bookmark;
  $('#delete-description').textContent = `“${bookmarkLabel(bookmark)}” will be permanently deleted from your browser’s bookmarks.`;
  $('#delete-error').textContent = '';
  $('#delete-dialog').showModal();
  $('#cancel-delete').focus();
}

function openBookmark(bookmark) {
  return async () => {
    await chrome.tabs.create({ url: bookmark.url, active: true });
    window.close();
  };
}

function renderBookmarks(bookmarks) {
  const list = $('#bookmark-list');
  const fragment = document.createDocumentFragment();
  for (const bookmark of bookmarks) {
    const row = document.createElement('div');
    row.className = 'bookmark-row';

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'bookmark-open';
    open.title = bookmark.url;
    open.setAttribute('aria-label', `Open ${bookmarkLabel(bookmark)}`);
    open.addEventListener('click', openBookmark(bookmark));

    const mark = document.createElement('span');
    mark.className = 'bookmark-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = bookmarkLabel(bookmark).trim().charAt(0).toUpperCase() || '?';

    const details = document.createElement('span');
    details.className = 'bookmark-details';
    const title = document.createElement('span');
    title.className = 'bookmark-title';
    title.textContent = bookmarkLabel(bookmark);
    const metadata = document.createElement('span');
    metadata.className = 'bookmark-meta';
    const path = bookmark.folders.join(' › ');
    metadata.textContent = path ? `${path} · ${bookmarkLocation(bookmark)}` : bookmarkLocation(bookmark);
    details.append(title, metadata);
    open.append(mark, details);

    const actions = document.createElement('span');
    actions.className = 'bookmark-actions';
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'bookmark-action pin';
    pin.append(icon('popup-pin'));
    updatePinButton(pin, bookmark);
    pin.addEventListener('click', () => togglePin(bookmark, pin));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'bookmark-action delete';
    remove.title = 'Delete';
    remove.setAttribute('aria-label', `Delete ${bookmarkLabel(bookmark)}`);
    remove.append(icon('trash'));
    remove.addEventListener('click', () => askDelete(bookmark));
    actions.append(pin, remove);
    row.append(open, actions);
    fragment.append(row);
  }
  list.replaceChildren(fragment);
}

function renderCurrentBookmarks() {
  const count = $('#bookmark-count');
  count.textContent = String(bookmarks.length);
  count.hidden = false;
  if (!bookmarks.length) {
    showEmpty(`No bookmarks saved for ${$('#popup-title').textContent}.`, 'Bookmarks from every folder will appear here.');
  } else {
    renderBookmarks(bookmarks);
  }
}

async function load() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const currentDomain = domainKey(tab?.url);
  if (!currentDomain) {
    $('#popup-title').textContent = 'This page is unavailable';
    showEmpty('Open a website to see its saved bookmarks.', 'Browser and extension pages do not have a matching web domain.');
    return;
  }

  activeDomain = currentDomain;
  $('#popup-title').textContent = currentDomain;
  showSiteFavicon(tab);
  const results = await Promise.all([chrome.bookmarks.getTree(), store.preferences()]);
  const [tree] = results[0];
  preferences = { ...preferences, ...results[1], pins: results[1].pins || {} };
  bookmarks = bookmarksForDomain(tree, tab.url);
  renderCurrentBookmarks();
}

async function openManager(domain = '') {
  try {
    await chrome.runtime.sendMessage({ type: 'open-bookmarks-manager', domain });
    window.close();
  } catch {
    const manager = new URL(chrome.runtime.getURL('index.html'));
    if (domain) {
      manager.searchParams.set('domain', domain);
      manager.hash = 'all';
    }
    await chrome.tabs.create({ url: manager.href, active: true });
    window.close();
  }
}

$('#open-pinned').addEventListener('click', () => openManager());
$('#open-manager').addEventListener('click', () => openManager(activeDomain));

$('#cancel-delete').addEventListener('click', () => $('#delete-dialog').close());
$('#delete-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!deleteBookmark) return;
  const bookmark = deleteBookmark;
  const confirm = $('#confirm-delete');
  confirm.disabled = true;
  $('#delete-error').textContent = '';
  try {
    await store.remove(bookmark.id, false);
    try {
      const latest = await store.preferences();
      const pins = structuredClone(latest.pins || {});
      for (const key of Object.keys(pins)) pins[key] = pins[key].filter(id => id !== bookmark.id);
      preferences = { ...latest, pins };
      await store.savePreferences(preferences);
    } catch { /* The deleted bookmark is filtered even if stale pin cleanup fails. */ }
    bookmarks = bookmarks.filter(item => item.id !== bookmark.id);
    deleteBookmark = null;
    $('#delete-dialog').close();
    renderCurrentBookmarks();
    showNotice('Bookmark deleted.');
  } catch (error) {
    $('#delete-error').textContent = error.message || 'Could not delete this bookmark.';
  } finally {
    confirm.disabled = false;
  }
});

load().catch(error => {
  console.error('Unable to load bookmarks for this site.', error);
  $('#popup-title').textContent = 'Could not load bookmarks';
  showEmpty('Try opening the popup again.', 'Your bookmarks are unchanged.');
});
