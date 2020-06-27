import navigationTemplate from './index.hbs';
import { Sidenav } from "materialize-css";
import { compile } from 'handlebars';

// Local log
const LOG_LABEL = '[Navigation Partial]';

// Navigation partal class
class Navigation {

  /**
   * Init navigation
   * @param {Element} element parent element to attach
   * @param {String} sidenavSelector DOM selector
   */
  constructor(element, sidenavSelector) {
    try {
      // Pass to local attributes
      this.element = element;
      this.sidenavSelector = sidenavSelector;

      // Compile navigation
      this.element.innerHTML = compile(navigationTemplate)();

      // Sidenav init
      document.addEventListener('DOMContentLoaded', () => {

        // Sidnav
        const elems = document.querySelectorAll(this.sidenavSelector);
        Sidenav.init(elems);

        // Sidenav instance
        this.instance = new Sidenav.getInstance(elems[0]);
      })

    } catch (error) {
      console.error(`${LOG_LABEL} Cannot load partial ${error}`);
    }
  }

  /**
   * Close sidenav
   */
  closeSidenav () {
    this.instance && this.instance.close();
  }
}

export default Navigation;
