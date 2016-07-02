import _ from 'lodash';
import { browserHistory } from 'react-router';
import { getLast } from './utils';

export default class Menu {

  /**
   *
   * @param {Object} optionsObject{
   *  @param {String} path - route path as defined for the rout
   *  @param {String} label - what will be the menu's text
   *  @param {Boolean|Function|Undefined|String} active -
   *    - If String or Undefined  will be check if that string is in pathname to determine if is active.
   *    - If Boolean will do nothing and use the given value.
   *    - If Function will invoke the function and assign the returned value to active.
   *  @param {Function} action - Will get invoked when a menu item is clicked
   *  @param {Boolean} opened - Flag to indicate if submenu is opened or closed.
   *  @param {Function|Boolean} permission -
   *    - If Function Will invoke the function and assign the returned value to visible
   *    - If Boolean will be assigned to visible
   *  @param {Array}subMenus - an array of submenus with the same signature.
   *  @param {String}className - class name to be used for that menu
   *  @param {String}icon - specify an icon for menu.
   * }
   *
   * @param {Object}location - react-router location object.
   */
  constructor({ path, label = path, active, action, opened = false, permission = true, subMenus = [], className = '', icon = false }, location) {
    if ( typeof arguments[0] !== 'object' ) throw new Error('First parameter has to be an options object');
    if ( !location ) throw new Error('Second parameter must be location object');
    if ( !path ) throw new Error(' Menu path is required');
    Object.assign(this, { path, label, active, action, opened, permission, subMenus, className, icon });

    /**
     * Used to determine if this menu shows up in the menus.
     *
     * @type {boolean}
     */
    this.visible = false;

    this.checkPermission();
    this.checkActive(location);
  }

  /**
   * Check if menu is active
   * @param {Object} location
   */
  checkActive(location){
    switch( typeof this.active ) {
      case 'boolean':
        break;
      case 'function':
        this.active = this.active();
        break;
      case 'undefined' || 'string':
        let pathname = location.pathname ? location.pathname.split('/') : [] ;
        console.log('pathname', pathname);
        console.log('this.path', this.path);
        const path = (this.active || this.path).split('/');
        this.active =  getLast(path) === getLast(pathname); //pathname.indexOf(getLast(path)) > -1;
        break;
    }
  }

  /**
   * check permission and set visible accordingly.
   */
  checkPermission(){
    this.visible =  (typeof this.permission === 'function') ? this.permission() : this.permission;
  }

}