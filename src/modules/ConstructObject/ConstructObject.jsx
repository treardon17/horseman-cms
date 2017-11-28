import React from 'react';
import { Link } from 'react-router-dom';

// scss
import './ConstructObject.scss';

export default class ConstructObject extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="construct-object">
        <h1>ConstructObject</h1>
      </div>
    );
  }
}
