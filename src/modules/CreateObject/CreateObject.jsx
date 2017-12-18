import React from 'react';
import Proptypes from 'prop-types';
import Creator from '../Creator/Creator';

import TypeState from '../../state/TypeState';

// scss
import './ConstructObject.scss';

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
