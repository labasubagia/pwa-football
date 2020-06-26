import errorTemplate from './index.hbs';
import { compile} from 'handlebars';
import { timeout as waitTimeout } from '../../script/util';
import { 
  PAGE_INFO_IMG_SERVER_ERROR,
  PAGE_INFO_IMG_WARNING,
  PAGE_INFO_IMG_EMPTY,
} from '../../script/const';
import './index.scss';

// Local log
const LOG_LABEL = '[Info Page]';

// Images
import choose from '../../assets/img/undraw_choose.svg';
import serverDown from '../../assets/img/undraw_server_down.svg';
import warning from '../../assets/img/undraw_warning.svg';

// Image object
// Select based on key
const images = {
  [PAGE_INFO_IMG_SERVER_ERROR]: serverDown,
  [PAGE_INFO_IMG_WARNING]: warning,
  [PAGE_INFO_IMG_EMPTY]: choose,
};

/**
 * Load Info page
 * @param {Element} element 
 * @param {String} type 
 * @param {String} title 
 * @param {String} message
 * @param {String} additionalHtml Html in string 
 * @param {Int} timeout Millisecond
 */
const Info = async ({element, type = PAGE_INFO_IMG_WARNING, title, message, additionalHtml, timeout }) => {
  try {
    // Pretend to loading
    timeout && await waitTimeout(timeout);

    element.innerHTML = compile(errorTemplate)({ image: images[type], title, message, additionalHtml });
  } catch (error) {
    console.error(`${LOG_LABEL} Failed to load ${error}`);
  }
}

export default Info;