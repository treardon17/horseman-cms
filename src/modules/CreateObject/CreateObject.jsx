// Helpers
import React from 'react';
import Proptypes from 'prop-types';
import Creator from '../Creator/Creator';
import _ from 'lodash';

// State
import DataState from '../../state/DataState';
import TypeState from '../../state/TypeState';

// Definitions
import ObjectType from '../../../core/definitions/objectType';

// Modules
import CreateObjectField from '../CreateObjectField/CreateObjectField';

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
      current: this.props.childObject,
    };
  }

  handleFieldChange(event, nestedIDs) {
    this.saveStateIfNeeded();
    const newVal = this.nestedObject({ object: this.state.current, idArray: nestedIDs, newVal: event.target.value });
    this.setState({ current: newVal });
  }

  nestedObject({ object, idArray, newVal = null }) {
    let value = _.cloneDeep(object);
    for (let i = 0; i < idArray.length; i++) {
      const id = idArray[i];
      if ((newVal || newVal === '') && i === idArray.length - 1) {
        value[id] = newVal;
      } else {
        // Get the next nested value
        value = value[id];
      }
    }
    return value;
  }

  getObjectFields(childObject, nestedWithin = []) {
    const { _typeID, _id } = childObject;
    const type = TypeState.userMadeTypes.get(_typeID);
    const fields = [];
    const keys = Object.keys(type.children);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = type.get(key);
      const childVal = childObject[child.slug];
      const guid = `${ObjectType.types.string}-${_id}-${i}`;
      const nestedIDs = [];
      nestedIDs.concat(nestedWithin);
      nestedIDs.push(child.slug);

      if (child.typePrimary === ObjectType.types.module) {
        // We need to be able to recursively call subtypes here
        fields.concat(this.getObjectFields(childVal, nestedIDs));
      } else if (child.typePrimary === ObjectType.types.string) {
        fields.push(
          <CreateObjectField title={child.name} type={ObjectType.types.string} key={guid}>
            <input value={this.nestedObject({ object: this.state.current, idArray: nestedIDs })} onChange={(e) => { this.handleFieldChange(e, nestedIDs); }} data-type={ObjectType.types.string} />
          </CreateObjectField>
        );
      } else if (child.typePrimary === ObjectType.types.number) {
        fields.push(
          <CreateObjectField title={child.name} type={ObjectType.types.number} key={guid}>
            <input key={guid} value={this.nestedObject({ object: this.state.current, idArray: nestedIDs })} onChange={(e) => { this.handleFieldChange(e, nestedIDs); }} data-type={ObjectType.types.number} />
          </CreateObjectField>
        );
      }
    }
    return fields;
  }

  render() {
    const fields = this.getObjectFields(this.props.childObject);
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
