import { observer } from "mobx-react";
import React from 'react';
import { Link } from 'react-router-dom';
import ISVG from 'react-inlinesvg';
import PropTypes from 'prop-types';
import { VelocityTransitionGroup } from 'velocity-react';
import ModalState from '../../state/ModalState';

// scss
import './Modal.scss';

@observer export default class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.animationDuration = 600;
  }

  navigateBack() {
  }

  close() {
    ModalState.close();
  }

  didEnter() { }
  didClose() { }


  render() {
    // The faded background behind the modal
    const background = ModalState.modalOpen ? (
      <div className="background" onClick={this.close.bind(this)} />
    ) : null;

    // The actual modal itself
    const modal = ModalState.modalOpen ? (
      <div className="modal-container">
        <div className="modal-header">
          <div className="back-btn" onClick={this.navigateBack.bind(this)}>
            <ISVG src="/assets/img/featherIcons/arrow-left.svg" />
          </div>
          <div className="exit-btn" onClick={this.close.bind(this)}>
            <ISVG src="/assets/img/featherIcons/x.svg" />
          </div>
        </div>
        <div className="modal-content">
          {this.props.children}
          {ModalState.modalItems}
        </div>
      </div>
    ) : null;

    const classes = `modal ${(ModalState.modalOpen ? 'open' : 'closed')}`;

    return (
      <div className={classes}>
        <VelocityTransitionGroup
          className="modal-transition-container"
          enter={{ animation: { opacity: [0.6, 0] }, duration: this.animationDuration, easing: 'ease-in-out' }}
          leave={{ animation: { opacity: [0, 0.6] }, duration: this.animationDuration, easing: 'ease-in-out' }}
          runOnMount
        >
          {background}
        </VelocityTransitionGroup>
        <VelocityTransitionGroup
          className="modal-transition-container"
          enter={{ animation: { top: ['0vh', '-100vh'] }, duration: this.animationDuration, easing: 'ease-in-out' }}
          leave={{ animation: { top: ['-100vh', '0vh'] }, duration: this.animationDuration, easing: 'ease-in-out' }}
          runOnMount
        >
          {modal}
        </VelocityTransitionGroup>
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.any,
};
