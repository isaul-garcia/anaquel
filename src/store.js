import { demoTree } from './demo.js';
import { indexTree, canEdit, canContain, isWithin } from './model.js';
export const isExtension = Boolean(globalThis.chrome?.bookmarks?.getTree);
const demoKey = 'anaquel-demo-v1';
let demo;
function loadDemo() {
  try { demo = JSON.parse(localStorage.getItem(demoKey)); } catch { /* use initial demo */ }
  if (!demo?.tree) demo = { tree: demoTree(), prefs: { pins: { all: ['101', '111', '113', '105'] } } };
}
if (!isExtension) loadDemo();
function saveDemo() { localStorage.setItem(demoKey, JSON.stringify(demo)); }
export const store = {
  async tree() {
    if (isExtension) return (await chrome.bookmarks.getTree())[0];
    const root = structuredClone(demo.tree);
    const hydrate = node => node.children?.forEach((child, index) => {
      child.parentId = node.id; child.index = index; hydrate(child);
    });
    hydrate(root); return root;
  },
  async preferences() { return isExtension ? (await chrome.storage.local.get('preferences')).preferences || {} : structuredClone(demo.prefs); },
  async savePreferences(prefs) {
    if (isExtension) await chrome.storage.local.set({ preferences: prefs });
    else { demo.prefs = structuredClone(prefs); saveDemo(); }
  },
  async folderColors() {
    if (!isExtension) return structuredClone(demo.folderColors || {});
    const stored = await chrome.storage.local.get(null);
    return Object.fromEntries(Object.entries(stored)
      .filter(([key]) => key.startsWith('folderColor:'))
      .map(([key, color]) => [key.slice('folderColor:'.length), color]));
  },
  async saveFolderColors(colors) {
    if (isExtension) {
      // Separate keys keep edits to different folders from overwriting one another.
      await chrome.storage.local.set(Object.fromEntries(
        Object.entries(colors).map(([id, color]) => [`folderColor:${id}`, color])
      ));
    } else {
      demo.folderColors = { ...demo.folderColors, ...colors }; saveDemo();
    }
  },
  async create(details) {
    if (isExtension) return chrome.bookmarks.create(details);
    const map = indexTree(demo.tree), parent = map.get(details.parentId);
    if (!canContain(parent, map)) throw new Error('This folder is read-only.');
    const node = { ...details, id: String(Date.now()) + Math.random().toString(16).slice(2, 6), dateAdded: Date.now() };
    if (!node.url) node.children = [];
    parent.children.push(node); saveDemo(); return node;
  },
  async update(id, details) {
    if (isExtension) return chrome.bookmarks.update(id, details);
    const map = indexTree(demo.tree), node = map.get(id);
    if (!canEdit(node, map)) throw new Error('This item is read-only.');
    const original = map.get(node.parentId).children.find(item => item.id === id);
    Object.assign(original, details); saveDemo(); return original;
  },
  async move(id, destination) {
    if (isExtension) {
      const target = { ...destination };
      if (target.index !== undefined) {
        const [source] = await chrome.bookmarks.get(id);
        // Chromium interprets a same-folder destination before removing the source.
        // The UI and demo use the final position, so compensate for forward moves.
        if (source.parentId === target.parentId && source.index < target.index) target.index++;
      }
      return chrome.bookmarks.move(id, target);
    }
    const map = indexTree(demo.tree), node = map.get(id), parent = map.get(destination.parentId);
    if (!canEdit(node, map) || !canContain(parent, map) || isWithin(parent.id, id, map)) throw new Error('Cannot move this item into that folder.');
    const old = map.get(node.parentId).children;
    const [original] = old.splice(old.findIndex(item => item.id === id), 1);
    parent.children.splice(destination.index ?? parent.children.length, 0, original);
    saveDemo(); return original;
  },
  async remove(id, folder) {
    if (isExtension) return folder ? chrome.bookmarks.removeTree(id) : chrome.bookmarks.remove(id);
    const map = indexTree(demo.tree), node = map.get(id);
    if (!canEdit(node, map)) throw new Error('This item is read-only.');
    const children = map.get(node.parentId).children;
    children.splice(children.findIndex(item => item.id === id), 1); saveDemo();
  },
  subscribe(listener) {
    if (!isExtension) return;
    for (const event of ['onCreated', 'onRemoved', 'onChanged', 'onMoved', 'onChildrenReordered', 'onImportEnded']) chrome.bookmarks[event].addListener(listener);
  }
};
