import loadingTemplate from './index.hbs';
import { compile } from 'handlebars';
import './index.scss';

// Local log
const LOG_LABEL = '[Loading Partial]';

// Loading component class
class Loading {
  /**
   * Constructor
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    try {
      this.element.innerHTML = compile(loadingTemplate)();
    } catch (error) {
      console.error(`${LOG_LABEL} Cannot load partial ${error}`);
    }
  }

  /**
   * Show and hide loading indicator
   * @param {Boolean} state
   */
  show(state = true) {
    const loading = this.element.querySelector('#loading');
    loading.style.display = state ? 'flex' : 'none';
  }

  /**
   * Hide loading indicator
   */
  hide() {
    this.show(false);
  }
}

export default Loading;
