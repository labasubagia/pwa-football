import Handlebars, { compile } from 'handlebars';
import standingTemplate from './index.hbs';
import Info from '../info';
import { 
  PAGE_INFO_IMG_SERVER_ERROR, 
  PAGE_INFO_CONTENT_SERVER_ERROR_TITLE, 
  PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE, 
} from '../../script/const';
import { safeUrl } from '../../script/util';
import { getStanding } from '../../script/api';
import './index.scss';

// Local log
const LOG_LABEL = '[Standing Page]';

// Register helper function in handlebars template
Handlebars.registerHelper('safeurl', safeUrl);

/**
 * Load standing page into element
 * @param {Element} element parent element to load page
 */
const Standing = async (element) => {
  try {
    const data = await getStanding();
    const context = { table: data.standings[0].table };
    element.innerHTML = compile(standingTemplate)(context);
  } catch (error) {
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
    console.log(`${LOG_LABEL} Cannot load page ${error}`);
  }
}

export default Standing;