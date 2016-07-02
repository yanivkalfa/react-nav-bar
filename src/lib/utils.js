import React, { PropTypes } from 'react'
import Menu from './menu'
import _ from 'lodash';

export function isSpringObj(spring){
  return spring && _.isEmpty(spring.opened) && _.isEmpty(spring.closed) &&  spring.style && _.isFunction(spring.style)
}

export function createClassName(theme, classNames){
  classNames = _.isArray(classNames) ? classNames : [classNames];
  return classNames.filter((className) => !!className ).map((className) => {
    return `${theme}_${className}`;
  }).join(' ');
}

export function isMenuObject(componenet){
  return ( componenet instanceof  Menu || (typeof componenet === 'object' && componenet.path))
}

export function getLast(path ){
  const last = _.last(path);
  if (last) return last;

  const index = path.length - 1;
  if( index >= 0) {
   return path[index];
  }
}