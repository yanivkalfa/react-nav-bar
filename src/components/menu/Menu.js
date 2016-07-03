import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Link, IndexLink } from 'react-router';
import FontAwesome from 'react-fontawesome';
import { Motion, spring } from 'react-motion';
import { isSpringObj, createClassName } from './../../lib/utils';
import { DEFAULT_NAME } from './../../lib/constants';
import { springShape, toggleShape, menu } from './../../lib/menuShapes';

export default class Menu extends Component {
  constructor(props) {
    super(props);

    console.log('this.props.menu.path', this.props.menu.path);
    this.state = Object.assign({
      theme: this.props.theme || DEFAULT_NAME,
      opened: this.props.menu.opened,
      openOnHover: typeof this.props.openOnHover === 'boolean'
        ? this.props.openOnHover
        : true
    });

    this.isVisible(this.props.menu);
  }

  isVisible(menu){
    let visible = typeof menu.permission === 'function' ? menu.permission() : menu.permission;
    console.log('visible',visible);
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
    const { menu } = this.props;
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
    const { menu } = this.props;
    const { theme } = this.state;
    return (menu.icon)
      ? <FontAwesome className={ createClassName({ theme, classNames: 'menu-icon' })  } name={menu.icon} />
      : false;
  }

  renderLabel(){
    const { menu } = this.props;
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
    const { menu } = this.props;

    if (! menu.visible ) return false;

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
  menu,
  spring: springShape,
  toggle: PropTypes.oneOfType([
    toggleShape,
    React.PropTypes.bool
  ]),
  index: PropTypes.number,
  parentIndex: PropTypes.number,
  openOnHover: PropTypes.bool
};