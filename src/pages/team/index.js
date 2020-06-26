import Handlebars, { compile } from 'handlebars';
import teamTemplate from './index.hbs';
import Info from '../info';
import { Collapsible, toast } from 'materialize-css';
import { getTeam, getTeamMatches } from '../../script/api';
import { insert, read, remove } from '../../script/db';
import { 
  DB_OBJECT_STORE_NAME, 
  PAGE_INFO_IMG_SERVER_ERROR, 
  PAGE_INFO_CONTENT_SERVER_ERROR_TITLE,
  PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE,
} from '../../script/const'
import { localDate, localTime } from '../../script/util';
import './index.scss';

// Local label
const LOG_LABEL = '[Team Page]';

/**
 * Load team page into element
 * @param {Element} element parent to load team page 
 * @param {String, Int} id team id
 */
const Team = async (element, id) => {
  try {
    // Helper
    Handlebars.registerHelper('localDate', localDate);
    Handlebars.registerHelper('localTime', localTime);

    // Request data
    const team = await getTeam(id);
    let { matches } = await getTeamMatches(id, { status: 'SCHEDULED' });

    // Manipulate data for UI
    // Because cannot manipulate this data in handlebars template's  loop
    matches = matches.map(match => {
      const isAway = match.awayTeam.id == id;
      return {
        vsTeam: isAway ? match.homeTeam.name : match.awayTeam.name,
        matchType: `${isAway ? 'Away' : 'Home'} Match`,
        ...match,
      };
    });

    // Template need to compiled before manipulation
    element.innerHTML = compile(teamTemplate)({ team, matches: matches.slice(0, 5) });
    
    // DOM manipulation shoud after template compiled
    init({ ...team, matches });
  
  } catch(error) {
    if (!navigator.onLine) {
      await Info({
        element, 
        title: PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE, 
        message: PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE,
      });
    } else {
      await Info({
        element, 
        type: PAGE_INFO_IMG_SERVER_ERROR,
        title: PAGE_INFO_CONTENT_SERVER_ERROR_TITLE, 
        message: PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE,
      });
    }
    console.error(`${LOG_LABEL} Cannot load page ${error}`);
  }
}

/**
 * Check whether team is favorite or not
 * @param {Int} id
 * @return {Boolean} 
 */
const isFavorite = async (id) => {
  // Read team
  const data = await read({ objectStore: DB_OBJECT_STORE_NAME, keyPath: id });

  return !!data;
}

/**
 * Set team as favorite team
 * @param {Object} team 
 */
const setFavorite = async (team) => {

  // Check is favorite
  const teamIsFavorite = await isFavorite(team.id);
  
  // Set favorite only if team is not favorite yet
  if (!teamIsFavorite) {
    try {
      // Insert to database
      await insert({ objectStore: DB_OBJECT_STORE_NAME, payload: team });
      
      // Read all team
      const teams = await read({ objectStore: DB_OBJECT_STORE_NAME });

      // Delete other team
      teams.length && teams.forEach(async (data) => {
        if (team.id != data.id) {
          await remove({ objectStore: DB_OBJECT_STORE_NAME, keyPath: data.id });
        }
      });

      // Refresh page
      init(team);

      toast({html: 'This team is my team now'});
    } catch (error) {
      toast({html: 'Set my team failed'});
      console.error(error);
    }
  }
} 

/**
 * Show and hide UI based on team is favorite
 * @param {Boolean} isFavorite 
 */
const favoriteUIToggle = (isFavorite) => {
  const btnSetFavorite = document.querySelector('#btnSetFavorite');
  const alreadyFavorite = document.querySelector('#alreadyFavorite');
  
  // Show set favorite btn when team isn't favorite
  btnSetFavorite.style.display = !isFavorite ? 'flex' : 'none';

  // Show already favorite text when team is favorite 
  alreadyFavorite.style.display = isFavorite ? 'flex' : 'none';
}

/**
 * Every Page manipulation should do here
 * This is function also should run when favorite team changed
 * @param {Object} team
 */
const init = async (team) => {

  // Init collabsible
  const elems = document.querySelectorAll('.collapsible');
  Collapsible.init(elems);

  // When team is favorite
  const teamIsFavorite = await isFavorite(team.id);
  if (!teamIsFavorite) {

    // Button set favorite listener
    const btnSetFavorite = document.querySelector('#btnSetFavorite');
    btnSetFavorite.addEventListener('click', () => {
      setFavorite(team);
    });
  }

  // Set UI for favorite condition
  favoriteUIToggle(teamIsFavorite);
}

export default Team;