import { watchFaviconVisits } from './favicon-service.js';
watchFaviconVisits();
async function openManager(domain = '') {
  const baseUrl = chrome.runtime.getURL('index.html');
  const target = new URL(baseUrl);
  if (typeof domain === 'string' && domain) target.searchParams.set('domain', domain);
  if (domain) target.hash = 'all';
  const tabs = await chrome.tabs.query({});
  const existing = tabs.find(tab => [tab.url, tab.pendingUrl].some(value => value?.split(/[?#]/)[0] === baseUrl));
  if (existing) {
    await chrome.tabs.update(existing.id, { active: true, url: target.href });
    await chrome.windows.update(existing.windowId, { focused: true });
  } else {
    await chrome.tabs.create({ url: target.href });
  }
}
chrome.action.onClicked.addListener(() => openManager());
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'open-bookmarks-manager') return;
  openManager(message.domain).then(() => sendResponse({ ok: true })).catch(error => sendResponse({ error: error.message }));
  return true;
});
