React Navigation Bar
=========================

Can be used to create highly customizable navigation bar for your react project.

##Installation

```javascript
npm install --save react-nav-bar
```

###Usage and options:

```javascript
var reactNavBar = require('react-nav-bar');
var createMenus = reactNavBar.createMenus;
var NavBar = reactNavBar.NavBar;
var Menu = reactNavBar.Menu;

// Define your menu:
var menus = [
  { path:'menu1', label:'Menu 1', icon:'bell'},
  { path:'menu2', label:'Menu 2'},
  { path:'menu3', label:'Menu 3', icon:'bars', subMenus: [
    { path:'menu4', label:'Menu 4'},
    { path:'menu5', label:'Menu 5', subMenus: [
      { path:'menu6', label:'Menu 6' },
      { path:'menu7', label:'Menu 7'},
      { path:'menu8', label:'Menu 8'},
      { path:'menu9', label:'Menu 9'}
    ]},
    { path:'menu10', label:'Menu 10', icon:'bars'}
  ]}
]

// You can instantiate the menus your self
var location = react-router-location(this.props.location) // react-router location
var menus = [
  new Menu({ path:'menu1', label:'Menu 1', icon:'bell'}, location),
  new Menu({ path:'menu2', label:'Menu 2'}, location),
  new Menu({ path:'menu3', label:'Menu 3', icon:'bars', subMenus: [
    new Menu({ path:'menu4', label:'Menu 4'}, location),
    new Menu({ path:'menu5', label:'Menu 5', subMenus: [
      new Menu({ path:'menu6', label:'Menu 6'}, location),
      new Menu({ path:'menu7', label:'Menu 7'}, location),
      new Menu({ path:'menu8', label:'Menu 8'}, location),
      new Menu({ path:'menu9', label:'Menu 9'}, location)
    ]}, location),
    new Menu({ path:'menu10', label:'Menu 10', icon:'bars'}, location)
  ]}, location)
]


// or use createMenus to instantiate the menus automatically.
const menus = createMenus(this.state.menus, this.props.location);

// Then use NavBar to place the menus where you want.
<div className="menu">
  <NavBar menus={menus} theme={'hoverLakeBright'} />
</div>
```

##Options
NavBar and Menu have different options

###NavBar

 * menus {Array}  - An array of instantiated menus.
 * theme {String}  - Name of the theme you want to use.
 * spring {Object}  - An object with details on how menus will open E.G: `spring={{ opened:100, closed:0, style: function(x) { return { height: `${x}%`} } }}`
 * toggle {Object}  - An object that determines how will the toggle button look
 * openOnHover {Boolean}  - Determines if menus will open or close on hover(for mobiles false is recommended).

 toggle object example:
 ```javascript
    var toggle = {
      display:false,
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
 ```

###Menu

    * optionObject{Object}
    * -   path {String}  - route path as defined for the rout
    * -   label {String} - what will be the menu'ss text
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
    * location{Object} - react-router location object.


##Themes:
Using custom theme is very simple:

 * copy one of the included themes
 * change the selector team name to your new theme E.G: `.hoverLakeBright_isOpened` to ``.YouThemeName_isOpened`
 * set theme option to your theme name
 * include that file somewhere in your site

And your done.







