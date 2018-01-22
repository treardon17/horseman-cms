import React from 'react';
import { Link } from 'react-router-dom';

// scss
import './Form.scss';

export default class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="form">
        <h1>Form</h1>
      </div>
    );
  }
}
