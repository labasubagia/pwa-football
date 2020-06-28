import { registerServiceWorker } from './sw/register';
import { APP_CONTAINER_SELECTOR } from './script/const';
import './styles/main.scss';

// Partial
import Loading from './partial/loading';
import Navigation from './partial/navigation';

// Import Routes
import Standing from "./pages/standing";
import Team from './pages/team';
import MyTeam from './pages/myteam';
import { Info } from './pages/info';

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
const hashHandler = async () => { 
  
  // Modify page title
  let pageTitle = document.title;

  try {

    // Hash & params
    let [hash, param] = location.hash.split('?');
    if (!hash) {
      location.hash = hash = '#/';
    }
    param = new URLSearchParams(param);

    loading.show();
    navigation.closeSidenav();

    // App
    const app = document.querySelector(APP_CONTAINER_SELECTOR);

    // Set app content
    switch(hash) {

      // Home show standing page
      case '#/':
        pageTitle = 'Standing';
        await Standing(app);
        break;

      // Team detail
      case '#/team':
        pageTitle = 'Team';
        const id = param.get('id');
        await Team(app, id);
        break;
      
      // My Team
      case '#/myteam':
        pageTitle = 'My Team';
        await MyTeam(app);
        break;

      // 404 page
      default:
        const page = hash.substr(2);
        pageTitle = '404';
        await Info({
          element: app, 
          title: pageTitle, 
          message: `Page <strong>${page}</strong> not found, please check your url!`,
          timeout: 1000,
        });
    }

  } catch (error) {
    const LOG_LABEL = '[Route]';
    console.error(`${LOG_LABEL} Cannot route ${error}`);
  
  } finally {
    // Change title
    document.title = pageTitle;
    loading.hide();
  }
}

// Init data
const init = async () => {

  // First load
  await hashHandler();

  // Hash change listener
  window.addEventListener('hashchange', async () => { 
    
    // Log changed
    const LOG_LABEL = '[Page Hash]';
    console.log(`${LOG_LABEL} Changed to ${location.hash}`);
  
    await hashHandler();
  });
}

/**
 * Refresh content inside app sheell
 * Trigger hashchange event in order to refresh page
 */
const refreshAppContent = () => {
  hashHandler();
  console.log('[App Shell] Reload page');
}

// Register service worker
registerServiceWorker(init);

export { refreshAppContent };