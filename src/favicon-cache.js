// Shared by extension pages and the service worker; transactions protect updates.
let database;
function openDatabase() {
  database ||= new Promise((resolve, reject) => {
    const request = indexedDB.open('anaquel-favicons', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('icons', { keyPath: 'origin' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return database;
}
export async function readIcon(origin) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction('icons').objectStore('icons').get(origin);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
export async function writeIcon(origin, revision, entry) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('icons', 'readwrite'), store = transaction.objectStore('icons');
    let written = false;
    const request = store.get(origin);
    request.onsuccess = () => {
      if ((request.result?.revision || 0) !== revision) return;
      store.put({ ...entry, origin, revision, dirty: false }); written = true;
    };
    transaction.oncomplete = () => resolve(written);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
export async function invalidateIcon(origin, pageUrl, iconUrl) {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('icons', 'readwrite'), store = transaction.objectStore('icons');
    let changed = false;
    const request = store.get(origin);
    request.onsuccess = () => {
      // An unseen site needs no record: its first visible lookup will already be fresh.
      if (!request.result) return;
      if (request.result.dirty && request.result.pageUrl === pageUrl &&
          request.result.iconUrl === (iconUrl || request.result.iconUrl)) return;
      store.put({ ...request.result, pageUrl, iconUrl: iconUrl || request.result.iconUrl, dirty: true, revision: (request.result.revision || 0) + 1 }); changed = true;
    };
    transaction.oncomplete = () => resolve(changed);
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

export async function readSavedIcons() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction('icons').objectStore('icons').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
