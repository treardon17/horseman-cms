import React from 'react';
import IconButton from 'material-ui/IconButton';
import ISVG from 'react-inlinesvg';
import PropTypes from 'prop-types';

// scss
import './ActionButton.scss';

export default class ActionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  buttonClicked(event) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }

  render() {
    return (
      <div className="action-button">
        <IconButton onClick={this.buttonClicked.bind(this)}>
          <ISVG
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', height: 24, width: 24 }}
            className="item-icon"
            src={this.props.icon}
          />
        </IconButton>
      </div>
    );
  }
}

ActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
