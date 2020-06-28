import errorTemplate from './index.hbs';
import { compile} from 'handlebars';
import { timeout as waitTimeout } from '../../script/util';
import { 
  PAGE_INFO_IMG_SERVER_ERROR,
  PAGE_INFO_IMG_WARNING,
  PAGE_INFO_IMG_EMPTY,
  PAGE_INFO_CONTENT_ACTION_TEXT_BACK,
  PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD,
  PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE,
  PAGE_INFO_CONTENT_SERVER_ERROR_TITLE,
  PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE,
} from '../../script/const';
import { refreshAppContent } from '../../index';
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
const Info = async ({
    element, 
    image = PAGE_INFO_IMG_WARNING, 
    title, 
    message, 
    timeout,
    actionText = PAGE_INFO_CONTENT_ACTION_TEXT_BACK, 
    callback = () => {
      // Default back to previous page
      console.log(`${LOG_LABEL} Back to previous page`); 
      history.back();
    }, 
  }) => {
  try {

    // Compile template
    element.innerHTML = compile(errorTemplate)({ image: images[image], title, message, actionText });

    // Init btn action
    const btnActionDOM = document.querySelector('#btnAction');
    if(btnActionDOM) {
      btnActionDOM.addEventListener('click', callback);
    }

    // Pretend to loading
    timeout && await waitTimeout(timeout);

  } catch (error) {
    console.error(`${LOG_LABEL} Failed to load ${error}`);
  }
}

/**
 * Info show network error
 * @param {Element} element 
 */
const InfoAsNetworkError = async (element) => {
  await Info({
    element, 
    actionText: PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD,
    callback: refreshAppContent,
    title: PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE, 
    message: PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE,
  })
}

/**
 * Info show server error
 * @param {Element} element 
 */
const InfoAsServerError = async (element) => {
  await Info({
    element, 
    actionText: PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD,
    callback: refreshAppContent,
    title: PAGE_INFO_CONTENT_SERVER_ERROR_TITLE, 
    message: PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE,
  })
}

export {
  Info,
  InfoAsNetworkError,
  InfoAsServerError, 
};