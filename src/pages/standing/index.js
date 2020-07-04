import Handlebars, { compile } from 'handlebars';
import standingTemplate from './index.hbs';
import {
  ERROR_FAILED_TO_FETCH,
  APP_CONTAINER_SELECTOR,
} from '../../script/const';
import { safeUrl } from '../../script/util';
import { getStanding } from '../../script/api';
import defaultIcon from '../../assets/icon/icon.png';
import './index.scss';

// Local log
const LOG_LABEL = '[Standing Page]';

// Register helper function in handlebars template
Handlebars.registerHelper('safeUrl', safeUrl);

/**
 * Load standing page into element
 * @param {String} appSelector parent element selector to load page
 */
const Standing = async (appSelector = APP_CONTAINER_SELECTOR) => {
  try {
    // Get parent element
    const element = document.querySelector(appSelector);

    // Request data
    const data = await getStanding();

    // Compile template
    const context = { table: data.standings[0].table, defaultIcon };
    element.innerHTML = compile(standingTemplate)(context);
  } catch (error) {
    // Show info error
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

    console.error(`${LOG_LABEL} ${error}`);
  }
};

export default Standing;
