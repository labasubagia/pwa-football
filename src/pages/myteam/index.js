import Handlebars, { compile } from 'handlebars';
import detectIt from 'detect-it';
import { Collapsible, toast } from 'materialize-css';
import { localDate, localTime, safeUrl } from '../../script/util';
import { read, remove } from '../../script/db';
import myTeamTemplate from './index.hbs';
import {
  DB_OBJECT_STORE_NAME,
  PAGE_INFO_IMG_EMPTY,
  PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD,
  APP_CONTAINER_SELECTOR,
} from '../../script/const';
import { refreshAppContent } from '../../index';
import './index.scss';

// Local log
const LOG_LABEL = '[MyTeam Page]';

/**
 * Get favorite team
 */
const getMyTeam = async () => {
  const teams = await read({ objectStore: DB_OBJECT_STORE_NAME });
  return teams.length ? teams[0] : null;
};

/**
 * Unselect favorite team
 * @param {Int} keyPath
 */
const unSelectMyTeam = async (keyPath) => {
  try {
    await remove({ objectStore: DB_OBJECT_STORE_NAME, keyPath });
    refreshAppContent();
    toast({ html: 'Unselect team succeed' });
  } catch (error) {
    toast({ html: 'Unselect team failed' });
    console.error(`${LOG_LABEL} Unselect failed ${error.message}`);
  }
};

/**
 * Init
 * @param {Object} team
 */
const init = async (team) => {
  // Init collapsible
  const elements = document.querySelectorAll('.collapsible');
  Collapsible.init(elements);

  // Unset action
  const btnUnset = document.querySelector('#btnUnset');
  btnUnset.addEventListener(
    'click',
    () => {
      unSelectMyTeam(team.id);
    },
    detectIt.passiveEvents ? { passive: true } : false,
  );
};

/**
 * MyTeam component
 * @param {String} appSelector parent element selector
 */
const MyTeam = async (appSelector = APP_CONTAINER_SELECTOR) => {
  try {
    // Get parent element
    const element = document.querySelector(appSelector);

    // Handlebars Helpers
    [
      { name: 'localDate', method: localDate },
      { name: 'localTime', method: localTime },
      { name: 'safeUrl', method: safeUrl },
    ].forEach(({ name, method }) => Handlebars.registerHelper(name, method));

    // Get data
    const team = await getMyTeam();

    // Compile template
    // Team not exist
    if (!team) {
      // Info callback
      const callback = () => {
        window.location.hash = '#/';
      };

      // Empty Info
      const { Info } = await import(/* webpackChunkName: "info" */ '../info');
      await Info({
        appSelector,
        image: PAGE_INFO_IMG_EMPTY,
        title: 'Favorite Empty',
        message: 'Please select a team from standing page',
        actionText: 'Go to standing page',
        callback,
      });
    }
    // Team exist
    else {
      const squadPositionColor = {
        Goalkeeper: 'orange',
        Defender: 'blue',
        Midfielder: 'green',
        Attacker: 'red',
      };

      const squadPositionShortName = {
        Goalkeeper: 'GK',
        Defender: 'DF',
        Midfielder: 'MF',
        Attacker: 'FW',
      };

      // Modify squad member value to customize UI
      team.squad = team.squad.map((member) => ({
        ...member,
        role: String(member.role).split('_').join(' ').toLowerCase(),
        positionColor: squadPositionColor[member.position] || 'purple',
        positionShortName: squadPositionShortName[member.position] || 'COACH',
        age:
          new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear(),
      }));

      // Team page
      element.innerHTML = compile(myTeamTemplate)({ team });

      // Manipulate DOM in init
      init(team);
    }
  } catch (error) {
    // Unknown error
    const { Info } = await import(/* webpackChunkName: "info" */ '../info');
    await Info({
      appSelector,
      title: 'Something Wrong',
      message: 'Please check this page later',
      actionText: `Or ${PAGE_INFO_CONTENT_ACTION_TEXT_RELOAD}`,
      callback: refreshAppContent,
    });

    console.error(`${LOG_LABEL} ${error}`);
  }
};

export default MyTeam;
