import navigationTemplate from './index.hbs';
import { Sidenav } from "materialize-css";
import { compile } from 'handlebars';
import './index.scss';

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

      // Routes List
      this.routes = [
        { link: '#/', label: 'Home' },
        { link: '#/match', label: 'Match' },
        { link: '#/myteam', label: 'My Team' },
      ];

      // Pass to local attributes
      this.element = element;
      this.sidenavSelector = sidenavSelector;

      // Compile navigation
      this.element.innerHTML = compile(navigationTemplate)({ routes: this.routes });

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
