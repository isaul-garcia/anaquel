import test from 'node:test';
import assert from 'node:assert/strict';
import { indexTree, descendants, folderPath, isWithin, canEdit, canContain, normalizeUrl, domainKey, matchesDomain, bookmarksForDomain, visibleItems, insertionIndex } from '../src/model.js';
const root = { id: '0', children: [{ id: '1', title: 'Bar', children: [{ id: '10', title: 'Design', children: [{ id: '11', title: 'Nested', children: [{ id: '12', title: 'Example', url: 'https://example.com' }] }] }] }, { id: '2', title: 'Managed', unmodifiable: 'managed', children: [{ id: '20', title: 'Policy folder', children: [] }] }] };
const map = indexTree(root);
test('indexes the entire tree with parent relationships', () => { assert.equal(map.size, 7); assert.equal(map.get('12').parentId, '11'); });
test('all bookmarks includes deeply nested websites, not folders', () => { assert.deepEqual(descendants(root).map(n => n.id), ['12']); });
test('breadcrumbs preserve every ancestor', () => { assert.deepEqual(folderPath('11', map).map(n => n.id), ['1', '10', '11']); });
test('detects cycles and self containment', () => { assert.ok(isWithin('12', '10', map)); assert.ok(isWithin('10', '10', map)); assert.equal(isWithin('1', '10', map), false); });
test('browser roots cannot be edited but accept children', () => { assert.equal(canEdit(map.get('1'), map), false); assert.equal(canContain(map.get('1'), map), true); assert.equal(canContain(root, map), false); assert.equal(canEdit(map.get('10'), map), true); });
test('managed folder restrictions apply to descendants', () => { assert.equal(canEdit(map.get('20'), map), false); assert.equal(canContain(map.get('20'), map), false); });
test('normalizes addresses and blocks executable schemes', () => { assert.equal(normalizeUrl(' example.com '), 'https://example.com/'); assert.equal(normalizeUrl('brave://settings'), 'brave://settings'); for (const url of ['javascript:alert(1)', 'data:text/html,test', 'https://', '']) assert.throws(() => normalizeUrl(url)); });
test('matches bookmarks to the current domain, including www', () => {
  assert.equal(domainKey('https://www.youtube.com/watch?v=123'), 'youtube.com');
  assert.ok(matchesDomain('https://www.youtube.com/watch?v=123', 'https://youtube.com/'));
  assert.equal(matchesDomain('https://music.youtube.com/', 'https://youtube.com/'), false);
  assert.equal(matchesDomain('not a URL', 'https://youtube.com/'), false);
});
test('finds same-domain bookmarks in every folder and preserves their paths', () => {
  const tree = { id: '0', children: [{ id: '1', title: 'Bookmarks Bar', children: [
    { id: '2', title: 'Watch later', url: 'https://www.youtube.com/watch?v=123' },
    { id: '3', title: 'Video essays', children: [{ id: '4', title: 'Deep dive', url: 'https://youtube.com/watch?v=456' }] },
    { id: '5', title: 'Different site', url: 'https://vimeo.com/123' }
  ] }] };
  const matches = bookmarksForDomain(tree, 'https://youtube.com/');
  assert.deepEqual(matches.map(bookmark => bookmark.id), ['2', '4']);
  assert.deepEqual(matches.map(bookmark => bookmark.folders), [['Bookmarks Bar'], ['Bookmarks Bar', 'Video essays']]);
});
const items = [{ id: 'a', title: 'Zebra', url: 'https://zebra.com', dateAdded: 1 }, { id: 'b', title: 'Apple', url: 'https://apple.com', dateAdded: 3 }, { id: 'c', title: 'Folder', children: [], dateAdded: 2 }];
test('pins sort to the front and preserve pin order', () => { assert.deepEqual(visibleItems(items, { pins: ['b', 'a'] }).map(n => n.id), ['b', 'a', 'c']); });
test('search matches URLs and respects type filters', () => { assert.deepEqual(visibleItems(items, { query: 'APPLE.COM', type: 'bookmarks' }).map(n => n.id), ['b']); assert.deepEqual(visibleItems(items, { type: 'folders' }).map(n => n.id), ['c']); });
test('sorting never mutates browser order', () => { assert.deepEqual(visibleItems(items, { sort: 'az' }).map(n => n.id), ['b', 'c', 'a']); assert.deepEqual(items.map(n => n.id), ['a', 'b', 'c']); });
test('recent ordering and pinned-only filtering', () => { assert.deepEqual(visibleItems(items, { sort: 'recent' }).map(n => n.id), ['b', 'c', 'a']); assert.deepEqual(visibleItems(items, { type: 'pinned', pins: ['a'] }).map(n => n.id), ['a']); });
test('drag insertion handles forward and backward positions', () => { assert.equal(insertionIndex(items[0], items[2], true, items), 2); assert.equal(insertionIndex(items[0], items[1], false, items), 0); assert.equal(insertionIndex(items[2], items[0], false, items), 0); });
