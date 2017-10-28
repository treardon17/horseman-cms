import React from 'react';
import Type from '../../resources/scripts/types/Type';
import Button from 'material-ui/Button';
import ISVG from 'react-inlinesvg';

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
      <div className="construct-type">
        <Button>
          <ISVG
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', height: 24, width: 24 }}
            className="item-icon"
            src="/assets/img/icons/plus.svg"
          />
        </Button>
      </div>
    );
  }
}
