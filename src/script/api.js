import { 
  API_BASE_URL, 
  BROWSER_CACHE, 
  API_CONFIG_COMPETITION 
} from './const';
import { safeUrl } from './util'

const LOG_LABEL = '[Fetch]';

// Headers Token
const headers = {
  'X-Auth-Token': '8e4451c2e3714fb095f3762553f7578a',
};

/**
 * Fetch GET Request
 * @param {String} url 
 * @param {String} queryParams
 * @return {Promise} 
 */
const getRequest = async (url, queryParams = null) => {

  // Add qeury params to url
  if (queryParams) {
    url = `${url}?${ new URLSearchParams(queryParams) }`;
  }

  // Make url safe
  url = safeUrl(url);

  // Define cache data
  let cacheData = null;

  try {

    // When browser support cache
    // Load from cache first
    if (BROWSER_CACHE in window) {  
      
      // Check url in cache
      const cacheResponse = await caches.match(url);
      
      // Cache data is exist
      if (cacheResponse) {

        // Assingn cache data
        cacheData = await cacheResponse.clone().json();
      
        // Browser is online
        if (navigator.onLine) {

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
          
          console.log(`${LOG_LABEL} Check data retrived from ${url}`);

          // Compare server & cache data
          // Use server data when data not same
          if (JSON.stringify(cacheData) != JSON.stringify(serverData)) {
            console.log(`${LOG_LABEL} Update from ${url}`);
            return serverData;
          }
        }
        
        // Load from cache
        console.log(`${LOG_LABEL} Local ${url}`);
        return cacheData;
      }
    } 
    
    // When browser doesn't support cache or cache not exist
    // Server request
    console.log(`${LOG_LABEL} Remote ${url}`);
    const response = await fetch(url, { headers });
    return response.json();

  } catch (error) {

    // Abort error return cache data
    if(cacheData && error.name === 'AbortError') {
      console.warn(`${LOG_LABEL} ${error.name} Connection to slow`);
      return cacheData;
    }

    // Other error
    console.error(`${LOG_LABEL} ${error.message}`);
    return null;
  }
}


/**
 * Get Standings Premier League
 * @return {Promise}
 */
const getStanding = async () => {
  const url = `${API_BASE_URL}/competitions/${API_CONFIG_COMPETITION}/standings`;
  return getRequest(url);
}

/**
 * Get Team By Id
 * @param {Strning, Int} id Team ID
 * @return {Promise} 
 */
const getTeam = async (id)  => {
  const url = `${API_BASE_URL}/teams/${id}`;
  return getRequest(url);
}

/**
 * Get matches of a team
 * @param {String, Int} id Team ID
 * @param {String} queryParams url params
 * @return {Promise}
 */
const getTeamMatches = async (id, queryParams = null) => {
  const url = `${API_BASE_URL}/teams/${id}/matches`;
  return getRequest(url, queryParams);
}

/**
 * Get competition matches
 * @param {String} queryParams url params
 * @return {Promise} 
 */
const getCompetitionMatches = async (queryParams = null) => {
  const url = `${API_BASE_URL}/competitions/${API_CONFIG_COMPETITION}/matches`;
  return getRequest(url, queryParams);
}

export {
  getRequest,
  getStanding,
  getTeam,
  getTeamMatches,
  getCompetitionMatches,
}