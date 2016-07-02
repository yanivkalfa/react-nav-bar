import Menu from './menu';
import _ from 'lodash';
import { isMenuObject } from './utils';

/**
 * Takes an array of menus and location and return a nested array of instantiated Menu
 *
 * @param {Array}menus - array of object literal of menus
 * @param {Object}location - react-router location object.
 */
function createMenus(menus = [], location) {
  menus = _.cloneDeep(menus);
  return menus.map((menu)=> {

    // if this menu is a simple react component dont change it
    if(!isMenuObject(menu)) return menu;

    if(!menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus)){
      return new Menu(menu, location);
    }

    menu.subMenus = createMenus(menu.subMenus, location);
    return new Menu(menu, location);
  });
}

export default createMenus;