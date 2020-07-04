import Handlebars, { compile } from 'handlebars';
import detectIt from 'detect-it';
import matchTemplate from './index.hbs';
import {
  ERROR_FAILED_TO_FETCH,
  APP_CONTAINER_SELECTOR,
} from '../../script/const';
import { getCompetitionMatches, getCompetitionInfo } from '../../script/api';
import { localDate, localTime } from '../../script/util';
import './index.scss';

// Local log
const LOG_LABEL = '[Match Page]';

/**
 * Manipulate DOM
 */
const init = () => {
  // Matchday selector
  const matchdays = document.querySelectorAll('.matchday');
  matchdays.forEach((matchday) => {
    // Onclick, change hash matchday
    matchday.addEventListener(
      'click',
      () => {
        const day = matchday.dataset.matchday;
        window.location.hash = `#/match?matchday=${day}`;
      },
      detectIt.passiveEvents ? { passive: true } : false,
    );
  });
};

/**
 * Get default match day
 * @return {Int}
 */
const getDefaultMatchDay = async () => {
  const info = await getCompetitionInfo();
  return info.currentSeason.currentMatchday;
};

/**
 * Show Matches page
 * @param {String} appSelector parent element selector
 * @param {Int} paramMatchday matchday number
 */
const Match = async (
  appSelector = APP_CONTAINER_SELECTOR,
  paramMatchday = null,
) => {
  try {
    let matchday = paramMatchday;

    // Get parent element
    const element = document.querySelector(appSelector);

    // Handlebars Helpers
    [
      { name: 'localDate', method: localDate },
      { name: 'localTime', method: localTime },
      {
        name: 'if_eq',
        method: (a, b, options) =>
          String(a) === String(b) ? options.fn(this) : options.inverse(this),
      },
    ].forEach(({ name, method }) => Handlebars.registerHelper(name, method));

    const matchStatusColor = {
      SCHEDULED: 'purple',
      LIVE: 'blue',
      IN_PLAY: 'light-blue',
      PAUSED: 'brown',
      FINISHED: 'deep-orange',
      POSTPONED: 'pink',
      SUSPENDED: 'orange',
      CANCELED: 'red',
    };

    // Matchday settings
    const totalMatchday = 38;
    const totalMatchArray = Array.from(Array(totalMatchday), (_, i) => i + 1);
    const currentMatchday = await getDefaultMatchDay();

    // Default matchday
    if (!matchday || matchday < 1 || matchday > 38) {
      matchday = currentMatchday;
    }

    // Get matchday data
    let { matches } = await getCompetitionMatches({ matchday });
    matches = matches.map((match) => ({
      ...match,
      statusColor: matchStatusColor[match.status] || 'black',
      statusName: match.status.replace('_', ' '),
    }));

    // Load template
    element.innerHTML = compile(matchTemplate)({
      matches,
      totalMatchArray,
      matchday,
      currentMatchday,
    });

    // Manipulate DOM
    init();
  } catch (error) {
    // Network error
    if (!navigator.onLine || error.message === ERROR_FAILED_TO_FETCH) {
      const { InfoAsNetworkError } = await import(
        /* webpackChunkName: "info_error_network" */ '../info'
      );
      await InfoAsNetworkError(appSelector);
    } else {
      const { InfoAsServerError } = await import(
        /* webpackChunkName: "info_error_server" */ '../info'
      );
      await InfoAsServerError(appSelector);
    }

    console.error(`${LOG_LABEL} ${error.message}`);
  }
};

export default Match;
