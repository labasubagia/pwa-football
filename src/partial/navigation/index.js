import detectIt from 'detect-it';
import { Sidenav } from 'materialize-css';
import { compile } from 'handlebars';
import navigationTemplate from './index.hbs';
import './index.scss';

// Local log
const LOG_LABEL = '[Navigation Partial]';

// Navigation partial class
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
      this.element.innerHTML = compile(navigationTemplate)({
        routes: this.routes,
      });

      // Sidenav init
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          // Sidenav
          const elements = document.querySelectorAll(this.sidenavSelector);
          Sidenav.init(elements);

          // Sidenav instance
          // eslint-disable-next-line new-cap
          this.instance = new Sidenav.getInstance(elements[0]);
        },
        detectIt.passiveEvents ? { passive: true } : false,
      );
    } catch (error) {
      console.error(`${LOG_LABEL} Cannot load partial ${error}`);
    }
  }

  /**
   * Close sidenav
   */
  closeSidenav() {
    if (this.instance) this.instance.close();
  }
}

export default Navigation;
