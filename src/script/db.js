import { DB_NAME, DB_VERSION, DB_OBJECT_STORE_NAME } from './const';
import { openDB } from 'idb'

// Local label
const LOG_LABEL = '[IndexedDB]';

/**
 * Open database
 * @return {Promise}
 */
const database = async () => {

  // Browser doesn't support IndexedDB
  if (!window.indexedDB) {
    console.error(`${LOG_LABEL} Browser doesn't support IndexedDB`);
    return null;
  }
  
  // When it supported
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      db.createObjectStore(DB_OBJECT_STORE_NAME, { keyPath: 'id' })
        .createIndex('name', 'name', { unique: false });
    },
  });
}

/**
 * Insert data to database
 * @param {String} objectStore
 * @param {Object} payload
 * @return {any} 
 */
const insert = async ({ objectStore = DB_OBJECT_STORE_NAME, payload }) => {
  try {
    const db = await database();
    const transaction = db.transaction(objectStore, 'readwrite');
    const store = transaction.objectStore(objectStore);
    await store.put(payload);
    console.log(`${LOG_LABEL} Insert success`);
    return await transaction.done;
  } catch(error) {
    console.error(`${LOG_LABEL} Insert failed ${error}`);
  }
}

/**
 * Read data from database
 * @param {String} objectStore
 * @param {Int} keyPath 
 * @return {any} 
 */
const read = async ({ objectStore = DB_OBJECT_STORE_NAME, keyPath = '' }) => {
  try {
    const db = await database();
    const transaction = db.transaction(objectStore, 'readonly');
    const store = transaction.objectStore(objectStore);
  
    // Get one specific data
    if (keyPath) {
      return store.get(keyPath);
    }
    // Get all data
    return store.getAll();
  
  } catch (error) {
    console.error(`${LOG_LABEL} Read failed ${error}`);
  }
}

/**
 * Remove data from database
 * @param {String} objectStore
 * @param {Int} keyPath 
 * @return {any} 
 */
const remove = async ({ objectStore = DB_OBJECT_STORE_NAME, keyPath }) => {
  try {    
    const db = await database();
    const transaction = db.transaction(objectStore, 'readwrite');
    const store = transaction.objectStore(objectStore);
    store.delete(keyPath);
    console.log(`${LOG_LABEL} Remove from '${objectStore}' with keyPath: ${keyPath}`);
    return transaction.done;
  } catch (error) {
    console.error(`${LOG_LABEL} ${error}`);
  }
};

export {
  insert,
  read,
  remove,
}