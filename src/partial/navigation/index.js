import { Sidenav } from "materialize-css/dist/js/materialize.min.js";

/**
 * Init sidenav in Navigation when DOM loaded
 * @param {String} selector 
 */
const initSidenav = selector => 
  document.addEventListener('DOMContentLoaded', () => {
    const elems = document.querySelectorAll(selector);
    Sidenav.init(elems);
  });


/**
 * Close sidenav
 * @param {String} selector 
 */
const closeSidenav = selector => {
  const elem = document.querySelector(selector);
  const instance = new Sidenav.getInstance(elem);
  instance && instance.close();
}

export {
  initSidenav,
  closeSidenav,
}