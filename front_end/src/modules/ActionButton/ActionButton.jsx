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
    const className = `${this.props.type ? this.props.type : 'generic'}-button-type`;
    let button = null;

    switch (this.props.type) {
      case 'add':
        button = (
          <IconButton className={className} onClick={this.buttonClicked.bind(this)}>
            <ISVG
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', height: 24, width: 24 }}
              className="item-icon"
              src="/assets/img/icons/plus.svg"
            />
          </IconButton>
        );
        break;
      default:
        break;
    }

    return (
      <div className="action-button">
        {button}
      </div>
    );
  }
}

ActionButton.propTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
};
