import React, { Component, PropTypes, createClass, createElement } from 'react';
import { springShape, toggleShape } from './../../lib/menuShapes';
import { createClassName, isMenuObject } from './../../lib/utils';
import { DEFAULT_NAME } from './../../lib/constants';
import Menu from './../menu/Menu';

import './../../lib/themes';

export default class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  renderMenus(menus, parentIndex){
    return  menus.filter((menu) => menu.visible || !isMenuObject(menu)).map((menu, index) => {

      // if this menu is a simple react component dont change it
      if(!isMenuObject(menu)) {
        const menuComponent = createClass({ render() { return menu } });
        console.log(menuComponent);
        return createElement(menuComponent, { key: index });

      }

      if(!menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus)){
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
      <ul className={ createClassName(theme, 'nav-ul') }>{menusMarkup}</ul>
    );
  }
}

NavBar.propTypes = {
  // array of all menus
  theme: PropTypes.string,
  menus: PropTypes.array,
  spring: springShape,
  toggle: PropTypes.oneOfType([
    toggleShape,
    React.PropTypes.bool
  ]),
  openOnHover: PropTypes.bool
};