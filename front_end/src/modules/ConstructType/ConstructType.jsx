import React from 'react';
import Proptypes from 'prop-types';
// import _ from 'lodash';
import Type from '../../resources/scripts/types/Type';
import Select from 'react-select';
import Button from 'material-ui/Button';
import ContentEditable from 'react-simple-contenteditable';

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
    const arr = Object.keys(parts).map(key => [key, parts[key]]);
    arr.sort((a, b) => a[1].id - b[1].id);

    console.log(arr);

    for (let i = 0; i < arr.length; i++) {
      const slug = arr[i][0];
      const part = arr[i][1];
      fields.push(
        <div className="field" key={`field-${i}`}>
          <ContentEditable
            key={`field-name-${i}`}
            html={part.name}
            className={`field-name input-field`}
            onClick={this.highlightAll.bind(this)}
            onChange={(e, val) => { this.handleChangePart(e, val, 'name', slug); }}
            contentEditable="plaintext-only"
          />
          <div className="slug-name">{slug}</div>
          <Select
            options={[{ value: i, label: i }]}
          />
        </div>
      );
    }

    // for (let i = 0; i < slugs.length; i++) {
    //   const slug = slugs[i];
    //   const part = parts[slug];
    //   if (part) {
    //     fields.push(
    //       <div className="field" key={`field-${i}`}>
    //         <ContentEditable
    //           key={`field-name-${i}`}
    //           html={part.name}
    //           className={`field-name input-field`}
    //           onClick={this.highlightAll.bind(this)}
    //           onChange={(e, val) => { this.handleChangePart(e, val, 'name', slug); }}
    //           contentEditable="plaintext-only"
    //         />
    //         <div className="slug-name">{slug}</div>
    //         <Select
    //           options={[{ value: i, label: i }]}
    //         />
    //       </div>
    //     );
    //   }
    // }
    return fields;
  }

  highlightAll() {
    document.execCommand('selectAll', false, null);
  }

  handleChangePart(event, val, partID, slug) {
    console.log('changing slug:', slug);
    const type = this.state.type;
    const editObject = {};
    editObject[partID] = val || event.target.value;
    editObject.slug = slug;
    type.edit(editObject);
    this.setState({ type });
  }

  addField() {
    const type = this.state.type;
    type.add();
    this.setState({ type });
  }

  handleNameChange(val) {
    const type = this.state.type;
    type.name = val;
    this.setState({ type });
  }

  render() {
    return (
      <div className="construct-type">
        <ContentEditable
          html={this.state.type.name}
          className="module-title input-field"
          onClick={this.highlightAll.bind(this)}
          onChange={(e, val) => { this.handleNameChange(val); }}
          contentEditable="plaintext-only"
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
