import React, { Component, PropTypes, createClass, createElement } from 'react';
import _ from 'lodash';
import { springShape, toggleShape } from './../../lib/menuShapes';
import { createClassName, isMenuObject, checkActive, isVisible, prepareMenus } from './../../lib/utils';
import { DEFAULT_NAME } from './../../lib/constants';
import Menu from './../menu/Menu';

import './../../lib/themes';

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    prepareMenus({ menus: this.props.menus, location: this.props.location });
  }

  renderMenus(menus, parentIndex, parent){
    return  menus.filter((menu) => isVisible( menu ) || !isMenuObject(menu) ).map((menu, index) => {

      // if this menu is a simple react component dont change it
      if( !isMenuObject(menu) ) {
        const menuComponent = createClass({ render() { return menu } });
        return createElement(menuComponent, { key: index });
      }

      if( !menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus) ){
        if( menu.active && parent) parent.active = true;
        return <Menu
          menu={menu}
          key={index}
          theme={this.props.theme}
          index={index}
          toggle={this.props.toggle}
          parentIndex={parentIndex || 0}
          openOnHover={this.props.openOnHover}
        />
      }
      let children = this.renderMenus(menu.subMenus, index);

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
      if(!parent) {
        _.forEach(menu.subMenus, (subMenu)=> {
          if( subMenu.active) {
            menu.active = true;
            return false;
          }
        });
      }

      return <Menu
        menu={menu}
        key={index}
        theme={this.props.theme}
        spring={ this.props.spring }
        toggle={this.props.toggle}
        index={index}
        parentIndex={parentIndex || 0}
        openOnHover={this.props.openOnHover}
      >
        {children}
      </Menu>;
    });
  }

  render() {
    let { menus, theme } = this.props;
    theme = theme || DEFAULT_NAME;
    const menusMarkup = this.renderMenus(menus);
    return (
      <ul className={ createClassName({ theme, classNames: 'nav-ul' })  }>{menusMarkup}</ul>
    );
  }
}

NavBar.propTypes = {
  location : PropTypes.object,
  // array of all menus
  theme: PropTypes.string,
  menus: PropTypes.array,
  spring: springShape,
  toggle: PropTypes.oneOfType([
    toggleShape,
    PropTypes.bool
  ]),
  openOnHover: PropTypes.bool
};