import React from 'react';
import Proptypes from 'prop-types';
import Type from '../../resources/scripts/types/Type';
import Select from 'react-select';
import Button from 'material-ui/Button';

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
    };
  }


  getFields() {
    // Get all of the slugs from the type.parts
    const parts = this.state.type.parts;
    const slugs = Object.keys(parts);
    const fields = [];
    console.log('getting fields');
    for (let i = 0; i < slugs.length; i++) {
      const slug = slugs[i];
      const part = parts[slug];
      fields.push(
        <div className="field" key={`field-${i}`}>
          <input
            type="text"
            value={part.name}
            onChange={(e) => { this.handleChangePart(e, 'name', slug); }}
          />
          <Select />
        </div>
      );
    }
    return fields;
  }

  handleChangePart(e, partID, slug) {
    const type = this.state.type;
    const editObject = {};
    editObject[partID] = e.target.value;
    editObject.slug = slug;
    type.edit(editObject);
    console.log('type is:', type.parts);
    this.setState({ type });
  }

  addField() {
    const type = this.state.type;
    type.add();
    this.setState({ type });
    console.log(this.state.type);
  }

  handleNameChange(e) {
    const type = this.state.type;
    type.name = e.target.value;
    this.setState({ type });
  }

  fieldTemplate() {
    // Gotta figure out a good way to add a new field
    // and listen for the changes on that new field
    // to dynamically update this.state.type, but also be
    // able to edit previous fields
  }

  render() {
    return (
      <div className="construct-type">
        <input
          type="text"
          value={this.state.type.name}
          onChange={this.handleNameChange.bind(this)}
        />
        <div className="constructor-container">
          {this.getFields()}
        </div>
        <Button onClick={this.addField.bind(this)}>Add</Button>
      </div>
    );
  }
}

ConstructType.propTypes = {
  type: Proptypes.object,
};
