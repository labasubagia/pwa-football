import Handlebars, { compile } from 'handlebars';
import detectIt from 'detect-it';
import matchTemplate from './index.hbs';
import { InfoAsNetworkError, InfoAsServerError } from '../info';
import { ERROR_FAILED_TO_FETCH } from '../../script/const';
import { getCompetitionMatches, getCompetitionInfo } from '../../script/api';
import { localDate, localTime } from '../../script/util';
import './index.scss';

// Local log
const LOG_LABEL = '[Match Page]';

/**
 * Show Matches page
 * @param {Element} element 
 * @param {Int} matchday
 */
const Match = async (element, matchday = null) => {
  
  try {

    // Handlebars Helpers
    [ 
      { name: 'localDate', method: localDate }, 
      { name: 'localTime', method: localTime },
      { name: 'if_eq', method: (a, b, options) => 
        a == b ? options.fn(this): options.inverse(this)
      }
    ].forEach(({ name, method }) => 
      Handlebars.registerHelper(name, method)
    );

    const matchStatusColor = {
      SCHEDULED: 'purple',  
      LIVE: 'blue',
      IN_PLAY: 'light-blue',
      PAUSED: 'brown',
      FINISHED: 'deep-orange',
      POSTPONED: 'pink',
      SUSPENDED: 'orange',
      CANCELED: 'red',
    }

    // Matchday settings
    const totalMatchday = 38;
    const totalMatchArray = Array.from(Array(totalMatchday), (_, i) => i + 1);
    const currentMatchday = await getDefaultMatchDay();

    // Default matchday
    if (!matchday || (matchday < 1 || matchday > 38 )) {
      matchday = currentMatchday;
    }

    // Get matchday data
    let { matches } = await getCompetitionMatches({ matchday });
    matches = matches.map(match => ({
      ...match,
      statusColor: matchStatusColor[match.status] || 'black',
      statusName: match.status.replace('_', ' '),
    }));

    // Load template
    element.innerHTML = compile(matchTemplate)({ matches, totalMatchArray, matchday, currentMatchday });

    // Manipulate DOM
    init();

  } catch (error) {

    // Network error
    if (!navigator.onLine || ERROR_FAILED_TO_FETCH) {
      await InfoAsNetworkError(element);
    } else {
      await InfoAsServerError(element);
    }

    console.error(`${LOG_LABEL} ${error.message}`);
  }
}

/**
 * Manipulate DOM
 */
const init = () => {

  // Matchday selector
  const matchdays = document.querySelectorAll('.matchday');
  matchdays.forEach(matchday => {

    // Onclick, change hash matchday
    matchday.addEventListener('click', () => {
      const day = matchday.dataset.matchday;
      location.hash = `#/match?matchday=${day}`;
    }, detectIt.passiveEvents ? { passive: true } : false);

  });
  
}

/**
 * Get default match day
 * @return {Int}
 */
const getDefaultMatchDay = async () => {
  const info = await getCompetitionInfo();
  return info.currentSeason.currentMatchday;
}

export default Match;