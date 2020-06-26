import { compile } from 'handlebars';
import { registerServiceWorker } from './sw/register';
import './styles/main.scss';

// Templates
import loadingTemplate from './partial/loading/index.hbs';
import navigationTemplate from './partial/navigation/index.hbs';
import { initSidenav, closeSidenav } from './partial/navigation/index';

// Import Routes
import Standing from "./pages/standing";
import Team from './pages/team';
import Info from './pages/info';

// Navigation DOM 
const navigation = document.querySelector('#nav');
navigation.innerHTML = compile(navigationTemplate)();
initSidenav('.sidenav');

// Loading DOM
const loading = document.querySelector('#progress');
loading.innerHTML = compile(loadingTemplate)();

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

    showLoading();
    closeSidenav('.sidenav');

    // App
    const app = document.querySelector('#app');

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
      
      // 404 page
      default:
        const title = '404';
        await Info({
          element: app, 
          title: title, 
          message: 'Page not found, please check your url!',
          timeout: 500,
        });
        pageTitle = title;
    }

  } catch (error) {
    const LOG_LABEL = '[Route]';
    console.error(`${LOG_LABEL} Cannot route ${error}`);
  
  } finally {
    // Change title
    document.title = pageTitle;
    showLoading(false);
  }
}

/**
 * Show and hide loading indicator
 * @param {Boolean} state 
 */
const showLoading = (state = true) => {
  loading.style.display = state ? 'block' : 'none';
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

registerServiceWorker(init);
