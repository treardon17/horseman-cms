// Helpers
import React from 'react';
import Proptypes from 'prop-types';
import Creator from '../Creator/Creator';
import Button from 'material-ui/Button';
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
    const objectTree = this.buildObjectTree(this.props.childObject);
    console.log('object tree is:', objectTree);

    this.state = {
      ...super.state,
      current: objectTree,
    };
  }

  handleFieldChange(event, nestedIDs) {
    this.saveStateIfNeeded();
    const nestedIDsCopy = nestedIDs.slice();
    let newVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal: event.target.value });
    // If an object within the main object was changed
    // we want to only replace that part
    if (nestedIDs && nestedIDsCopy.length > 1) {
      nestedIDsCopy.pop();
      newVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal });
    }
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

  buildObjectTree(childObject) {
    const childObjectCopy = childObject;
    const { _typeID, _id } = childObject;
    const type = TypeState.userMadeTypes.get(_typeID);
    const fields = [];
    const keys = Object.keys(type.children);
    // Walk through all the children of the type
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = type.get(key);
      let childVal = childObject[child.slug];
      // If we have a module, we need to validate the type
      if (child.typePrimary === ObjectType.types.module) {
        // Get the module type and create an instance of it
        const childType = TypeState.userMadeTypes.get(child.typeSecondary);
        const newChildVal = childType.createObjectInstance();
        // If our current object doesn't have an instance of the child module yet
        if (!childVal) {
          childVal = newChildVal;
        } else {
          // Otherwise we already have an instance of the module
          // so we validate the object to match the current schema
          // and then add any new items to the object that must be
          childVal = childType.updateExistingObjectSchema({ object: childVal });
          childVal = Object.assign(newChildVal, childVal);
        }
        childVal = this.buildObjectTree(childVal);
        childObjectCopy[child.slug] = childVal;
      }
    }
    return childObjectCopy;
  }

  addListItem() {
    console.log('adding list item');
  }

  getObjectFields(childObject, nestedWithin = []) {
    const { _typeID, _id } = childObject;
    const type = TypeState.userMadeTypes.get(_typeID);
    const fields = [];
    const keys = Object.keys(type.children);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const child = type.get(key);
      const guid = `${_id}-${i}`;
      const nestedIDs = nestedWithin.slice();
      const childVal = childObject[child.slug];
      nestedIDs.push(child.slug);

      if (child.typePrimary === ObjectType.types.module) {
        // MODULE
        // We need to be able to recursively call subtypes here
        fields.push(
          <div className="submodule-container" key={guid}>
            <h3>{child.name}</h3>
            {this.getObjectFields(childVal, nestedIDs)}
          </div>
        );
      } else if (child.typePrimary === ObjectType.types.list) {
        // LIST
        // For every item in the list, we want to have an input
        const listItems = [];
        for (let listIndex = 0; listIndex < childVal.length; listIndex++) {
          listItems.push(
            <div className="list-item" key={`list-item-${listIndex}`}>
              {this.getObjectFields(childVal[listIndex])}
            </div>
          );
        }
        // Add each list item section to the fields
        fields.push(
          <CreateObjectField title={child.name} type={ObjectType.types.list} key={guid}>
            <div className="list-container">
              {listItems}
              <Button key onClick={this.addListItem.bind(this)}>Add item</Button>
            </div>
          </CreateObjectField>
        );
      } else if (child.typePrimary === ObjectType.types.string) {
        // STRING
        fields.push(
          <CreateObjectField title={child.name} type={ObjectType.types.string} key={guid}>
            <input value={this.nestedObject({ object: this.state.current, idArray: nestedIDs }) || ''} onChange={(e) => { this.handleFieldChange(e, nestedIDs); }} data-type={ObjectType.types.string} />
          </CreateObjectField>
        );
      } else if (child.typePrimary === ObjectType.types.number) {
        // NUMBER
        fields.push(
          <CreateObjectField title={child.name} type={ObjectType.types.number} key={guid}>
            <input value={this.nestedObject({ object: this.state.current, idArray: nestedIDs }) || ''} onChange={(e) => { this.handleFieldChange(e, nestedIDs); }} data-type={ObjectType.types.number} />
          </CreateObjectField>
        );
      }
    }
    return fields;
  }

  save() {
    DataState.addOrUpdateData(this.state.current).then((updatedData) => {
      super.save();
    });
  }

  render() {
    const fields = this.getObjectFields(this.state.current);
    return (
      <div className="create-object">
        {fields}
        <div className="buttons">
          {this.getButtons()}
        </div>
      </div>
    );
  }
}

CreateObject.propTypes = {
  childObject: Proptypes.object,
  keyIndex: Proptypes.number,
};
