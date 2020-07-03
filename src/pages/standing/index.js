import Handlebars, { compile } from 'handlebars';
import standingTemplate from './index.hbs';
import { ERROR_FAILED_TO_FETCH } from '../../script/const';
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
 * @param {Element} element parent element to load page
 */
const Standing = async (element) => {
  try {
    const data = await getStanding();
    const context = { table: data.standings[0].table, defaultIcon };
    element.innerHTML = compile(standingTemplate)(context);
  } catch (error) {

    // Show info error
    if (!navigator.onLine || error.message == ERROR_FAILED_TO_FETCH) {
      const { InfoAsNetworkError } = await import(/* webpackChunkName: "info_error_network" */ '../info');
      await InfoAsNetworkError(element);
    } else {
      const { InfoAsServerError } = await import(/* webpackChunkName: "info_error_server" */ '../info');
      await InfoAsServerError(element);
    }
    
    console.error(`${LOG_LABEL} ${error}`);
  }
}

export default Standing;