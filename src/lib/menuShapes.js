import { PropTypes } from 'react'

/**
 * React shape object - used to animate menu open/close
 *
 * spring object spring={{ opened:100, closed:0, style: function(x) { return { height: `${x}%`} } }}
 */
export const springShape =  PropTypes.shape({
  style: PropTypes.func.isRequired,
  opened: PropTypes.number.isRequired,
  closed: PropTypes.number.isRequired
});


/**
 * React shape object - used to control toggel button looks and visibility
 *
 *
 *
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