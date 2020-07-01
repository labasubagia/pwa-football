import { APP_CONTAINER_SELECTOR } from './const';

// Import Routes
import Standing from "../pages/standing";
import Team from '../pages/team';
import MyTeam from '../pages/myteam';
import Match from '../pages/match';
import { Info } from '../pages/info';

// Local Log
const LOG_LABEL = '[Router]'; 

/**
 * Selector for app shell content
 * @param {String} appSelector 
 */
const router = async (appSelector = APP_CONTAINER_SELECTOR) => {

  // Modify page title
  let pageTitle = document.title;

  try {
    // App shell content
    const app = document.querySelector(appSelector);

    // App shell content not defined
    if (!app) {
      throw new Error('App shell content not defined');
    }

    // Hash & params
    let [hash, param] = location.hash.split('?');
    hash = hash = '#/';
    param = new URLSearchParams(param);

    // Set App shell content
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

      // Match
      case '#/match':
        pageTitle = 'Matches';
        const matchday = param.get('matchday') || null;
        await Match(app, matchday);
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
    
    // Log error
    console.error(`${LOG_LABEL} ${error.message}`);

    // Throw error to scope that this function called
    throw error;
  
  } finally {
    
    // Change title
    document.title = pageTitle;
  }

}

export { router }