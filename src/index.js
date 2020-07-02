import detectIt from 'detect-it';
import { registerServiceWorker } from './sw/register';
import { router } from './script/router';
import { APP_CONTAINER_SELECTOR } from './script/const';
import { permissionNotification } from './script/notification'
import './styles/main.scss';

// Import vectors
import ellipse1 from './assets/vector/ellipse1.svg';
import ellipse2 from './assets/vector/ellipse2.svg';
import ellipse3 from './assets/vector/ellipse3.svg';

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
 * Init background vector
 */
const initVectors = () => {
  const vector1 = document.querySelector('.vector__1');
  const vector2 = document.querySelector('.vector__2');
  const vector3 = document.querySelector('.vector__3');
  const vector4 = document.querySelector('.vector__4');

  vector1.src = ellipse1;
  vector2.src = ellipse2;
  vector3.src = ellipse3;
  vector4.src = ellipse3;
}


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

  initVectors();

  // First load
  await routeHandler();

  // Ask notification permission
  await permissionNotification();

  // Hash change listener
  window.addEventListener('hashchange', async () => { 
    
    // Log changed
    const LOG_LABEL = '[Page Hash]';
    console.log(`${LOG_LABEL} Changed to ${location.hash}`);
  
    await routeHandler();
    
  }, detectIt.passiveEvents ? { passive: true } : false);
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