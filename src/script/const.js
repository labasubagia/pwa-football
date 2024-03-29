const BROWSER_SERVICE_WORKER = 'serviceWorker';
const BROWSER_CACHE = 'caches';

const DB_NAME = 'football';
const DB_VERSION = 1;
const DB_OBJECT_STORE_NAME = 'my_team';

const SW_CACHE_NAME = 'football';

const API_BASE_URL = 'https://api.football-data.org/v2';
const API_CONFIG_COMPETITION = 'SA';

const APP_CONTAINER_SELECTOR = '#app';

const PAGE_INFO_IMG_SERVER_ERROR = 'img_server_error';
const PAGE_INFO_IMG_WARNING = 'img_warning';
const PAGE_INFO_IMG_EMPTY = 'img_empty';
const PAGE_INFO_CONTENT_SERVER_ERROR_TITLE = 'Server Error!';
const PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE =
  'An error occurs in server, please try again later!';
const PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE = 'Network Error!';
const PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE =
  'Please check your internet connection and try again later!';
const PAGE_INFO_CONTENT_ACTION_TEXT_BACK = 'Back to previous page';
const PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD = 'Reload page';

const ERROR_FAILED_TO_FETCH = 'Failed to fetch';

const PUSH_SENDER_KEY = '641796850677';

const PUSH_VAPID_KEY_PUBLIC =
  /* spell-checker: disable-next-line */
  'BHXvEFc_ArVKKae8km_urJQbJ4W_-9DmeiIZLQMHuQyXWkrLxkCnaxY_ls8SJuozLaXchy-H2kx8vhmmF_qhLhA';

const PUSH_VAPID_KEY_PRIVATE =
  /* spell-checker: disable-next-line */
  'cH3MGTtEt2PdzzdJSz_lRsak7-9pdBcfiLKoPmXTXVc';

module.exports = {
  // Browser features
  BROWSER_SERVICE_WORKER,
  BROWSER_CACHE,

  // IndexedDB configuration
  DB_NAME,
  DB_VERSION,
  DB_OBJECT_STORE_NAME,

  // Service worker configuration
  SW_CACHE_NAME,

  // Api configuration
  API_BASE_URL,
  API_CONFIG_COMPETITION,

  // App
  APP_CONTAINER_SELECTOR,

  // Page Info
  PAGE_INFO_IMG_SERVER_ERROR,
  PAGE_INFO_IMG_WARNING,
  PAGE_INFO_IMG_EMPTY,
  PAGE_INFO_CONTENT_SERVER_ERROR_TITLE,
  PAGE_INFO_CONTENT_SERVER_ERROR_MESSAGE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_TITLE,
  PAGE_INFO_CONTENT_NETWORK_ERROR_MESSAGE,
  PAGE_INFO_CONTENT_ACTION_TEXT_BACK,
  PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD,

  // Error
  ERROR_FAILED_TO_FETCH,

  // Push API
  PUSH_SENDER_KEY,
  PUSH_VAPID_KEY_PUBLIC,
  PUSH_VAPID_KEY_PRIVATE,
};
