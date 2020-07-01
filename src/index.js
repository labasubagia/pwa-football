import { registerServiceWorker } from './sw/register';
import { router } from './script/router';
import { APP_CONTAINER_SELECTOR } from './script/const';
import { permissionNotification } from './script/notification'
import './styles/main.scss';

// Partial
import Loading from './partial/loading';
import Navigation from './partial/navigation';

// Navigation Partial 
const navigationDOM = document.querySelector('#nav');
const navigation = new Navigation(navigationDOM, '.sidenav');

// Loading Partial
const loadingDOM = document.querySelector('#progress');
const loading = new Loading(loadingDOM);

/** 
 * Handle location hash changed
 * Change app content
 */
const routeHandler = async () => { 

  try {

    loading.show();
    navigation.closeSidenav();

    // Use router
    await router(APP_CONTAINER_SELECTOR);

  } catch (error) {
    const LOG_LABEL = '[Route]';
    console.error(`${LOG_LABEL} Cannot route ${error}`);
  
  } finally {
    loading.hide();
  }
}

// Init data
const init = async () => {

  // First load
  await routeHandler();

  // Ask notification permission
  permissionNotification();

  // Hash change listener
  window.addEventListener('hashchange', async () => { 
    
    // Log changed
    const LOG_LABEL = '[Page Hash]';
    console.log(`${LOG_LABEL} Changed to ${location.hash}`);
  
    await routeHandler();
  });
}

/**
 * Refresh content inside app sheell
 * Trigger hashchange event in order to refresh page
 */
const refreshAppContent = () => {
  routeHandler();
  console.log('[App Shell] Reload page');
}

// Register service worker
registerServiceWorker(init);

export { refreshAppContent };