import { safeUrl } from '../script/util';
import { SW_CACHE_NAME, API_BASE_URL } from '../script/const';

// Local Label
const LOG_LABEL = '[Service Worker]';

// Resources need to be offline
// NOTE: When use native service worker please match filename in webpack config
const urlToCache = [
  '/',
  '/favicon.ico',
  '/img/undraw_choose.svg',
  '/img/undraw_server_down.svg',
  '/img/undraw_warning.svg',
  '/icon_192x192.png',
  '/icon_512x512.png',
  '/index.html',
  '/index.css',
  '/index.js',
  '/manifest.json',
];


// Service worker install event
self.addEventListener('install', event => {

  // Cache files all
  const preCache = async () => {
    const cache = await caches.open(SW_CACHE_NAME);
    return cache.addAll(urlToCache);
  } 

  // Run precache
  event.waitUntil(preCache());
  console.log(`${LOG_LABEL} Install`);
  
  // Always use newest version of service worker
  self.skipWaiting();

});


// Service worker activate event
self.addEventListener('activate', event => {

  // Delete unused cache
  const deleteOtherCache = async () => {
    const cacheNames = await caches.keys();
    return Promise.all(
      cacheNames.map(cacheName => {
        if (cacheName != SW_CACHE_NAME) {
          console.log(`${LOG_LABEL} Delete cache ${cacheName}`);
          return caches.delete(cacheName);
        }
      })
    );
  }

  // Wait activate process
  console.log(`${LOG_LABEL} Activate`);
  event.waitUntil(Promise.all([
    deleteOtherCache(),

    // Use service worker at first load
    clients.claim(),
  ]));
});


// Service worker fetch event
self.addEventListener('fetch', event => {
  
  // Add to cache from server
  const addToCache = async () => {
    const cache = await caches.open(SW_CACHE_NAME);
    const response = await fetch(event.request);
    cache.put(event.request.url, response.clone());
    console.log(`${LOG_LABEL} Add Cache ${event.request.url}`);
    return response;
  };

  // Check in cache
  // Or fetch request
  const checkOnCache = async () => {
    const response = await caches.match(event.request, { ignoreSearch: true });
    return response || fetch(event.request);
  };

  // Service worker fetch event Respond
  event.respondWith(
    safeUrl(event.request.url).includes(API_BASE_URL)
      ? addToCache()
      : checkOnCache()
  );
});
