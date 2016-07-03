import React, { PropTypes } from 'react'
import _ from 'lodash';

export function isSpringObj(spring){
  return spring && _.isEmpty(spring.opened) && _.isEmpty(spring.closed) &&  spring.style && _.isFunction(spring.style)
}

export function createClassName({ theme, classNames }){
  classNames = _.isArray(classNames) ? classNames : [classNames];
  return classNames.filter((className) => !!className ).map((className) => {
    return `${theme}_${className}`;
  }).join(' ');
}

export function isMenuObject(componenet){
  return typeof componenet === 'object' && componenet.path
}

/**
 * Check if menu is active
 * @param {Object} menu
 * @param {Object} location
 */
export function checkActive({ menu, location }){
  switch( typeof menu.active ) {
    case 'boolean':
      return menu.active;
      break;
    case 'function':
      return menu.active();
      break;
    case 'undefined' || 'string':
      const path = menu.active || menu.path;
      return location.pathname == path;
      break;
  }
}

/**
 * check permission and set visible accordingly.
 */
export function isVisible(menu){
  return (typeof menu.permission === 'function') ? menu.permission() : menu.permission;
}

export function prepareMenus({ menus, location }) {
  return menus.map((menu)=> {

    if(!isMenuObject(menu)) return menu;

    if(!menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus)){
      menu.active = checkActive({ menu, location });
      return menu;
    }

    prepareMenus({ menus, location });
    menu.active = checkActive({ menu, location });
    return menu;
  });
}