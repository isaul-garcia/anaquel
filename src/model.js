export function indexTree(root) {
  const map = new Map();
  function visit(node, parent) {
    map.set(node.id, { ...node, parentId: parent?.id ?? node.parentId });
    node.children?.forEach(child => visit(child, node));
  }
  visit(root);
  return map;
}
export function descendants(node) {
  return (node.children || []).flatMap(child => child.url ? [child] : descendants(child));
}
export function folderPath(id, map) {
  const path = [];
  for (let node = map.get(id); node?.parentId; node = map.get(node.parentId)) path.unshift(node);
  return path;
}
export function isWithin(id, ancestorId, map) {
  for (let node = map.get(id); node; node = map.get(node.parentId)) {
    if (node.id === ancestorId) return true;
  }
  return false;
}
export function isManaged(node, map) {
  return [node, ...folderPath(node.id, map)].some(item => item.unmodifiable);
}
export function canEdit(node, map) {
  return Boolean(node?.parentId && node.parentId !== '0' && !node.folderType && !isManaged(node, map));
}
export function canContain(node, map) {
  return Boolean(node && !node.url && node.id !== '0' && !isManaged(node, map));
}
export function normalizeUrl(input) {
  let value = input.trim();
  if (!value) throw new Error('Enter a website address.');
  if (!/^[a-z][a-z\d+.-]*:/i.test(value)) value = `https://${value}`;
  let url;
  try { url = new URL(value); } catch { throw new Error('Enter a valid website address.'); }
  if (!['https:', 'http:', 'ftp:', 'file:', 'chrome:', 'brave:', 'about:'].includes(url.protocol)) {
    throw new Error('Use a web address or a browser page URL.');
  }
  return url.href;
}
// `www` is a presentation variant for most bookmarks, so treat it as the
// same site as the bare host while keeping other subdomains distinct.
export function domainKey(value) {
  try {
    return new URL(value).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}
export function matchesDomain(bookmarkUrl, pageUrl) {
  const bookmarkDomain = domainKey(bookmarkUrl);
  return Boolean(bookmarkDomain && bookmarkDomain === domainKey(pageUrl));
}
export function bookmarksForDomain(root, pageUrl) {
  const bookmarks = [];
  function visit(node, folders = []) {
    for (const child of node.children || []) {
      if (child.url) {
        if (matchesDomain(child.url, pageUrl)) bookmarks.push({ ...child, folders });
      } else {
        visit(child, child.title ? [...folders, child.title] : folders);
      }
    }
  }
  visit(root);
  return bookmarks;
}
export function visibleItems(items, { query = '', type = 'all', sort = 'manual', pins = [] } = {}) {
  const needle = query.trim().toLowerCase();
  const filtered = items.filter(node => {
    if (type === 'bookmarks' && !node.url) return false;
    if (type === 'folders' && node.url) return false;
    if (type === 'pinned' && !pins.includes(node.id)) return false;
    return !needle || `${node.title} ${node.url || ''}`.toLowerCase().includes(needle);
  });
  return filtered.sort((a, b) => {
    const pinA = pins.indexOf(a.id), pinB = pins.indexOf(b.id);
    if (pinA >= 0 || pinB >= 0) return pinA < 0 ? 1 : pinB < 0 ? -1 : pinA - pinB;
    if (sort === 'az') return a.title.localeCompare(b.title);
    if (sort === 'recent') return (b.dateAdded || 0) - (a.dateAdded || 0);
    return 0;
  });
}
// The insertion position in the final children array, after removing the source.
export function insertionIndex(source, target, after, siblings) {
  const remaining = siblings.filter(node => node.id !== source.id);
  const index = remaining.findIndex(node => node.id === target.id);
  return index < 0 ? remaining.length : index + (after ? 1 : 0);
}
