// Helpers
import React from 'react';
import Proptypes from 'prop-types';
import Creator from '../Creator/Creator';
import Button from 'material-ui/Button';
import Select from 'react-select';
import TrashButton from '../TrashButton/TrashButton';
import SortUtil from '../../../core/util/sort';
import _ from 'lodash';

// State
import DataState from '../../state/DataState';
import TypeState from '../../state/TypeState';

// Definitions
import ObjectType from '../../../core/definitions/objectType';

// Modules
import CreateObjectField from '../CreateObjectField/CreateObjectField';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

// scss
import './CreateObject.scss';

export default class CreateObject extends Creator {
  constructor(props) {
    super(props);

    this.state = {
      ...super.state,
      current: this.buildObjectTree(this.props.childObject),
      moduleTypeToAdd: null,
    };
  }

  handleFieldChange(newVal, nestedIDs) {
    this.saveStateIfNeeded();
    const nestedIDsCopy = nestedIDs.slice();
    let stateVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal });
    // If an object within the main object was changed
    // we want to only replace that part
    if (nestedIDs && nestedIDsCopy.length > 1) {
      while (nestedIDsCopy.length > 1) {
        nestedIDsCopy.pop();
        stateVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal: stateVal });
      }
    }
    this.setState({ current: stateVal });
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

  addListItem(type, nestedIDs) {
    this.saveStateIfNeeded();
    const nestedIDsCopy = nestedIDs.slice();

    // If the user selected a type of object to create
    if (type) {
      let instance = null;
      // Get the type and check to see if that type is a valid user type
      const typeDef = TypeState.userMadeTypes.get(type);
      if (typeDef) {
        // If we got a type, create an instance of that type
        instance = typeDef.createObjectInstance();
      } else {
        instance = '';
      }

      // If we successfully created something
      if (instance != null) {
        // Grab the list we're trying to modify from state
        let newVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy });
        // Make sure that we actually got a list back.
        // If we did, append our instance to that list
        if (newVal && newVal instanceof Array) {
          newVal.push(instance);
        }
        newVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal });
        while (nestedIDsCopy.length > 1) {
          nestedIDsCopy.pop();
          newVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal });
        }
        this.setState({ current: newVal });
      }
    }
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

  removeListItem({ nestedIDs }) {
    this.saveStateIfNeeded();
    const nestedIDsCopy = nestedIDs.slice();
    // The last item in the array is the index of the item
    const listIndex = nestedIDsCopy.pop();
    const listVal = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy });
    listVal.splice(listIndex, 1);
    let newState = listVal;
    while (nestedIDsCopy.length > 0) {
      newState = this.nestedObject({ object: this.state.current, idArray: nestedIDsCopy, newVal: newState });
      nestedIDsCopy.pop();
    }
    this.setState({ current: newState });
  }

  removeData() {
    DataState.removeData(this.state.current._id);
  }

  // -----------------------------------------------------
  // FIELDS
  // -----------------------------------------------------
  getNumberField({ title, type, guid, value, onChange }) {
    return (
      <CreateObjectField title={title} type={ObjectType.types.number} key={guid}>
        <input type="text" value={value || ''} onChange={onChange} />
      </CreateObjectField>
    );
  }

  getStringField({ title, type, guid, value, onChange }) {
    return (
      <CreateObjectField title={title} type={ObjectType.types.string} key={guid}>
        <input type="text" value={value || ''} onChange={onChange} />
      </CreateObjectField>
    );
  }

  getRichTextField({ title, type, guid, value, onChange }) {
    return (
      <CreateObjectField title={title} type={ObjectType.types.richText} key={guid}>
        <RichTextEditor value={value || ''} onChange={onChange} />
      </CreateObjectField>
    );
  }

  getModuleField({ title, value, nestedIDs, guid }) {
    return (
      <div className="submodule-container" key={guid}>
        <h3>{title}</h3>
        {this.getObjectFields({ childObject: value, nestedWithin: nestedIDs })}
      </div>
    );
  }

  getListfield({ value, nestedIDs, guid, type }) {
    const listItems = [];
    for (let listIndex = 0; listIndex < value.length; listIndex++) {
      const tempIDList = nestedIDs.slice();
      tempIDList.push(listIndex);
      const isObject = value[listIndex] instanceof Object;
      const content = isObject ?
        this.getObjectFields({ childObject: value[listIndex], childTypeInfo: type, nestedWithin: tempIDList }) :
        this.getField({ typeName: type.typeSecondary, guid, nestedIDs: tempIDList, type });

      listItems.push(
        <div className="list-item" key={`list-item-${listIndex}`}>
          <div className="list-item-content">
            {content}
          </div>
          <TrashButton onClick={() => { this.removeListItem({ nestedIDs: tempIDList }); }} />
        </div>
      );
    }

    // debugger // eslint-disable-line
    const moduleSelector = type.typeSecondary === ObjectType.types.module ?
      <Select
        value={this.state.moduleTypeToAdd}
        className={'secondary-type'}
        options={TypeState.getFormattedTypeList(ObjectType.types.module)}
        onChange={(val) => { this.setState({ moduleTypeToAdd: val }); }}
      /> : null;

    let moduleTypeToAdd = null;
    if (type.typeSecondary === ObjectType.types.module) {
      if (this.state.moduleTypeToAdd) {
        moduleTypeToAdd = this.state.moduleTypeToAdd.value;
      } else {
        moduleTypeToAdd = '';
      }
    } else {
      moduleTypeToAdd = type.typeSecondary;
    }

    // Add each list item section to the fields
    return (
      <CreateObjectField title={type.name} type={ObjectType.types.list} key={guid}>
        <div className="list-container">
          {listItems}
          <div className="list-container__action">
            {moduleSelector}
            <Button onClick={() => { this.addListItem(moduleTypeToAdd, nestedIDs); }}>Add item</Button>
          </div>
        </div>
      </CreateObjectField>
    );
  }

  getField({ typeName, type, title, guid, value, nestedIDs }) {
    switch (typeName) {
      case ObjectType.types.module:
        return this.getModuleField({ title, value, nestedIDs, guid });
      case ObjectType.types.list:
        return this.getListfield({ value, nestedIDs, type, guid });
      case ObjectType.types.string:
        return this.getStringField({
          title,
          guid,
          value: this.nestedObject({ object: this.state.current, idArray: nestedIDs }),
          onChange: (e) => { this.handleFieldChange(e.target.value, nestedIDs); }
        });
      case ObjectType.types.richText:
        return this.getRichTextField({
          title,
          guid,
          value: this.nestedObject({ object: this.state.current, idArray: nestedIDs }),
          onChange: (val) => { this.handleFieldChange(val, nestedIDs); }
        });
      case ObjectType.types.number:
        return this.getNumberField({
          title,
          guid,
          value: this.nestedObject({ object: this.state.current, idArray: nestedIDs }),
          onChange: (e) => { this.handleFieldChange(e.target.value, nestedIDs); }
        });
      default:
        return null;
    }
  }

  getObjectFields({ childObject, childTypeInfo, nestedWithin = [] }) {
    const fields = [];

    if (childObject != null) {
      const { _typeID, _id } = childObject;
      // Get our type
      const type = TypeState.userMadeTypes.get(_typeID);

      if (type) {
        const childList = type.getSortedChildren();
        for (let i = 0; i < childList.length; i++) {
          const nestedIDs = nestedWithin.slice();
          const key = childList[i].key;
          const child = childList[i].value;
          const guid = `${_id}-${i}`;
          const childVal = childObject[child.slug];
          nestedIDs.push(child.slug);

          fields.push(this.getField({
            typeName: child.typePrimary,
            type: child,
            title: child.name,
            guid,
            value: childVal,
            nestedIDs
          }));
        }
      }
    } else if (childTypeInfo) {
      const nestedIDs = nestedWithin.slice();
      fields.push(this.getField({
        typeName: childTypeInfo.typeSecondary,
        type: childTypeInfo,
        guid: childTypeInfo.id,
        value: childObject,
        nestedIDs
      }));
    }
    return fields;
  }

  persistentButtons() {
    return [
      <Button key="delete-type" onClick={this.removeData.bind(this)}>Delete</Button>
    ];
  }

  save() {
    DataState.addOrUpdateData(this.state.current).then((updatedData) => {
      super.save();
    });
  }

  render() {
    const fields = this.getObjectFields({ childObject: this.state.current });
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
};
