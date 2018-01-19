import React from 'react';
import Proptypes from 'prop-types';

// scss
import './ValidatedInputField.scss';

export default class ValidatedInputField extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange(event) {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.validateInput(event.target.value));
    }
  }

  getRegex() {
    const allowType = this.props.allowType;
    let regex = this.props.regex;
    if (allowType === 'string') {
      regex = /(-?[0-9]+\.?[0-9]*)/;
    } else if (allowType === 'number') {
      regex = /([^\d-.])/g;
    } else {
      regex = new RegExp(regex);
    }
    return regex;
  }

  replaceAll(string, replaceArray) {
    let stringCopy = string;
    if (replaceArray) {
      for (let i = 0; i < replaceArray.length; i++) {
        stringCopy = stringCopy.replace(replaceArray[i], '');
      }
    }
    return stringCopy;
  }

  validateNumber(input) {
    let inputNumber = input;
    if (input[input.length - 1] === '.') {
      inputNumber = parseFloat(`${inputNumber}.0`).toFixed(1);
    } else {
      inputNumber = parseFloat(input);
    }
    return inputNumber;
  }

  validateInput(input) {
    let validInput = input;
    const regex = this.getRegex();
    if (regex) {
      const matches = validInput.match(regex);
      validInput = this.replaceAll(validInput, matches);
    }
    validInput = this.validateNumber(validInput);
    return validInput;
  }

  render() {
    return (
      <div className="validated-input-field">
        <input type="text" value={this.props.value || ''} onChange={this.onChange.bind(this)} />
      </div>
    );
  }
}

ValidatedInputField.propTypes = {
  positiveMatch: Proptypes.bool,
  regex: Proptypes.string,
  allowType: Proptypes.string,
  onChange: Proptypes.func,
  value: Proptypes.any,
};
