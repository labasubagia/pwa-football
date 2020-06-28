import myTeamTemplate from './index.hbs';
import Info from '../info';
import { compile } from 'handlebars';
import { read } from '../../script/db';
import { 
  DB_OBJECT_STORE_NAME, 
  PAGE_INFO_IMG_EMPTY, 
  PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD 
} from '../../script/const';
import { refreshAppContent } from '../../index'
import './index.scss';

// Local log
const LOG_LABEL = '[MyTeam Page]';

/**
 * MyTeam component
 * @param {Element} element 
 */
const MyTeam = async (element) => {
  try {

    // Get data
    const team = await getMyTeam(); 

    // Compile template
    // Team not exist
    if (!team) {
      
      // Info callback
      const callback = () => {
        location.hash = '#/';
      }
  
      // Empty Info
      await Info({
        element, 
        image: PAGE_INFO_IMG_EMPTY, 
        title: 'Favorite Empty', 
        message: 'Please select a team from standing page', 
        actionText: 'Go to standing page', 
        callback,
      });

    } 
    // Team exist
    else {

      // Team page
      element.innerHTML = compile(myTeamTemplate)({ team });

      // Manipulate DOM in init
      init(team);
    }

  } catch (error) {

    // Unknown error
    await Info({
      element,  
      title: 'Something Wrong', 
      message: 'Please check this page later', 
      actionText: `Or ${PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD}`, 
      callback: refreshAppContent,
    });

    console.error(`${LOG_LABEL} Cannot load page ${error}`);
  }
}

/**
 * Get favorite team
 */
const getMyTeam = async () => {
  const teams = await read({ objecrStore: DB_OBJECT_STORE_NAME });
  return teams[0];
} 


/**
 * Init
 * @param {Object} team
 */
const init = (team) => {

}

export default MyTeam;