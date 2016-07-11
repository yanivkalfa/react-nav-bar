import React, { Component, PropTypes, createClass, createElement } from 'react';
import _ from 'lodash';
import { springShape, toggleShape } from './../../lib/menuShapes';
import { createClassName, isMenuObject, checkActive } from './../../lib/utils';
import { DEFAULT_NAME } from './../../lib/constants';
import Menu from './../menu/Menu';

import './../../lib/themes';

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menus: this.prepareMenus({
        menus: this.props.menus,
        location: this.props.location
      })
    };
  }

  /**
   * checking which menu is active
   *
   * @param {Array} menus
   * @param {Object} location
   * @returns {*}
   */
  prepareMenus({ menus, location }) {
    return menus.map( menu => {
      const isActive = isMenuObject( menu ) ? checkActive( { menu, location } ) : undefined;
      const subMenus = !_.isEmpty( menu.subMenus ) ? this.prepareMenus( { menus: menu.subMenus, location } ) : undefined;

      return Object.assign( {}, menu,
        isActive && { active: isActive },
        subMenus && { subMenus }
      );
    });
  }

  renderMenus(menus, parentIndex, parent){
    return  menus.map((menu, index) => {

      // if this menu is a simple react component dont change it
      if( !isMenuObject(menu) ) {
        const menuComponent = createClass({ render() { return menu } });
        return createElement(menuComponent, { key: index });
      }

      if( _.isEmpty( menu.subMenus ) ){
        if( menu.active && parent) parent.active = true;

        return createElement(Menu,
          Object.assign(
            {
              opened: false,
              permission: true,
              visible: false,
              subMenus: []
            },
            {
              key: index,
              theme: this.props.theme,
              index,
              toggle: this.props.toggle,
              parentIndex: ( parentIndex || 0 ),
              openOnHover: this.props.openOnHover
            },
            menu
          )
        );
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
      return createElement(Menu,
        Object.assign(
          {
            opened: false,
            permission: true,
            visible: false,
            subMenus: []
          },
          {
            key: index,
            theme: this.props.theme,
            spring: this.props.spring,
            toggle: this.props.toggle,
            index,
            parentIndex: ( parentIndex || 0 ),
            openOnHover: this.props.openOnHover
          },
          menu
        ),
        children
      );
    });
  }

  componentWillReceiveProps(props){
    if ( props.menus ) {
      this.setState({ menus: this.prepareMenus({ menus: props.menus, location: props.location }) });
    }
  }

  render() {
    let { theme } = this.props;
    theme = theme || DEFAULT_NAME;
    const menusMarkup = this.renderMenus(this.state.menus);
    return (
      <ul className={ createClassName({ theme, classNames: 'nav-ul' })  }>{menusMarkup}</ul>
    );
  }
}

NavBar.propTypes = {
  location : PropTypes.object.isRequired,
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