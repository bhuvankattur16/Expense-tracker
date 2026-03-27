/* =============================================================
   WealthTrack — db.js
   IndexedDB storage service
   ============================================================= */

const DB_NAME    = 'wealthtrack_db';
const DB_VERSION = 1;
const STORE_NAME = 'transactions';

let db;

export const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const database = e.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('type',     'type',     { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('date',     'date',     { unique: false });
      }
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror   = (e) => reject(e.target.error);
  });
};

export const dbGetAll = async () => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = database.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
};

export const dbAdd = async (item) => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.add(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
};

export const dbUpdate = async (item) => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.put(item);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
};

export const dbDelete = async (id) => {
  const database = await openDB();
  return new Promise((resolve, reject) => {
    const tx    = database.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req   = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
};
