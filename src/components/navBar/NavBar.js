import React, { Component, PropTypes, createClass, createElement } from 'react';
import _ from 'lodash';
import { springShape, toggleShape } from './../../lib/menuShapes';
import { createClassName, isMenuObject, checkActive, prepareMenu } from './../../lib/utils';
import { DEFAULT_NAME } from './../../lib/constants';
import Menu from './../menu/Menu';

import './../../lib/themes';

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = { menus: _.cloneDeep(this.prepareMenus({ menus: this.props.menus, location: this.props.location })) };
    console.log('this.state.menus', this.state.menus);
  }

  prepareMenus({ menus, location }) {
    return menus.map((menu)=> {

      if( !isMenuObject(menu) ) return menu;

      if(!menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus)){
        menu.active = checkActive({ menu, location });
        return menu;
      }

      this.prepareMenus({ menus: menu.subMenus, location });
      menu.active = checkActive({ menu, location });
      return menu;
    });
  }

  renderMenus(menus, parentIndex, parent){
    menus = _.cloneDeep(menus);
    return  menus.map((menu, index) => {

      // if this menu is a simple react component dont change it
      if( !isMenuObject(menu) ) {
        const menuComponent = createClass({ render() { return menu } });
        return createElement(menuComponent, { key: index });
      }

      if( !menu.subMenus || !menu.subMenus.length || !_.isArray(menu.subMenus) ){
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
    console.log('component receive props ', props);
    if ( props.menus ) {
      console.log('prop.menus is set going in.');
      this.setState({ menus: _.cloneDeep(this.prepareMenus({ menus: props.menus, location: props.location })) });
      console.log('this.state.menus', this.state.menus);
    }
  }

  render() {
    console.log('in render');
    let { theme } = this.props;
    theme = theme || DEFAULT_NAME;
    const menusMarkup = this.renderMenus(this.state.menus);
    console.log('menusMarkup', menusMarkup);
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

/*

<Menu
  menu={menu}
  key={index}
  theme={this.props.theme}
  index={index}
  toggle={this.props.toggle}
  parentIndex={parentIndex || 0}
  openOnHover={this.props.openOnHover}
/>


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
*/