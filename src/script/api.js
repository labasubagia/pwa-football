import {
  API_BASE_URL,
  BROWSER_CACHE,
  API_CONFIG_COMPETITION,
  ERROR_FAILED_TO_FETCH,
} from './const';
import { safeUrl } from './util';

const LOG_LABEL = '[Fetch]';

// Headers Token
const headers = {
  'X-Auth-Token': '8e4451c2e3714fb095f3762553f7578a',
};

/**
 * Get data from cache first
 * Update when online is optional
 * @param {String} url
 * @param {Boolean} isOnlineUpdate
 */
const getFromCache = async (url, isOnlineUpdate = true) => {
  // Check url in cache
  const cacheResponse = await caches.match(url);

  // Cache data is exist
  if (cacheResponse) {
    // Assign cache data
    const cacheData = await cacheResponse.clone().json();

    // Browser is online
    if (navigator.onLine && isOnlineUpdate) {
      console.log(`${LOG_LABEL} Check data to ${url}`);

      // When connection slow
      // Abort fetch
      const controller = new AbortController();
      const { signal } = controller;

      // Throw AbortError when time is up
      setTimeout(() => controller.abort(), 5000);

      // Get server data
      const serverResponse = await fetch(url, { headers, signal });
      const serverData = await serverResponse.clone().json();

      console.log(`${LOG_LABEL} Check data retrieved from ${url}`);

      // Compare server & cache data
      // Use server data when data not same
      if (JSON.stringify(cacheData) !== JSON.stringify(serverData)) {
        console.log(`${LOG_LABEL} Update from ${url}`);
        return serverData;
      }
    }

    // Load from cache
    console.log(`${LOG_LABEL} Local ${url}`);
    return cacheData;
  }

  return null;
};

/**
 * Fetch GET Request
 * @param {String} paramUrl
 * @param {Object} queryParams
 * @return {Promise}
 */
const getRequest = async (paramUrl, queryParams = null) => {
  let url = paramUrl;

  // Add query params to url
  if (queryParams) {
    url = `${url}?${new URLSearchParams(queryParams)}`;
  }

  // Make url safe
  url = safeUrl(url);

  try {
    // When browser support cache
    // Load from cache first
    if (BROWSER_CACHE in window) {
      // Get data from cache
      // If online, try to request online data
      const cacheFirstData = await getFromCache(url);
      if (cacheFirstData) return cacheFirstData;
    }

    // When browser doesn't support cache or cache not exist
    // Server request
    console.log(`${LOG_LABEL} Remote ${url}`);
    const response = await fetch(url, { headers });
    return response.json();
  } catch (error) {
    // Try to get cache data
    const cacheData = await getFromCache(url, false);

    // Abort error return cache data
    if (error.name === 'AbortError') {
      console.warn(`${LOG_LABEL} ${error.name} Connection is to slow`);

      // Return cache if exist
      if (cacheData) return cacheData;
    }

    // When try request online data and fail
    // Use local data if exist
    if (error.message === ERROR_FAILED_TO_FETCH && cacheData) {
      console.warn(`${LOG_LABEL} ${error.message}, so use local data`);
      return cacheData;
    }

    // And throw to scope where this function used
    throw error;
  }
};

/**
 * Get Standings Premier League
 * @return {Promise}
 */
const getStanding = async () => {
  const url = `${API_BASE_URL}/competitions/${API_CONFIG_COMPETITION}/standings`;
  return getRequest(url);
};

/**
 * Get Team By Id
 * @param {String, Int} id Team ID
 * @return {Promise}
 */
const getTeam = async (id) => {
  const url = `${API_BASE_URL}/teams/${id}`;
  return getRequest(url);
};

/**
 * Get matches of a team
 * @param {String, Int} id Team ID
 * @param {Object} queryParams url params
 * @return {Promise}
 */
const getTeamMatches = async (id, queryParams = null) => {
  const url = `${API_BASE_URL}/teams/${id}/matches`;
  return getRequest(url, queryParams);
};

/**
 * Get competition matches
 * @param {Object} queryParams url params
 * @return {Promise}
 */
const getCompetitionMatches = async (queryParams = null) => {
  const url = `${API_BASE_URL}/competitions/${API_CONFIG_COMPETITION}/matches`;
  return getRequest(url, queryParams);
};

/**
 * Get competition info
 * @param {Object} queryParams url params
 * @return {Promise}
 */
const getCompetitionInfo = async (queryParams = null) => {
  const url = `${API_BASE_URL}/competitions/${API_CONFIG_COMPETITION}`;
  return getRequest(url, queryParams);
};

export {
  getRequest,
  getStanding,
  getTeam,
  getTeamMatches,
  getCompetitionMatches,
  getCompetitionInfo,
};
