// Helpers
import React from 'react';
import ReactRTE from 'react-rte';
import Proptypes from 'prop-types';

// scss
import './RichTextEditor.scss';

export default class RichTextEditor extends React.Component {
  state = {
    value: ReactRTE.createValueFromString(this.props.html || '', 'html')
  }

  onChange(value) {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value.toString('html'));
    }
  }

  render() {
    return (
      <ReactRTE
        value={this.state.value}
        onChange={this.onChange.bind(this)}
      />
    );
  }
}

RichTextEditor.propTypes = {
  onChange: Proptypes.func,
  html: Proptypes.string,
};
