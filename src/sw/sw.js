import detectIt from 'detect-it';
import { skipWaiting, clientsClaim, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { SW_CACHE_NAME, API_BASE_URL } from '../script/const';
import icon from '../assets/icon/icon.png';

// Use newest service worker
skipWaiting();

// Use service worker at first load
clientsClaim();

// Set precache and runtime cache name
setCacheNameDetails({
  prefix: SW_CACHE_NAME,
  suffix: 'v1',
  precache: 'precache',
  runtime: 'runtime',
});

// Cache webpack
precacheAndRoute(self.__WB_MANIFEST, {
  // Ignore search url
  ignoreURLParametersMatching: [/.*/],
});

// Make API Offline
registerRoute(
  new RegExp(API_BASE_URL),
  new StaleWhileRevalidate({
    cacheName: 'api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // Entries count
        maxAgeSeconds: 60 * 60 * 24, // 1 day
        purgeOnQuotaError: true, // Clear if cache exceed quota
      }),
    ],
  }),
);

// Push event
self.addEventListener(
  'push',
  (event) => {
    // Read event message
    let body = "Push doesn't have message";
    if (event.data) body = event.data.text();

    // Notification settings
    const options = {
      body,
      icon,
      vibrate: [100, 50, 50],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
      },
    };

    event.waitUntil(
      // Show notifications
      self.registration.showNotification('Football App News', options),
    );
  },
  detectIt.passiveEvents ? { passive: true } : false,
);
