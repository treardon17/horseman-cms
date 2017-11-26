import React from 'react';
import Proptypes from 'prop-types';
// import _ from 'lodash';
import Type from '../../resources/scripts/types/Type';
import Select from 'react-select';
import Button from 'material-ui/Button';
import ContentEditable from 'react-simple-contenteditable';
import ISVG from 'react-inlinesvg';
import TypeState from '../../state/TypeState';

// scss
import './ConstructType.scss';

export default class ConstructType extends React.Component {
  constructor(props) {
    super(props);

    // const type = new Type();
    // type.add({ name: 'title', primary: Type.string });
    // type.add({ name: 'locations', primary: Type.list, secondary: Type.number });
    // console.log('type is:', type.getJSON());

    this.state = {
      type: this.props.type || new Type({ name: 'Module title' }),
      needSave: false
    };
  }

  getFormattedTypeList(type) {
    let validTypeNames = [];
    if (type === 'primary') {
      validTypeNames = TypeState.genericTypeNames;
    } else if (type === Type.types.object) {
      validTypeNames = TypeState.userMadeTypeNames;
    } else if (type === Type.types.list) {
      validTypeNames = TypeState.secondaryTypeNames;
    }
    const optionsList = [];
    for (let i = 0; i < validTypeNames.length; i++) {
      const value = validTypeNames[i];
      optionsList.push({ value, label: value });
    }
    return optionsList;
  }

  getFields() {
    // Get all of the slugs from the type.parts
    // If we don't have an ordered array, React gets its references
    // all messed up. So we keep an orderBy property on each part so
    // it works like it's supposed to.
    // DO NOT REMOVE THIS OR EVERYTHING GOES TO HELL
    const partsArray = this.state.type.getOrderedList();
    const slugs = Object.keys(this.state.type.parts);
    const fields = [];

    // This is the formatting for all of the fields in the module type
    for (let i = 0; i < partsArray.length; i++) {
      const slug = partsArray[i][0];
      const part = partsArray[i][1];

      // Only give the option to edit the secondary type if the primary
      // type is a list or an object
      let secondaryType = null;
      if (part.primary === Type.types.module || part.primary === Type.types.list) {
        secondaryType = (
          <Select
            value={part.secondary}
            className={'secondary-type'}
            options={this.getFormattedTypeList(part.primary)}
            onChange={(val) => { this.handleChangePart({ val: (val ? val.value : Type.types.empty), partID: 'secondary', slug }); }}
          />
        );
      }

      fields.push(
        <div className="field" key={`field-${i}`}>
          <div className="name-container">
            <ContentEditable
              key={`field-name-${i}`}
              html={part.name}
              className={`field-name input-field`}
              onClick={this.highlightAll.bind(this)}
              onChange={(e, val) => { this.handleChangePart({ event: e, val, partID: 'name', slug }); }}
              contentEditable="plaintext-only"
            />
            <div className="slug-name sub-text">{slug}</div>
          </div>
          <Select
            value={part.primary}
            className={'primary-type'}
            options={this.getFormattedTypeList('primary')}
            onChange={(val) => { this.handleChangePart({ val: (val ? val.value : Type.types.empty), partID: 'primary', slug }); }}
          />
          {secondaryType}
          <ContentEditable
            key={`field-description-${i}`}
            html={part.description}
            className={`field-description input-field`}
            onClick={this.highlightAll.bind(this)}
            onChange={(e, val) => { this.handleChangePart({ event: e, val, partID: 'description', slug }); }}
            contentEditable="plaintext-only"
          />
          <div className="remove-button" onClick={() => { this.removeField(slug); }}>
            <ISVG className="remove-icon" src="/assets/img/icons/trash.svg" />
          </div>
        </div>
      );
    }
    return fields;
  }

  getButtons() {
    const buttons = [];
    buttons.push(<Button key="add-field" className="square-button" onClick={this.addField.bind(this)}>Add Field</Button>);
    if (this.state.needSave) {
      buttons.push(<Button key="save-type" className="square-button" onClick={this.save.bind(this)}>Save</Button>);
    }
    return buttons;
  }

  highlightAll() {
    document.execCommand('selectAll', false, null);
  }

  handleChangePart({ event, val, partID, slug }) {
    const type = this.state.type;
    const editObject = {};
    editObject[partID] = val;
    editObject.slug = slug;
    type.edit(editObject);
    this.setState({
      type,
      needSave: true,
    });
  }

  addField() {
    const type = this.state.type;
    type.add();
    this.setState({
      type,
      needSave: true,
    });
  }

  save() {
    TypeState.addOrUpdateType(this.state.type);
    this.setState({
      needSave: false,
    });
  }

  removeField(slug) {
    const type = this.state.type;
    type.remove({ name: slug });
    this.setState({
      type,
      needSave: true,
    });
  }

  handleNameChange(val) {
    const type = this.state.type;
    type.setTypeName({ name: val });
    this.setState({
      type,
      needSave: true,
    });
  }

  render() {
    return (
      <div className="construct-type">
        <div className="module-title-container">
          <ISVG className="module-icon" src="/assets/img/icons/layout.svg" />
          <div className="module-title-data">
            <ContentEditable
              html={this.state.type.name}
              className="module-title input-field"
              onClick={this.highlightAll.bind(this)}
              onChange={(e, val) => { this.handleNameChange(val); }}
              contentEditable="plaintext-only"
            />
            <h3 className="module-slug sub-text">{this.state.type.slug}</h3>
          </div>
        </div>
        <div className="constructor-container">
          {this.getFields()}
        </div>
        <div className="button-container">
          {this.getButtons()}
        </div>
      </div>
    );
  }
}

ConstructType.propTypes = {
  type: Proptypes.object,
};
