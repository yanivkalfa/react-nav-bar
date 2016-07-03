import { PropTypes } from 'react'

// spring object spring={{ opened:100, closed:0, style: function(x) { return { height: `${x}%`} } }}
export const springShape =  PropTypes.shape({
  style: PropTypes.func.isRequired,
  opened: PropTypes.number.isRequired,
  closed: PropTypes.number.isRequired
});

/*
var toggle = {
  default:'pied-piper',
  parent: {
    opened: 'bars',
    closed: 'pied-piper'
  },
  child: {
    opened: 'bus',
    closed: 'coffee'
  },
};
*/
export const toggleShape =  PropTypes.shape({
  display: PropTypes.bool,
  default: PropTypes.string,
  parent:PropTypes.shape({
    opened: PropTypes.string,
    closed: PropTypes.string
  }),
  child: PropTypes.shape({
    opened: PropTypes.string,
    closed: PropTypes.string
  })
});

/**
 *
 * -   path {String} - required  - route to redirect on click.
 * -   label {String|component} - what will be the menu's text Or component instead.
 * -   active {Boolean|Function|Undefined|String} - Determines if the menu is active currently.
 *       - If String or Undefined will check if that string is in pathname to determine if is active.
 *       - If Boolean will do nothing and use the given value.
 *       - If Function will invoke the function and assign the returned value to active.
 * -   action {Function} - Will get invoked when a menu item is clicked and prevent default
 * -   opened {Boolean} - Flag to indicate if submenu is opened or closed.
 * -   permission {Function|Boolean} - determines whether or not to show this menu - can be use for access control.
 *       - If Function Will invoke the function and assign the returned value to visible
 *       - If Boolean will be assigned to visible
 * -   subMenus {Array} - an array of submenus with the same signature.
 * -   className {String} - class name to be used for that menu(in the li)
 * -   icon {String} - specify an icon for menu.
 */
export const menu =  PropTypes.shape({
  path: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ]),
  active: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func,
    PropTypes.string
  ]),
  action: PropTypes.func,
  opened: PropTypes.bool,
  permission: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.func
  ]),
  subMenus: PropTypes.array,
  className: PropTypes.string,
  icon: PropTypes.string
});