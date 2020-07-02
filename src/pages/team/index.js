import Handlebars, { compile } from 'handlebars';
import detectIt from 'detect-it';
import { Collapsible, toast } from 'materialize-css';
import { getTeam, getTeamMatches } from '../../script/api';
import { insert, read, remove } from '../../script/db';
import teamTemplate from './index.hbs';
import { DB_OBJECT_STORE_NAME, ERROR_FAILED_TO_FETCH } from '../../script/const';
import { localDate, localTime, safeUrl } from '../../script/util';
import { InfoAsNetworkError, InfoAsServerError } from '../info';
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
  
    // Handlebars Helpers
    [ 
      { name: 'localDate', method: localDate }, 
      { name: 'localTime', method: localTime }, 
      { name: 'safeUrl', method: safeUrl } 
    ].forEach(({ name, method }) => 
      Handlebars.registerHelper(name, method)
    );

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

    // Show info error
    if (!navigator.onLine || error.message == ERROR_FAILED_TO_FETCH) {
      await InfoAsNetworkError(element);
    } else {
      await InfoAsServerError(element);
    }
    
    console.error(`${LOG_LABEL} ${error}`);
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
    }, detectIt.passiveEvents ? { passive: true } : false);
  }

  // Set UI for favorite condition
  favoriteUIToggle(teamIsFavorite);
}

export default Team;