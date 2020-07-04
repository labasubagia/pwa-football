/**
 * Make url safe by change http to https
 * @param {String} url
 * @return {String}
 */
const safeUrl = (url) => url.replace(/^http:\/\//i, 'https://');

/**
 * Format locale date
 * @param {String} date
 * @return {String}
 */
const localDate = (date) => new Date(date).toLocaleDateString();

/**
 * Format locale time
 * @param {String} time
 * @return {String}
 */
const localTime = (time) => new Date(time).toLocaleTimeString();

/**
 * Make timeout
 * @param {Int} ms Millisecond
 */
const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export { safeUrl, localDate, localTime, timeout };
