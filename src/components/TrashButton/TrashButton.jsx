import React from 'react';
import IconButton from 'material-ui/IconButton';
import ISVG from 'react-inlinesvg';
import PropTypes from 'prop-types';

// scss
import './TrashButton.scss';

export default class TrashButton extends React.Component {
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
      <div className="trash-button" onClick={this.buttonClicked.bind(this)} >
        <ISVG className="trash-icon" src="/assets/img/featherIcons/trash.svg" />
      </div>
    );
  }
}

TrashButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
