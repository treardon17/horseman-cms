import React from 'react';
import Proptypes from 'prop-types';

// scss
import './CreateObjectField.scss';

export default class CreateObject extends React.Component {
  render() {
    const classes = `${this.props.type}-object-field create-object-field`;
    return (
      <div className={classes} {...this.props}>
        <h4>{this.props.title}:</h4>
        {this.props.children}
      </div>
    );
  }
}

CreateObject.propTypes = {
  title: Proptypes.string,
  type: Proptypes.string,
  children: Proptypes.object,
};