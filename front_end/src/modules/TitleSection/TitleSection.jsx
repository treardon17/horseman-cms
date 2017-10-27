import React from 'react';
import { Link } from 'react-router-dom';
import { VelocityTransitionGroup } from 'velocity-react';
import PropTypes from 'prop-types';

// scss
import './TitleSection.scss';

export default class TitleSection extends React.Component {
  constructor(props) {
    super(props);
    this.animationDuration = 500;
  }

  render() {
    return (
      <div style={this.props.style} className="title-section">
        <h2 className="title">
          <span className="secondary">{this.props.titleSecondary}</span>
          <span className="primary">{this.props.title}</span>
        </h2>
      </div>
    );
  }
}

TitleSection.propTypes = {
  style: PropTypes.instanceOf(Object),
  title: PropTypes.string,
  titleSecondary: PropTypes.string
};
