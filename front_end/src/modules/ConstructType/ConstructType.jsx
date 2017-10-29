import React from 'react';
import Type from '../../resources/scripts/types/Type';

// scss
import './ConstructType.scss';

export default class ConstructType extends React.Component {
  constructor(props) {
    super(props);

    const type = new Type();
    type.add({ name: 'title', primary: Type.string });
    type.add({ name: 'locations', primary: Type.list, secondary: Type.number });
    console.log('type is:', type.getJSON());
  }

  render() {
    return (
      <div className="construct-type" />
    );
  }
}
