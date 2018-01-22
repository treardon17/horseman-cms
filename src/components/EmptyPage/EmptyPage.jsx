import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// scss
import './EmptyPage.scss';

export default class EmptyPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="empty-page">
        <div className="content-container">
          <h1>{this.props.title}</h1>
          {this.props.message ? <p>{this.props.message}</p> : null}
        </div>
      </div>
    );
  }
}

EmptyPage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
};
