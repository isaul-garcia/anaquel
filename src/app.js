import { observeFavicon, releaseFavicons, prepareFavicons } from './favicons.js';
import { store, isExtension } from './store.js';
import { indexTree, descendants, folderPath, isWithin, canEdit, canContain, normalizeUrl, domainKey, matchesDomain, visibleItems, insertionIndex } from './model.js';
import { icon } from './icons.js';
import { folderPalette, isFolderColor, randomFolderColor, folderInitial, folderColorBackground } from './folder-colors.js';
const $ = selector => document.querySelector(selector);
const state = { root: null, map: new Map(), folderColors: {}, prefs: { pins: {}, theme: 'dark', size: 'comfortable', folderView: 'list', view: 'grid', newTab: true }, current: 'pinned', edit: false, query: '', domainFilter: '', searchMode: 'bookmarks', folderSort: 'manual', type: 'all', sort: 'manual', dragId: null, dragIds: [], busy: false };
const emojiMeasure = document.createElement('canvas').getContext('2d');
let batchMode = false, selectedIds = new Set(), deleteIds = [];
let editorId = null, editorType = 'bookmark', deleteId = null, toastTimer, reloadTimer, dropIndicator;
let reloadVersion = 0, treeSignature = '', colorSignature = '';
const demoBrands = {
  'www.are.na': ['✳✳', '#d9dcce', '#252823'], 'notion.so': ['N', '#eeeee6', '#242521'], 'read.cv': ['↗', '#9ebea9', '#24372b'],
  'open.spotify.com': ['≋', '#89d7a1', '#193a26'], 'cosmos.so': ['✳', '#d9cff1', '#392c48'], 'pinterest.com': ['P', '#f0a4a3', '#692d31'],
  'awwwards.com': ['W.', '#e3e1d8', '#34352f'], 'dribbble.com': ['◉', '#e7acc5', '#4b283b'], 'fonts.google.com': ['Aa', '#eccba0', '#553a2e'],
  'typewolf.com': ['tw', '#d9d7cc', '#363630'], 'figma.com': ['◒', '#cbb5f1', '#49346a'], 'codepen.io': ['◇', '#d3dad9', '#303938'],
  'github.com': ['⌘', '#dddde8', '#323241'], 'framer.com': ['F', '#a5c6f2', '#243958'], 'wikipedia.org': ['W', '#e7e4da', '#363630'],
  'thecreativeindependent.com': ['✺', '#dad6a5', '#454224'], 'itsnicethat.com': ['☺', '#ecb683', '#553921'], 'letterboxd.com': ['●●●', '#a6ccba', '#27463e'],
  'youtube.com': ['▶', '#eeaaa5', '#662f30'], 'itch.io': ['▰', '#f0bcbd', '#62343c'], 'earth.google.com': ['🌎', '#c4d9ea', '#293e4f'],
  'neal.fun': ['☀', '#efd698', '#574d2c'], 'archive.org': ['▥', '#d5d1c5', '#424137'], 'nasa.gov': ['✦', '#b1c5eb', '#2b3b61']
};
function el(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
function button(className, label, iconName, handler) { const b = el('button', className); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label); b.append(icon(iconName)); if (handler) b.addEventListener('click', handler); return b; }
function toast(message) { clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false; toastTimer = setTimeout(() => $('#toast').hidden = true, 4500); }
function domain(url) { try { return new URL(url).hostname.replace(/^www\./, '') || url; } catch { return url; } }
function itemLabel(node) { return node.title || (node.url ? domain(node.url) : 'Untitled'); }
function pinnedIds() {
  return [...new Set(Object.values(state.prefs.pins || {}).flat())];
}
function pins() { return state.current === 'pinned' ? pinnedIds() : state.prefs.pins[state.current] || []; }
function hashView() {
  if (location.hash === '#pinned') return 'pinned';
  if (location.hash === '#all') return 'all';
  return location.hash.startsWith('#folder/') ? location.hash.slice(8) : 'pinned';
}
function requestedDomain() {
  const value = new URLSearchParams(location.search).get('domain')?.trim();
  return value ? domainKey(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : `https://${value}`) : '';
}
function clearDomainFilter() {
  state.domainFilter = '';
  const url = new URL(location.href);
  if (!url.searchParams.has('domain')) return;
  url.searchParams.delete('domain');
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}
let preferenceQueue = Promise.resolve();
function savePrefs() {
  const snapshot = structuredClone(state.prefs);
  preferenceQueue = preferenceQueue.catch(() => {}).then(() => store.savePreferences(snapshot));
  return preferenceQueue;
}
function applySettings() {
  const theme = state.prefs.theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : state.prefs.theme;
  document.documentElement.dataset.theme = theme;
  document.body.classList.toggle('compact', state.prefs.size === 'compact');
  document.body.classList.toggle('spacious', state.prefs.size === 'spacious');
  // List is a layout choice alongside the icon sizes, rather than a separate toggle.
  document.body.classList.toggle('list-view', state.prefs.size === 'list');
  document.body.classList.toggle('folder-tile-view', state.prefs.folderView === 'tiles');
  document.body.classList.toggle('collapsed', Boolean(state.prefs.collapsed));
  $('#collapse').setAttribute('aria-expanded', String(!state.prefs.collapsed));
  $('#collapse span:last-child').textContent = state.prefs.collapsed ? 'Show folders' : 'Hide folders';
}
function art(node, mini = false) {
  const container = el('span', mini ? 'mini-icon' : 'tile-art');
  if (!node) return container;
  let host = ''; try { host = new URL(node.url).hostname; } catch { /* fallback */ }
  const brand = !isExtension && demoBrands[host];
  const fallback = el('span', mini ? '' : 'monogram', brand?.[0] || (node.title || host || '?')[0].toUpperCase());
  if (brand) { container.style.color = brand[1]; container.style.background = brand[2]; }
  container.append(fallback);
  observeFavicon(container, node, fallback);
  return container;
}
function folderCover(node, all = false) {
  const cover = el('span', `folder-cover${all ? ' all-cover' : ''}`);
  if (!all) {
    const initial = el('span', 'mini-icon folder-initial');
    setFolderInitialGlyph(initial, node.title);
    paintFolderInitial(initial, state.folderColors[node.id] || folderPalette[0][1]);
    cover.append(initial);
  }
  const sites = descendants(node).slice(0, all ? 9 : 3);
  for (let i = 0; i < (all ? 9 : 3); i++) cover.append(art(sites[i], true));
  return cover;
}
function collectionIcon(node) {
  const container = el('span', 'collection-icon');
  container.setAttribute('aria-hidden', 'true');
  if (node.id === 'all') {
    container.append(icon('app'));
  } else if (node.id === 'pinned') {
    container.append(icon('pin'));
  } else {
    const initial = el('span', 'mini-icon folder-initial');
    setFolderInitialGlyph(initial, node.title);
    paintFolderInitial(initial, state.folderColors[node.id] || folderPalette[0][1]);
    container.append(initial);
  }
  return container;
}
function pinnedCover(node) {
  const cover = el('span', 'folder-cover pinned-cover');
  const mark = el('span', 'pinned-cover-mark');
  mark.append(icon('pin'));
  cover.append(mark);
  const sites = node.children.slice(0, 3);
  for (let i = 0; i < 3; i++) cover.append(sites[i] ? art(sites[i], true) : el('span', 'mini-icon'));
  return cover;
}
function paintFolderInitial(element, color) {
  element.style.color = '#252525';
  element.style.background = folderColorBackground(color);
  element.style.setProperty('--folder-initial-color', color);
}
function setFolderInitialGlyph(element, title) {
  const glyph = folderInitial(title);
  const emoji = /\p{Extended_Pictographic}/u.test(glyph);
  element.classList.toggle('folder-emoji', emoji);
  const glyphElement = el('span', 'folder-initial-glyph', glyph);
  element.replaceChildren(glyphElement);
  if (emoji) centerEmojiGlyph(glyphElement, glyph);
}
function centerEmojiGlyph(element, glyph) {
  requestAnimationFrame(() => {
    if (!element.isConnected || !emojiMeasure) return;
    const style = getComputedStyle(element);
    emojiMeasure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const bounds = emojiMeasure.measureText(glyph);
    if (!Number.isFinite(bounds.actualBoundingBoxLeft) || !Number.isFinite(bounds.actualBoundingBoxRight)) return;
    // Flex centers the advance width, while emoji artwork can be offset inside it.
    const offset = (bounds.width - bounds.actualBoundingBoxRight + bounds.actualBoundingBoxLeft) / 2;
    element.style.setProperty('--emoji-offset-x', `${offset}px`);
  });
}
function updateFolderPreview() {
  const color = $('#folder-color').value;
  const preview = $('#folder-initial-preview');
  setFolderInitialGlyph(preview, $('#item-title').value);
  paintFolderInitial(preview, color);
  document.querySelectorAll('[data-folder-color]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.folderColor === color));
  });
}
function navigate(id) {
  clearDomainFilter();
  state.current = id; state.query = ''; state.type = 'all';
  $('#search').value = ''; $('#type-filter').value = 'all';
  location.hash = id === 'all' ? 'all' : id === 'pinned' ? 'pinned' : `folder/${id}`;
  render(); $('#grid-scroll').scrollTop = 0;
}
function mainFolders() {
  // Keep browser roots accessible; surface the user's first-level collections alongside them.
  return state.root.children.flatMap(root => [...(root.children || []).filter(node => !node.url), root]);
}
function canPin(node) {
  if (!node) return false;
  if (node.url) return true;
  return !mainFolders().some(folder => folder.id === node.id);
}
function renderCollections() {
  const target = $('#collections'); releaseFavicons(target); target.replaceChildren();
  const query = state.searchMode === 'folders' ? state.query.trim().toLowerCase() : '';
  const folders = mainFolders();
  $('#collection-count').textContent = String(folders.length).padStart(2, '0');
  const entries = [
    { id: 'pinned', title: 'Pinned', children: pinnedIds().map(id => state.map.get(id)).filter(Boolean), virtual: true },
    { id: 'all', title: 'All Bookmarks', children: state.root.children },
    ...folders
  ];
  if (state.folderSort !== 'manual') entries.sort((a, b) => {
    if (state.folderSort === 'count' || state.folderSort === 'count-asc') {
      const countA = a.virtual ? a.children.length : descendants(a).length;
      const countB = b.virtual ? b.children.length : descendants(b).length;
      return (state.folderSort === 'count' ? countB - countA : countA - countB) || a.title.localeCompare(b.title);
    }
    return a.title.localeCompare(b.title);
  });
  for (const node of entries) {
    const count = node.virtual ? node.children.length : descendants(node).length;
    if (query && !node.title.toLowerCase().includes(query)) continue;
    const card = el('div', `collection${state.current === node.id ? ' active' : ''}`);
    card.dataset.id = node.id;
    card.classList.toggle('batch-selected', selectedIds.has(node.id));
    const open = el('button', 'collection-open'); open.type = 'button';
    open.setAttribute('aria-label', `${node.title}, ${count} bookmarks`);
    if (node.id === state.current) open.setAttribute('aria-current', 'page');
    const details = el('span', 'collection-details');
    details.append(el('span', 'collection-label', node.title), el('span', 'collection-meta', `${count} ${count === 1 ? 'bookmark' : 'bookmarks'}`));
    open.append(collectionIcon(node), details);
    open.addEventListener('click', event => {
      if (event.shiftKey && realNode && canEdit(realNode, state.map)) {
        event.preventDefault(); toggleSelected(node.id, card); return;
      }
      navigate(node.id);
    }); card.append(open);
    const realNode = state.map.get(node.id);
    if (state.edit && realNode) {
      if (canEdit(realNode, state.map)) card.append(button('delete-button', `Delete ${node.title}`, 'minus', () => askDelete(node.id)));
      card.append(button('more-button', `Edit ${node.title}`, 'edit', () => openEditor('folder', node.id)));
    }
    if (realNode) bindDrag(card, realNode, true);
    target.append(card);
  }
  if (target.children.length === 1 && query) target.append(el('p', 'collection-empty', 'No matching folders.'));
}
function itemsInView() {
  if (state.current === 'pinned') {
    return pinnedIds().map(id => state.map.get(id)).filter(Boolean);
  }
  if ((state.searchMode === 'bookmarks' && state.query) || state.current === 'all') {
    // Pinned is normally its own collection. A popup domain handoff is the
    // exception: it must preserve every result the user just saw there.
    const pinned = state.current === 'all' && !state.domainFilter ? new Set(pinnedIds()) : null;
    const items = descendants(state.root).filter(node => !pinned || !pinned.has(node.id));
    const order = state.prefs.allOrder || [];
    const ranks = new Map(order.map((id, index) => [id, index]));
    return items.sort((a, b) => (ranks.get(a.id) ?? Infinity) - (ranks.get(b.id) ?? Infinity));
  }
  return state.map.get(state.current)?.children || [];
}
function renderGrid() {
  const grid = $('#grid'); releaseFavicons(grid); grid.replaceChildren();
  let items = itemsInView();
  const exactDomainSearch = Boolean(state.domainFilter && state.query === state.domainFilter);
  if (state.searchMode === 'bookmarks' && state.query) {
    items = exactDomainSearch
      ? items.filter(node => node.url && matchesDomain(node.url, `https://${state.domainFilter}/`))
      : visibleItems(items, { query: state.query });
  }
  // Preserve the popup's native cross-folder order for an exact-domain handoff.
  items = visibleItems(items, { type: state.type, sort: state.sort, pins: exactDomainSearch ? [] : pins() });
  const selectable = new Set([...state.map.values()].filter(node => canEdit(node, state.map)).map(node => node.id));
  selectedIds = new Set([...selectedIds].filter(id => selectable.has(id)));
  if (!state.edit) { batchMode = false; selectedIds.clear(); }
  $('#batch-tools').hidden = !state.edit;
  $('#select-visible').hidden = !batchMode;
  $('#delete-selected').hidden = !batchMode;
  document.body.classList.toggle('batch-editing', batchMode);
  updateBatchCount();
  for (const node of items) {
    const tile = el('article', 'tile'); tile.dataset.id = node.id;
    tile.classList.toggle('batch-selected', selectedIds.has(node.id));
    const main = el(node.url && !state.edit ? 'a' : 'button', 'tile-main');
    const label = itemLabel(node);
    main.title = node.url || `Open ${node.title}`;
    main.setAttribute('aria-label', `${state.edit && node.url ? 'Edit' : 'Open'} ${label}`);
    if (node.url && !state.edit) {
      // Never execute bookmarklets in the extension's privileged origin.
      if (/^(https?|ftp|file|chrome|brave|about):/i.test(node.url)) main.href = node.url;
      main.target = state.prefs.newTab ? '_blank' : '_self'; main.rel = 'noopener noreferrer';
      main.addEventListener('click', event => {
        if (event.shiftKey) { event.preventDefault(); toggleSelected(node.id, tile); return; }
        if (!main.hasAttribute('href')) { event.preventDefault(); toast('This bookmark uses an unsupported address. You can edit its URL.'); }
      });
    } else {
      main.type = 'button';
      main.addEventListener('click', event => {
        if (event.shiftKey) { event.preventDefault(); toggleSelected(node.id, tile); return; }
        if (batchMode) { tile.querySelector('.batch-checkbox')?.click(); return; }
        node.url ? openEditor('bookmark', node.id) : navigate(node.id);
      });
    }
    if (node.url) main.append(art(node));
    else { const box = el('span', 'tile-art'); box.append(folderCover(node)); main.append(box); }
    main.append(el('span', 'tile-label', label));
    main.append(el('span', 'tile-domain', node.url ? (state.current === 'all' || state.query ? state.map.get(node.parentId)?.title || domain(node.url) : domain(node.url)) : `${node.children?.length || 0} items`));
    tile.append(main);
    if (canPin(node)) {
      const pinned = pins().includes(node.id);
      const pin = button(`pin-button${pinned ? ' pinned' : ''}`, `${pinned ? 'Unpin' : 'Pin'} ${label}`, 'pin', () => togglePin(node.id));
      pin.setAttribute('aria-pressed', String(pinned)); tile.append(pin);
    }
    if (!node.url || canEdit(node, state.map)) {
      tile.append(button('more-button', `Edit ${label}`, 'more', () => openEditor(node.url ? 'bookmark' : 'folder', node.id)));
      if (state.edit && canEdit(node, state.map)) tile.append(button('delete-button', `Delete ${label}`, 'minus', () => askDelete(node.id)));
    }
    if (batchMode && canEdit(node, state.map)) {
      const checkbox = el('input', 'batch-checkbox'); checkbox.type = 'checkbox';
      checkbox.setAttribute('aria-label', `Select ${label}`);
      checkbox.checked = selectedIds.has(node.id);
      tile.classList.toggle('batch-selected', checkbox.checked);
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selectedIds.add(node.id); else selectedIds.delete(node.id);
        tile.classList.toggle('batch-selected', checkbox.checked); updateBatchCount();
      });
      tile.append(checkbox);
      main.setAttribute('aria-label', `Select ${label}`);
    }
    if (!batchMode) bindDrag(tile, node); grid.append(tile);
  }
  $('#item-count').textContent = `${items.length} ${items.length === 1 ? 'item' : 'items'}`;
  $('#empty').hidden = Boolean(items.length);
  const filtered = (state.searchMode === 'bookmarks' && state.query) || state.type !== 'all';
  $('#empty-title').textContent = filtered ? 'Nothing found' : 'This folder is empty';
  const emptyDescription = $('#empty-description');
  emptyDescription.replaceChildren();
  if (filtered) emptyDescription.textContent = 'Try another search or change your filters.';
  else emptyDescription.append('Add a bookmark or folder', document.createElement('br'), ' to fill up this space.');
  $('#empty-add').hidden = Boolean(filtered);
}
function renderHeader() {
  const crumbs = $('#breadcrumbs'); crumbs.replaceChildren();
  const searchingBookmarks = state.searchMode === 'bookmarks' && state.query;
  const all = el('button', '', searchingBookmarks ? 'Search results' : state.current === 'pinned' ? 'Pinned' : 'All Bookmarks'); all.addEventListener('click', () => navigate(state.current === 'pinned' ? 'pinned' : 'all')); crumbs.append(all);
  if (!searchingBookmarks && state.current !== 'all') {
    const path = folderPath(state.current, state.map)
      .filter(node => !/^\**\s*bookmarks bar\s*\**$/i.test(node.title.trim()));
    path.forEach((node, index) => {
      crumbs.append(icon('chevron'));
      if (index === path.length - 1) {
        crumbs.append(el('span', '', node.title));
      } else {
        const b = el('button', '', node.title); b.addEventListener('click', () => navigate(node.id));
        crumbs.append(b);
      }
    });
  }
  crumbs.lastElementChild.setAttribute('aria-current', 'page');
  $('#view-description').textContent = searchingBookmarks ? `Across all folders · “${state.query}”` : state.current === 'pinned' ? 'Your saved bookmarks from every folder.' : '';
  $('#view-description').hidden = !$('#view-description').textContent;
}
function render() {
  if (!state.root) return;
  document.body.classList.toggle('editing', state.edit);
  $('#edit-mode').setAttribute('aria-pressed', String(state.edit));
  $('#done').hidden = !state.edit;
  $('#total-count').textContent = `${descendants(state.root).length} bookmarks`;
  renderCollections(); renderHeader(); renderGrid();
}
async function reload() {
  if (state.dragId) { scheduleReload(); return; }
  const version = ++reloadVersion;
  const [root, colors] = await Promise.all([store.tree(), store.folderColors()]);
  const map = indexTree(root);
  const missing = {};
  for (const node of map.values()) {
    if (!node.url && node.id !== root.id && !isFolderColor(colors[node.id])) {
      missing[node.id] = randomFolderColor();
    }
  }
  if (version !== reloadVersion) return;
  if (Object.keys(missing).length) {
    await store.saveFolderColors(missing);
    Object.assign(colors, missing);
  }
  if (version !== reloadVersion) return;
  if (state.dragId) { scheduleReload(); return; }
  const nextTreeSignature = JSON.stringify(root), nextColorSignature = JSON.stringify(colors);
  if (nextTreeSignature === treeSignature && nextColorSignature === colorSignature) return;
  treeSignature = nextTreeSignature; colorSignature = nextColorSignature;
  state.root = root; state.map = map; state.folderColors = colors;
  if (state.current !== 'all' && state.current !== 'pinned' && (!state.map.has(state.current) || state.map.get(state.current).url)) state.current = 'all';
  render();
}
function scheduleReload() {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => reload().catch(error => toast(error.message)), 80);
}
async function togglePin(id) {
  const previous = structuredClone(state.prefs.pins);
  if (state.current === 'pinned') {
    for (const key of Object.keys(state.prefs.pins)) state.prefs.pins[key] = state.prefs.pins[key].filter(pin => pin !== id);
  } else {
    const currentPins = state.prefs.pins[state.current] || [];
    state.prefs.pins[state.current] = currentPins.includes(id) ? currentPins.filter(pin => pin !== id) : [...currentPins, id];
  }
  try { await savePrefs(); render(); } catch (error) { state.prefs.pins = previous; toast(error.message); }
}
function defaultParent() {
  const selected = state.map.get(state.current);
  return canContain(selected, state.map) ? selected.id : state.root.children.find(n => canContain(n, state.map))?.id;
}
function parentOptions(excludeId) {
  const select = $('#item-parent'); select.replaceChildren();
  for (const node of state.map.values()) {
    if (!canContain(node, state.map) || (excludeId && isWithin(node.id, excludeId, state.map))) continue;
    const isBookmarksBar = node.folderType === 'bookmarks-bar' || /^\**\s*bookmarks bar\s*\**$/i.test(node.title?.trim() || '');
    const path = folderPath(node.id, state.map);
    const option = el('option', '', path.map(folder => {
      const root = folder.folderType === 'bookmarks-bar' || /^\**\s*bookmarks bar\s*\**$/i.test(folder.title?.trim() || '');
      return root ? 'All Bookmarks' : folder.title;
    }).join(' / ')); option.value = node.id; select.append(option);
  }
}
function updateEditorType(type) {
  editorType = type;
  $('#url-field').hidden = type !== 'bookmark'; $('#item-url').required = type === 'bookmark';
  $('#folder-appearance').hidden = type !== 'folder';
  updateFolderPreview();
  $('#save-item').textContent = editorId ? 'Save changes' : `Add ${type}`;
  const title = $('#editor-title');
  title.replaceChildren();
  if (editorId) title.textContent = `A little ${type} refresh.`;
  else if (type === 'folder') title.textContent = 'Create a new folder.';
  else title.textContent = 'Add new bookmark';
  document.querySelectorAll('[data-create-type]').forEach(b => b.classList.toggle('selected', b.dataset.createType === type));
}
function openEditor(type = 'bookmark', id = null, mainFolder = false) {
  editorId = id;
  const node = state.map.get(id);
  if (id && !canEdit(node, state.map) && node?.url) { toast('This item is managed by your browser.'); return; }
  const preview = $('#editor-icon');
  releaseFavicons(preview); preview.replaceChildren();
  preview.hidden = !node?.url;
  if (node?.url) preview.append(art(node));
  $('#editor-form').reset(); $('#editor-error').textContent = ''; $('#save-item').disabled = false;
  const canDelete = Boolean(id && node && canEdit(node, state.map));
  $('#editor-delete').hidden = !canDelete;
  $('#editor-delete').textContent = node?.url ? 'Delete bookmark' : 'Delete folder';
  $('#create-tabs').hidden = Boolean(id || mainFolder);
  parentOptions(id);
  $('#item-title').value = node?.title || ''; $('#item-url').value = node?.url || '';
  const colorOnly = Boolean(node && !canEdit(node, state.map));
  $('#item-title').disabled = colorOnly; $('#item-parent').disabled = colorOnly;
  $('#item-parent').closest('label').hidden = colorOnly;
  $('#folder-color').value = state.folderColors[id] || randomFolderColor();
  $('#item-parent').value = node?.parentId || (mainFolder ? state.root.children.find(n => canContain(n, state.map))?.id : defaultParent());
  updateEditorType(type); $('#editor').showModal(); $('#item-title').focus();
}
async function submitEditor(event) {
  event.preventDefault(); if (state.busy) return;
  const title = $('#item-title').value.trim(), parentId = $('#item-parent').value || defaultParent();
  if (!title) { $('#editor-error').textContent = 'Give this item a name.'; return; }
  const colorOnly = Boolean(editorId && !canEdit(state.map.get(editorId), state.map));
  if (!parentId && !colorOnly) { $('#editor-error').textContent = 'Choose a writable folder.'; return; }
  state.busy = true; $('#save-item').disabled = true;
  try {
    const details = { title };
    if (editorType === 'bookmark') details.url = normalizeUrl($('#item-url').value);
    const wasEditing = Boolean(editorId);
    if (editorId && !colorOnly) {
      await store.update(editorId, details);
      if (state.map.get(editorId).parentId !== parentId) await store.move(editorId, { parentId });
    } else if (!editorId) {
      const created = await store.create({ ...details, parentId });
      editorId = created.id;
      // Preserve the created ID if saving its appearance fails, so a retry cannot duplicate it.
      state.map.set(created.id, { ...created, parentId });
      $('#create-tabs').hidden = true;
    }
    if (editorType === 'folder') {
      await store.saveFolderColors({ [editorId]: $('#folder-color').value });
      state.folderColors[editorId] = $('#folder-color').value;
    }
    $('#editor').close(); await reload(); toast(wasEditing ? 'Changes saved. Looking good.' : `${editorType === 'folder' ? 'Folder' : 'Bookmark'} added. Make yourself at home.`);
  } catch (error) { $('#editor-error').textContent = error.message; }
  finally { state.busy = false; $('#save-item').disabled = false; }
}
function updateBatchCount() {
  $('#delete-selected').textContent = `Delete selected (${selectedIds.size})`;
  $('#delete-selected').disabled = !selectedIds.size;
  const openable = [...selectedIds].filter(id => state.map.get(id)?.url).length;
  const openButton = $('#open-selected');
  openButton.hidden = state.edit || !selectedIds.size;
  openButton.disabled = !openable;
  openButton.textContent = `Open all selected${openable > 1 ? ` (${openable})` : ''}`;
  $('#cancel-selection').hidden = !selectedIds.size;
}
function toggleSelected(id, tile) {
  if (!canEdit(state.map.get(id), state.map)) return;
  if (selectedIds.has(id)) selectedIds.delete(id); else selectedIds.add(id);
  const checkbox = tile.querySelector('.batch-checkbox');
  if (checkbox) checkbox.checked = selectedIds.has(id);
  tile.classList.toggle('batch-selected', selectedIds.has(id));
  updateBatchCount();
}
function dragItems(id) {
  // A selected folder already carries its descendants, so never move both.
  const ids = selectedIds.has(id) ? [...selectedIds] : [id];
  return ids.filter(candidate => canEdit(state.map.get(candidate), state.map) &&
    !ids.some(parent => parent !== candidate && isWithin(candidate, parent, state.map)));
}
function draggedNodes() { return state.dragIds.map(id => state.map.get(id)).filter(Boolean); }
function openSelected() {
  const urls = [...selectedIds].map(id => state.map.get(id)?.url).filter(Boolean);
  for (const url of urls) {
    if (globalThis.chrome?.tabs?.create) chrome.tabs.create({ url });
    else window.open(url, '_blank');
  }
}
function cancelSelection() {
  selectedIds.clear();
  renderGrid();
}
function askBatchDelete() {
  // A selected folder already includes its descendants.
  deleteIds = [...selectedIds].filter(id => canEdit(state.map.get(id), state.map) &&
    ![...selectedIds].some(parent => parent !== id && isWithin(id, parent, state.map)));
  if (!deleteIds.length) return;
  const nodes = deleteIds.map(id => state.map.get(id));
  const bookmarks = nodes.reduce((count, node) => count + (node.url ? 1 : descendants(node).length), 0);
  $('#delete-error').textContent = '';
  $('#delete-title').textContent = `Delete ${deleteIds.length} selected items?`;
  $('#delete-description').textContent = `This permanently deletes ${bookmarks} bookmarks${nodes.some(node => !node.url) ? ' and the selected folders with all their nested contents' : ''} from your browser. Selected: ${nodes.map(node => node.title || 'Untitled').join(', ')}.`;
  $('#delete-dialog').showModal(); $('#delete-dialog .secondary').focus();
}
function askDelete(id) {
  const node = state.map.get(id); if (!canEdit(node, state.map)) return;
  deleteIds = [id]; deleteId = id; $('#delete-error').textContent = '';
  $('#delete-title').textContent = node.url ? 'Let this bookmark go?' : 'Remove this folder?';
  const count = descendants(node).length;
  $('#delete-description').textContent = node.url ? `“${node.title}” will be deleted from your browser’s bookmarks.` : `“${node.title}” and everything inside it (${count} bookmarks, including nested folders) will be permanently deleted from your browser.`;
  $('#delete-dialog').showModal(); $('#delete-dialog .secondary').focus();
}
async function submitDelete(event) {
  event.preventDefault(); if (state.busy) return;
  state.busy = true; $('#confirm-delete').disabled = true;
  try {
    for (const id of [...deleteIds]) {
      const node = state.map.get(id);
      if (node && canEdit(node, state.map)) await store.remove(id, !node.url);
      selectedIds.delete(id); deleteIds = deleteIds.filter(value => value !== id);
    }
    $('#delete-dialog').close(); await reload(); toast('Removed. A little more breathing room.');
  } catch (error) { $('#delete-error').textContent = error.message; }
  finally { state.busy = false; $('#confirm-delete').disabled = false; }
}
function clearDrop() {
  document.querySelectorAll('.drop-before,.drop-after,.drop-inside').forEach(card => {
    card.classList.remove('drop-before', 'drop-after', 'drop-inside');
  });
  if (dropIndicator) dropIndicator.hidden = true;
}
function isNoOpInsertion(target, mode, sidebar) {
  const sources = draggedNodes();
  if (!sources.length || sidebar || mode === 'inside') return false;
  if (sources.length > 1) return false;
  const [source] = sources;
  let order;
  if (pins().includes(source.id) && pins().includes(target.id)) order = pins();
  else if (state.current === 'all') order = itemsInView().map(node => node.id);
  else if (source.parentId === target.parentId) order = state.map.get(target.parentId)?.children?.map(node => node.id);
  if (!order) return false;
  const sourceIndex = order.indexOf(source.id);
  const remaining = order.filter(id => id !== source.id);
  const targetIndex = remaining.indexOf(target.id);
  return sourceIndex >= 0 && targetIndex >= 0 && targetIndex + (mode === 'after' ? 1 : 0) === sourceIndex;
}
function isVerticalList(container) {
  return (container.id === 'grid' && document.body.classList.contains('list-view')) ||
    (container.id === 'collections' && !document.body.classList.contains('folder-tile-view'));
}
function markDrop(card, target, mode, container, sidebar) {
  if (isNoOpInsertion(target, mode, sidebar)) return;
  card.classList.add(`drop-${mode}`);
  if (mode === 'inside') return;
  if (!dropIndicator) {
    dropIndicator = el('span', 'drag-indicator');
    dropIndicator.setAttribute('aria-hidden', 'true'); document.body.append(dropIndicator);
  }
  const rect = card.getBoundingClientRect();
  const style = getComputedStyle(container);
  const snap = value => Math.round(value * devicePixelRatio) / devicePixelRatio;
  if (isVerticalList(container)) {
    const rows = [...container.children].filter(child => child.matches(container.id === 'grid' ? '.tile' : '.collection'));
    const index = rows.indexOf(card);
    const neighbor = rows[mode === 'before' ? index - 1 : index + 1];
    const neighborRect = neighbor?.getBoundingClientRect();
    const gap = parseFloat(style.rowGap) || 0;
    const midpoint = neighborRect ? (mode === 'before' ? neighborRect.bottom + rect.top : rect.bottom + neighborRect.top) / 2 : mode === 'before' ? rect.top - gap / 2 : rect.bottom + gap / 2;
    const y = snap(midpoint);
    Object.assign(dropIndicator.style, { left: `${snap(rect.left)}px`, top: `${y}px`, width: `${snap(rect.width)}px`, height: '1px' });
  } else {
    const gap = parseFloat(style.columnGap) || 0;
    const x = snap(mode === 'before' ? rect.left - gap / 2 : rect.right + gap / 2);
    Object.assign(dropIndicator.style, { left: `${x}px`, top: `${snap(rect.top)}px`, width: '1px', height: `${snap(rect.height)}px` });
  }
  dropIndicator.hidden = false;
}
function dropMode(event, card, node, sidebar) {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;
  const source = state.map.get(state.dragId);
  if (sidebar && source?.url) return 'inside';
  if (isVerticalList(card.parentElement)) {
    if (!node.url && y > .23 && y < .77) return 'inside';
    return y > .5 ? 'after' : 'before';
  }
  if (!node.url && x > .23 && x < .77) return 'inside';
  return x > .5 ? 'after' : 'before';
}
function gapDropTarget(event, container, selector) {
  let closest = null, closestDistance = Infinity;
  const style = getComputedStyle(container);
  const xAllowance = (parseFloat(style.columnGap) || 0) / 2 + 1;
  const yAllowance = (parseFloat(style.rowGap) || 0) / 2 + 1;
  for (const card of container.querySelectorAll(selector)) {
    if (state.dragIds.includes(card.dataset.id) || !state.map.has(card.dataset.id)) continue;
    const rect = card.getBoundingClientRect();
    const dx = event.clientX < rect.left ? rect.left - event.clientX : event.clientX > rect.right ? event.clientX - rect.right : 0;
    const dy = event.clientY < rect.top ? rect.top - event.clientY : event.clientY > rect.bottom ? event.clientY - rect.bottom : 0;
    if (dx > xAllowance || dy > yAllowance) continue;
    const distance = dx * dx + dy * dy;
    if (distance < closestDistance) { closest = card; closestDistance = distance; }
  }
  return closest;
}
function gapDropMode(event, card, node, sidebar) {
  const source = state.map.get(state.dragId);
  if (sidebar && source?.url) return 'inside';
  const rect = card.getBoundingClientRect();
  if (event.clientY < rect.top) return 'before';
  if (event.clientY > rect.bottom) return 'after';
  return dropMode(event, card, node, sidebar);
}
async function completeDrop(node, mode, sidebar) {
  clearDrop();
  const sources = draggedNodes(), target = state.map.get(node.id);
  if (!sources.length || !target || sources.some(source => source.id === target.id) || state.busy) return;
  state.dragId = null; state.dragIds = []; state.busy = true;
  try {
    if (mode === 'inside') {
      if (!canContain(target, state.map) || sources.some(source => isWithin(target.id, source.id, state.map))) throw new Error('Choose a folder outside every selected folder’s subtree.');
      for (const source of sources) await store.move(source.id, { parentId: target.id });
      toast(`Moved ${sources.length === 1 ? 'item' : `${sources.length} items`} to ${target.title}.`);
    } else if (sources.every(source => pins().includes(source.id)) && pins().includes(target.id) && !sidebar) {
      const reordered = pins().filter(id => !sources.some(source => source.id === id));
      reordered.splice(reordered.indexOf(target.id) + (mode === 'after' ? 1 : 0), 0, ...sources.map(source => source.id));
      state.prefs.pins[state.current] = reordered; await savePrefs();
    } else {
      if (state.sort !== 'manual' || state.query || state.type !== 'all') throw new Error('Clear filters and choose “My order” before reordering.');
      if (sources.some(source => pins().includes(source.id) !== pins().includes(target.id)) && !sidebar) throw new Error('Unpin selected items before moving them outside the pinned group.');
      if (state.current === 'all' && !sidebar) {
        const order = itemsInView().map(n => n.id).filter(id => !sources.some(source => source.id === id));
        order.splice(order.indexOf(target.id) + (mode === 'after' ? 1 : 0), 0, ...sources.map(source => source.id));
        state.prefs.allOrder = order; await savePrefs();
      } else {
        if (sources.some(source => source.parentId !== target.parentId)) throw new Error('Drop on the center of a folder to move selected items into it.');
        const siblings = state.map.get(target.parentId).children;
        const ordered = mode === 'before' ? [...sources].reverse() : sources;
        let anchor = target;
        for (const source of ordered) {
          const index = insertionIndex(source, anchor, mode === 'after', siblings);
          await store.move(source.id, { parentId: target.parentId, index });
          const currentIndex = siblings.findIndex(item => item.id === source.id);
          if (currentIndex >= 0) siblings.splice(currentIndex, 1);
          siblings.splice(index, 0, source);
          anchor = source;
        }
      }
    }
    await reload();
  } catch (error) { toast(error.message); }
  finally { state.busy = false; document.querySelectorAll('.dragging').forEach(n => n.classList.remove('dragging')); }
}
function bindDrag(card, node, sidebar = false) {
  card.draggable = canEdit(state.map.get(node.id), state.map);
  card.addEventListener('dragstart', event => {
    if (!card.draggable) { event.preventDefault(); return; }
    state.dragIds = dragItems(node.id); state.dragId = state.dragIds[0] || null;
    if (!state.dragId) { event.preventDefault(); return; }
    event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', state.dragIds.join(','));
    document.querySelectorAll(state.dragIds.map(id => `[data-id="${CSS.escape(id)}"]`).join(',')).forEach(item => item.classList.add('dragging'));
  });
  card.addEventListener('dragend', () => { state.dragId = null; state.dragIds = []; document.querySelectorAll('.dragging').forEach(item => item.classList.remove('dragging')); clearDrop(); });
  card.addEventListener('dragover', event => {
    if (!state.dragId || state.dragIds.includes(node.id)) return;
    event.preventDefault(); event.dataTransfer.dropEffect = 'move'; clearDrop();
    markDrop(card, node, dropMode(event, card, node, sidebar), card.parentElement, sidebar);
  });
  card.addEventListener('dragleave', event => { if (!card.contains(event.relatedTarget)) clearDrop(); });
  card.addEventListener('drop', async event => {
    event.preventDefault(); event.stopPropagation();
    const mode = dropMode(event, card, node, sidebar);
    await completeDrop(node, mode, sidebar);
  });
}
function bindDropGaps(container, selector, sidebar = false) {
  const targetFor = event => {
    if (!state.dragId || event.target.closest(selector)) return null;
    return gapDropTarget(event, container, selector);
  };
  container.addEventListener('dragover', event => {
    const card = targetFor(event);
    if (!card) return;
    const node = state.map.get(card.dataset.id);
    event.preventDefault(); event.dataTransfer.dropEffect = 'move'; clearDrop();
    markDrop(card, node, gapDropMode(event, card, node, sidebar), container, sidebar);
  });
  container.addEventListener('drop', async event => {
    const card = targetFor(event);
    if (!card) return;
    const node = state.map.get(card.dataset.id);
    event.preventDefault(); event.stopPropagation();
    await completeDrop(node, gapDropMode(event, card, node, sidebar), sidebar);
  });
}
function togglePanel(buttonId, panelId) {
  const panel = $(panelId); panel.hidden = !panel.hidden; $(buttonId).setAttribute('aria-expanded', String(!panel.hidden));
}
function bindEvents() {
  bindDropGaps($('#grid'), '.tile');
  bindDropGaps($('#collections'), '.collection', true);
  window.addEventListener('favicon-connection-error', () => toast('The icon loader couldn’t connect. Reload this Anaquel tab after reloading the extension.'));
  for (const [name, color] of folderPalette) {
    const swatch = el('button', 'folder-color-swatch'); swatch.type = 'button';
    swatch.dataset.folderColor = color; swatch.style.background = color;
    swatch.setAttribute('aria-label', name); swatch.title = name;
    swatch.addEventListener('click', () => { $('#folder-color').value = color; updateFolderPreview(); });
    $('#folder-color-swatches').append(swatch);
  }
  $('#folder-color').addEventListener('input', updateFolderPreview);
  $('#item-title').addEventListener('input', updateFolderPreview);
  document.querySelectorAll('[data-icon]').forEach(node => node.append(icon(node.dataset.icon)));
  $('#add-folder').addEventListener('click', () => openEditor('folder', null, true));
  $('#add-item').addEventListener('click', () => openEditor()); $('#empty-add').addEventListener('click', () => openEditor());
  $('#folder-filter').addEventListener('click', () => togglePanel('#folder-filter', '#folder-filters'));
  $('#item-filter').addEventListener('click', () => togglePanel('#item-filter', '#content-filters'));
  $('#edit-mode').addEventListener('click', () => {
    state.edit = !state.edit;
    batchMode = state.edit;
    selectedIds.clear();
    render();
  });
  $('#select-visible').addEventListener('click', () => { document.querySelectorAll('#grid .batch-checkbox:not(:checked)').forEach(input => input.click()); });
  $('#delete-selected').addEventListener('click', askBatchDelete);
  $('#open-selected').addEventListener('click', openSelected);
  $('#cancel-selection').addEventListener('click', cancelSelection);
  $('#done').addEventListener('click', () => { state.edit = false; render(); });
  $('.search-field').addEventListener('click', event => {
    if (!event.target.closest('button, input')) $('#search').focus();
  });
  $('#search').addEventListener('input', event => { clearDomainFilter(); state.query = event.target.value; render(); });
  $('#search').addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.currentTarget.blur();
    }
  });
  $('#search-mode').addEventListener('click', event => {
    clearDomainFilter();
    state.searchMode = state.searchMode === 'bookmarks' ? 'folders' : 'bookmarks';
    const folders = state.searchMode === 'folders';
    event.currentTarget.setAttribute('aria-label', folders ? 'Search Folders' : 'Search Bookmarks');
    event.currentTarget.setAttribute('aria-pressed', String(folders));
    $('#search').placeholder = folders ? 'Search folders…' : 'Search bookmarks…';
    $('#search').setAttribute('aria-label', folders ? 'Search folders' : 'Search bookmarks');
    render();
    $('#search').focus();
  });
  $('#folder-sort').addEventListener('change', event => { state.folderSort = event.target.value; renderCollections(); });
  $('#type-filter').addEventListener('change', event => { state.type = event.target.value; renderGrid(); });
  $('#sort-filter').addEventListener('change', event => { state.sort = event.target.value; renderGrid(); });
  $('#reset-filters').addEventListener('click', () => { state.type = 'all'; state.sort = 'manual'; $('#type-filter').value = 'all'; $('#sort-filter').value = 'manual'; renderGrid(); });
  $('#editor-form').addEventListener('submit', submitEditor); $('#delete-form').addEventListener('submit', submitDelete);
  $('#editor-delete').addEventListener('click', () => {
    if (!editorId || state.busy) return;
    const id = editorId;
    $('#editor').close();
    askDelete(id);
  });
  document.querySelectorAll('[data-create-type]').forEach(b => b.addEventListener('click', () => updateEditorType(b.dataset.createType)));
  document.querySelectorAll('.close-dialog').forEach(b => b.addEventListener('click', () => { if (!state.busy) b.closest('dialog').close(); }));
  document.querySelectorAll('dialog').forEach(dialog => {
    let startedOutside = false;
    const outside = event => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('pointerdown', event => { startedOutside = event.target === dialog && outside(event); });
    dialog.addEventListener('click', event => {
      if (startedOutside && event.target === dialog && outside(event) && !state.busy) dialog.close();
      startedOutside = false;
    });
    dialog.addEventListener('cancel', event => { if (state.busy) event.preventDefault(); });
  });
  document.addEventListener('click', event => {
    for (const [buttonId, panelId] of [['#folder-filter', '#folder-filters'], ['#item-filter', '#content-filters']]) {
      const panel = $(panelId), trigger = $(buttonId);
      if (!panel.hidden && !panel.contains(event.target) && !trigger.contains(event.target)) {
        panel.hidden = true; trigger.setAttribute('aria-expanded', 'false');
      }
    }
  });
  $('#settings').addEventListener('click', () => {
    $('#theme-setting').value = state.prefs.theme; $('#size-setting').value = state.prefs.size; $('#folder-view-setting').value = state.prefs.folderView; $('#newtab-setting').checked = state.prefs.newTab; $('#settings-dialog').showModal();
  });
  for (const [id, key] of [['theme-setting', 'theme'], ['size-setting', 'size'], ['folder-view-setting', 'folderView'], ['newtab-setting', 'newTab']]) {
    $(`#${id}`).addEventListener('change', async event => {
      state.prefs[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      applySettings(); render(); try { await savePrefs(); } catch (error) { toast(error.message); }
    });
  }
  $('#collapse').addEventListener('click', async () => { state.prefs.collapsed = !state.prefs.collapsed; applySettings(); try { await savePrefs(); } catch (error) { toast(error.message); } });
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', applySettings);
  window.addEventListener('hashchange', () => {
    let next = hashView();
    if (next !== 'pinned' && !state.map.has(next)) next = 'all';
    if (next === state.current) return;
    state.current = next; state.query = ''; state.type = 'all';
    $('#search').value = ''; $('#type-filter').value = 'all'; render();
  });
  document.addEventListener('keydown', event => {
    if ($('dialog[open]') || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (event.key === '/') { event.preventDefault(); $('#search').focus(); }
    if (event.key === 'Escape' && selectedIds.size) { cancelSelection(); return; }
    if (event.key === 'Escape' && state.edit) { state.edit = false; render(); }
    if (event.key === 'Enter' && !state.edit && selectedIds.size && event.target !== $('#open-selected')) { event.preventDefault(); openSelected(); }
  });
}
async function init() {
  bindEvents();
  if (!isExtension) { $('#demo-status').hidden = false; $('#demo-status').title = 'Sample data only. Load the extension in Brave to see your actual bookmarks.'; }
  try {
    const [preferences] = await Promise.all([store.preferences(), prepareFavicons()]); state.prefs = { ...state.prefs, ...preferences, pins: preferences.pins || {} };
    // Migrate preferences from the old standalone view toggle.
    if (preferences.view === 'list') state.prefs.size = 'list';
    applySettings();
    state.current = hashView();
    const domain = requestedDomain();
    if (domain) {
      state.current = 'all';
      state.query = domain;
      state.domainFilter = domain;
      $('#search').value = domain;
    }
    store.subscribe(scheduleReload);
    await reload();
    if (isExtension) chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && changes.preferences) { state.prefs = { ...state.prefs, ...changes.preferences.newValue }; applySettings(); render(); }
      if (area === 'local') {
        let changed = false;
        for (const [key, change] of Object.entries(changes)) {
          if (key.startsWith('folderColor:') && isFolderColor(change.newValue)) {
            state.folderColors[key.slice('folderColor:'.length)] = change.newValue; changed = true;
          }
        }
        if (changed) render();
      }
    });
  } catch (error) { $('#empty').hidden = false; $('#empty-title').textContent = 'Your bookmarks couldn’t load.'; $('#empty-description').textContent = error.message; $('#empty-add').hidden = true; toast('Reload this page to try again.'); }
}
init();
