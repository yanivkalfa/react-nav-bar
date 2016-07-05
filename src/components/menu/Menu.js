import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import FontAwesome from 'react-fontawesome';
import { Motion, spring } from 'react-motion';
import { isSpringObj, createClassName } from './../../lib/utils';
import { DEFAULT_NAME } from './../../lib/constants';
import { springShape, toggleShape } from './../../lib/menuShapes';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: this.props.theme || DEFAULT_NAME,
      opened: this.props.opened,
      openOnHover: typeof this.props.openOnHover === 'boolean'
        ? this.props.openOnHover
        : true,
      visible: this.isVisible(this.props.permission) || true
    };

  }

  isVisible(permission){
    let visible = typeof permission === 'function' ? permission() : permission;
    return visible;
  }

  toggleMenu(opened){
    this.setState({
      opened: typeof opened!== 'undefined' ? opened : !this.state.opened
    });
  }

  renderContentWithSpring(contentClassName){
    const { theme } = this.state;
    let springOpts = this.props.spring;

    return (
      <Motion style={{x: spring(this.state.opened ? springOpts.opened :  springOpts.closed) }}>
        {({x}) =>
          <div className={contentClassName + ( !this.state.opened && springOpts.closed == x ? ' '+ createClassName({ theme, classNames: 'isClosed' })  : ' '+ createClassName({ theme, classNames: 'isOpened' }) )} style={springOpts.style(x)}>
            <ul className={ createClassName({ theme, classNames: 'nav-ul' })  }>
              {this.props.children}
            </ul>
          </div>
        }
      </Motion>
    );
  }

  renderContentWithoutSpring(contentClassName){
    const { theme } = this.state;

    return (
      <div className={contentClassName + ( this.state.opened ? ' '+ createClassName({ theme, classNames: 'isOpened' })  : ' '+ createClassName({ theme, classNames: 'isClosed' }) )}>
        <ul className={ createClassName({ theme, classNames: 'nav-ul' })  }>
          {this.props.children}
        </ul>
      </div>
    );
  }

  onMenuClick(event, fn){
    if( !_.isFunction(fn)) return;
    event.preventDefault();
    return fn.call(this,event);
  }

  prepareForRender(){
    const menu = this.props;
    const { theme } = this.state;

    let chevron, liClassName, labelClassName, contentClassName, displayToggle = true,
      toggleParent = {}, toggleChild = {}, toggleDefault, active;

    const { parentIndex, index, toggle} = this.props;

    if ( typeof toggle === 'object') {
      displayToggle = (typeof toggle.display === 'boolean') ? toggle.display : true;
      toggleParent = toggle.parent || {};
      toggleChild = toggle.child || {};
      toggleDefault = toggle.default;
    }

    if ( typeof toggle === 'boolean') {
      displayToggle = toggle;
    }

    active = menu.active ? 'active' : '';

    // if has parent index - this is a child menu
    if (parentIndex) {
      labelClassName = createClassName({ theme, classNames: [ 'nav-label', 'label-child', active ] }) ;
      contentClassName = createClassName({ theme, classNames: [ 'nav-content', 'content-child'] }) ;
      liClassName = createClassName({ theme, classNames: [ 'nav-li', 'child-li' ] }) ;
      chevron = this.state.opened
        ? toggleChild.opened || toggleDefault || 'chevron-right'
        : toggleChild.closed || toggleDefault || 'chevron-left';
    } else {
      labelClassName = createClassName({ theme, classNames: [ 'nav-label', 'label-parent', active ] }) ;
      contentClassName = createClassName({ theme, classNames: [ 'nav-content' ] }) ;
      liClassName = createClassName({ theme, classNames: [ 'nav-li', 'parent-li' ] }) ;
      chevron = this.state.opened
        ? toggleParent.opened || toggleDefault || 'chevron-down'
        : toggleParent.closed || toggleDefault || 'chevron-up';
    }

    return { displayToggle, labelClassName, contentClassName, liClassName, chevron, active };
  }

  renderMenuIcon(){
    const menu = this.props;
    const { theme } = this.state;
    return (menu.icon)
      ? <FontAwesome className={ createClassName({ theme, classNames: 'menu-icon' })  } name={menu.icon} />
      : false;
  }

  renderLabel(){
    const menu = this.props;
    return ( _.isFunction(menu.label) || _.isObject(menu.label))
      ? menu.label
      : <Link to={menu.path} onClick={(e) =>{ this.onMenuClick(e, menu.action) }}>{menu.label}</Link>;
  }

  renderToggleButton({ displayToggle, chevron }){
    const { theme } = this.state;
    return (displayToggle)
      ? <FontAwesome className={ createClassName({ theme, classNames: 'toggle-button' })  } name={chevron} onClick={ ()=>{ this.toggleMenu() } }/>
      : false;
  }

  render() {
    const menu = this.props;

    if ( !this.state.visible ) return false;

    const { theme, openOnHover } = this.state;
    const { displayToggle, labelClassName, contentClassName, liClassName, chevron, active } = this.prepareForRender();

    if(this.props.children) {
      let springOpts = this.props.spring;

      return (
        <li className={liClassName + ' '+ menu.className + ( this.state.opened ? ' '+ createClassName({ theme, classNames: 'isOpened' })  : '') }
            onMouseEnter={ ()=> { if ( openOnHover )  this.toggleMenu(true) } }
            onMouseLeave={ ()=> { if ( openOnHover )  this.toggleMenu(false) } }>
          <div className={labelClassName}>
            { this.renderMenuIcon() }
            { this.renderLabel() }
            { this.renderToggleButton({ displayToggle, chevron })}
          </div>
          {
            (isSpringObj(springOpts))
              ? this.renderContentWithSpring(contentClassName)
              : this.renderContentWithoutSpring(contentClassName)
          }
        </li>
      );
    }

    return (
      <li className={liClassName + ' '+ menu.className}>
        <div className={createClassName({ theme, classNames: [ 'nav-label', active ] }) }>
          { this.renderMenuIcon() }
          { this.renderLabel() }
        </div>
      </li>
    );
  }
}

Menu.propTypes = {
  spring: springShape,
  toggle: PropTypes.oneOfType([
    toggleShape,
    React.PropTypes.bool
  ]),
  index: PropTypes.number,
  parentIndex: PropTypes.number,
  openOnHover: PropTypes.bool,


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
};