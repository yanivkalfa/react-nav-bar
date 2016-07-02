import Menu from './menu';
import _ from 'lodash';
import { isMenuObject } from './utils';

/**
 * Takes an array of menus and location and return a nested array of instantiated Menu
 *
 * @param {Array}menus - array of object literal of menus
 * @param {Object}location - react-router location object.
 * @param {Object}parent - parent menu.
 */
function createMenus(menus = [], location, parent) {
  menus = _.cloneDeep(menus);
  return menus.map((menu)=> {

    // if this menu is a simple react component dont change it
    if(!isMenuObject(menu)) return menu;

    // has no submenus so creating menu and setting parent active if i am active.
    if(!menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus)){
      let newMenu = new Menu(menu, location);
      //if( newMenu.active && parent) parent.active = true;
      return newMenu;
    }

    menu.subMenus = createMenus(menu.subMenus, location, menu);

    /**
     * because top parent doesnt know if a children of a children is active we check the top parent children
     * in case of
     *
     * { paren, submenus: [
     *  {child},
     *  {child, submenuds:[
     *    {child} ---------------- if this menu is active top parent wont know about it until recursion is over
     *  ]},
     *
     * ]}
     *
     */
    /*
    if(!parent) {
      _.forEach(menu.subMenus, (subMenu)=> {
        if( subMenu.active) {
          menu.active = true;
          return false;
        }
      });
    }*/

    return new Menu(menu, location);
  });
}

export default createMenus;