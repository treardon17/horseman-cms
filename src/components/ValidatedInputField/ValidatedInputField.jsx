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

  // getRegex() {
  //   const allowType = this.props.allowType;
  //   let regex = this.props.regex;
  //   // if (allowType === 'string') {
  //   //   regex = /(-?[0-9]+\.?[0-9]*)/;
  //   // } else if (allowType === 'number') {
  //   //
  //   // } else {
  //   //   regex = new RegExp(regex);
  //   // }
  //   return regex;
  // }

  replaceAll(string, replaceArray) {
    let stringCopy = string;
    if (replaceArray) {
      for (let i = 0; i < replaceArray.length; i++) {
        stringCopy = stringCopy.replace(replaceArray[i], '');
      }
    }
    return stringCopy;
  }

  validateString(input) { }

  validateNumber(input) {
    const regex = /([^\d-.])/g;
    let validInput = input;
    const matches = validInput.match(regex);
    validInput = this.replaceAll(validInput, matches);

    let inputNumber = input;
    if (validInput[validInput.length - 1] === '.') {
      inputNumber = parseFloat(`${inputNumber}.0`).toFixed(1);
      // select the zero we put on the end so the user can edit it if they want
      setTimeout(() => {
        this.input.selectionStart = this.input.selectionStart - 1;
      }, 0);
    } else {
      inputNumber = parseFloat(validInput);
    }
    if (inputNumber == null || isNaN(inputNumber)) {
      inputNumber = 0;
    }

    return inputNumber;
  }

  validateInput(input) {
    const allowType = this.props.allowType;
    if (allowType === 'string') {
      return this.validateString(input);
    } else if (allowType === 'number') {
      return this.validateNumber(input);
    } else {
      return input;
    }
  }

  render() {
    return (
      <div className="validated-input-field">
        <input ref={(ref) => { this.input = ref; }} type="text" value={this.props.value || ''} onChange={this.onChange.bind(this)} />
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
