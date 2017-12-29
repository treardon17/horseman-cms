import React from 'react';
import Proptypes from 'prop-types';
import Creator from '../Creator/Creator';

import DataState from '../../state/DataState';
import TypeState from '../../state/TypeState';

import ObjectType from '../../../core/definitions/objectType';

// scss
import './CreateObject.scss';

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
    };
  }

  getFields() {
    const fields = [];
    const childObject = this.props.childObject;
    if (childObject) {
      const { _typeID, _id } = childObject;
      const type = TypeState.userMadeTypes.get(_typeID);
      const keys = Object.keys(type.children);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const child = type.get(key);
        const childVal = childObject[child.slug];

        if (child.typePrimary === ObjectType.types.module) {
          // We need to be able to recursively call subtypes here
          const field = (<CreateObject key={`construct-object-${_id}-${i}`} childObject={childVal} keyIndex={i} />);
          fields.push(field);
        } else if (child.typePrimary === ObjectType.types.string) {
          fields.push(<input key={`${ObjectType.types.string}-${_id}`} value={childVal} data-type={ObjectType.types.string} />);
        } else if (child.typePrimary === ObjectType.types.number) {
          fields.push(<input key={`${ObjectType.types.number}-${_id}`} value={childVal} data-type={ObjectType.types.number} />);
        }
      }
    }
    return fields;
  }

  render() {
    const fields = this.getFields();
    return (
      <div className="create-object">
        {fields}
      </div>
    );
  }
}

CreateObject.propTypes = {
  childObject: Proptypes.object,
  keyIndex: Proptypes.number,
};
