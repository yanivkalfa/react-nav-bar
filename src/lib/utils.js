import React, { PropTypes } from 'react'
import _ from 'lodash';

/**
 * Create class names by using tame name and classes array or menu
 *
 * @param {String} theme
 * @param {Array|String} classNames
 * @returns {string|*}
 */
export function createClassName({ theme, classNames }) {
  classNames = _.isArray(classNames) ? classNames : [classNames];
  return classNames.filter((className) => !!className ).map((className) => {
    return `${theme}_${className}`;
  }).join(' ');
}

/**
 * check if its a normal menu object by checking for path.
 * @param {Object} component
 * @returns {boolean|*}
 */
export function isMenuObject(component) {
  return typeof component === 'object' && component.path
}

/**
 * Check if menu is active
 * @param {Object} menu
 * @param {Object} location
 */
export function checkActive({ menu, location }) {
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