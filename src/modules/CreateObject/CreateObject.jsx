import React from 'react';
import Proptypes from 'prop-types';
import Creator from '../Creator/Creator';

import TypeState from '../../state/TypeState';

// scss
import './ConstructObject.scss';

/**
 * Flow ---
 * 1. user select which type they want to create an instance of
 *
 * 2. grab type definition and loop through children
 *
 * 3. if child typePrimary is anything other than a list, object, or module,
 *    grab the appropriate input box and display it
 *
 * 4. if child typePrimary is an object, or module, make another CreateObject
 *    instance and display those input fields tabbed over a little bit
 *
 * 5. if child typePrimary is a list, show an 'add' button that either displays
 *    a simple input field like those mentioned above but defined in the typeSecondary,
 *    or creates another CreateObject instance of whatever type is specified
 *    in the typeSecondary
 *
 * ** Note **
 * This is a recursively defined class, so be wary of infinite recursion.
 */

export default class CreateObject extends Creator {
  constructor(props) {
    super(props);

    this.state = {
      ...super.state,
    }
  }

  getFields() {

  }

  render() {
    const fields = this.getFields();
    return (
      <div className="construct-object">
        {fields}
      </div>
    );
  }
}

CreateObject.propTypes = {
  type: Proptypes.object,
  objectInstance: PropTypes.object,
};
