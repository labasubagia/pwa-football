import { BROWSER_SERVICE_WORKER } from './../script/const';

// Local Log Label
const LOG_LABEL = '[Register Service Worker]';

/**
 * Register Service Worker 
 * And then run callback function
 * @param {Function} callback 
 */
const registerServiceWorker = (callback = () => {}) => {
  
  // Register when supported
  if (BROWSER_SERVICE_WORKER in navigator) {

    // Run when page loaded
    window.addEventListener('load', async () => {

      // Register Service Worker
      // Then Run Callback
      try {
        await navigator.serviceWorker.register('sw.js', { scope: '/' });
        console.log(`${LOG_LABEL} Successful`);
        callback()
      } catch (error) {
        console.error(`${LOG_LABEL} Failed`, error);
      }

    });

  } else {
    console.error(`${LOG_LABEL} This browser doesn't support service worker!`);
    callback();
  }
};

export { 
  registerServiceWorker,
};