import { safeUrl } from '../script/util';
import { SW_CACHE_NAME, API_BASE_URL } from '../script/const';

// Local Label
const LOG_LABEL = '[Service Worker]';

// Resources need to be offline
// NOTE: When use native service worker please match filename in webpack config
const urlToCache = [
  './',
  './favicon.ico',
  './img/undraw_choose.svg',
  './img/undraw_server_down.svg',
  './img/undraw_warning.svg',
  './img/ellipse1.svg',
  './img/ellipse2.svg',
  './img/ellipse3.svg',
  './img/icon.png',
  './icon_192x192.png',
  './icon_512x512.png',
  './index.html',
  './index.css',
  './index.js',
  './manifest.json',
];


// Service worker install event
self.addEventListener('install', event => {

  // Cache files all
  const preCache = async () => {
    const cache = await caches.open(SW_CACHE_NAME);
    
    // // Add all url at once
    // return cache.addAll(urlToCache);
    
    // Add url one by one
    // So easier to know broken url
    return Promise.all(
      urlToCache.map(async url => {
        try {
          return cache.add(url);
        
        } catch (error) {
          console.error(`${LOG_LABEL} Install Cache failed ${url}: ${error.message}`);

          // Return promise undefined
          // Same as cache.add()
          return Promise.resolve(undefined);
        }
      })
    );
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
  
  // Null response, use when fetch fail
  const nullResponse = new Response(JSON.stringify(null));

  // Add to cache from server
  const addToCache = async () => {
    try {
      const cache = await caches.open(SW_CACHE_NAME);
      const response = await fetch(event.request);
      cache.put(event.request.url, response.clone());
      console.log(`${LOG_LABEL} Add to cache ${event.request.url}`);
      return response;
    } catch (error) {
      console.error(`${LOG_LABEL} Event fetch, ${error.message}`);
      return nullResponse;
    }
  };

  // Check in cache
  // Or fetch request
  const checkOnCache = async () => {
    try {
      const response = await caches.match(event.request, { ignoreSearch: true });
      return response || fetch(event.request);
    } catch (error) {
      console.error(`${LOG_LABEL} Event fetch, ${error.message}`);
      return nullResponse;
    }
  };

  // Service worker fetch event Respond
  const url = safeUrl(event.request.url);
  event.respondWith(
    url.includes(API_BASE_URL)
    || url.includes(location.origin)
      ? addToCache()
      : checkOnCache()
  );
});

// Push event
self.addEventListener('push', event => {

  // Read event message
  let body = "Push doesn't have message";
  if (event.data) 
    body = event.data.text();

  // Notification settings
  const options = {
    body,
    icon: './img/icon.png',
    vibrate: [100, 50, 50],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    // Show notifications
    self.registration.showNotification('Football App News', options)
  );
})