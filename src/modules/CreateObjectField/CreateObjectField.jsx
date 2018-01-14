import React from 'react';
import Proptypes from 'prop-types';

// scss
import './CreateObjectField.scss';

export default class CreateObject extends React.Component {
  render() {
    const classes = `${this.props.type}-object-field create-object-field`;
    const title = this.props.title ? <h4>{this.props.title}:</h4> : null;
    return (
      <div className={classes} {...this.props}>
        {title}
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
