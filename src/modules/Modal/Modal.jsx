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
    this.modalAnimationDuration = 600;
    this.modalPageAnimationDuration = 200;
    this.modalHeight = null;
    this.modalContent = null;

    this.state = {
      currentView: ModalState.currentView,
      isPushing: false
    };
  }

  getModalContentHeight() {
    if (this.modalContent) {
      const element = this.modalContent;
      const computedStyle = getComputedStyle(element);
      // height with padding
      let elementHeight = element.clientHeight;
      elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
      return elementHeight;
    }
    return 0;
  }

  popHistory() {
    const modalHeight = this.getModalContentHeight();
    this.modalHeight = modalHeight;
    ModalState.pop();
    // We need to set this to null so
    // the enter/exit animation can happen.
    // The actual navigation stuff happens in the
    // pageDidExit function
    this.setState({
      currentView: null,
      isPushing: false
    });
  }

  pushHistory({ page }) {
    const modalHeight = this.getModalContentHeight();
    this.modalHeight = modalHeight;
    ModalState.push({ page });
    this.setState({
      currentView: null,
      isPushing: true
    });
  }

  close() {
    ModalState.close();
  }

  pageDidExit() {
    this.setState({ currentView: ModalState.currentView }, () => {
      this.modalHeight = null;
    });
  }

  modalDidEnter() { }
  modalDidClose() { }

  render() {
    const modalStyles = { minHeight: this.modalHeight || 0 };
    // The actual modal itself
    const modal = ModalState.isOpen ? (
      <div className="modal-container">
        <div className="modal-header">
          <div className="back-btn" onClick={this.popHistory.bind(this)}>
            <ISVG src="/assets/img/featherIcons/arrow-left.svg" />
          </div>
          <div className="exit-btn" onClick={this.close.bind(this)}>
            <ISVG src="/assets/img/featherIcons/x.svg" />
          </div>
        </div>
        <div className="modal-content" style={modalStyles} ref={(el) => { this.modalContent = el; }}>
          <VelocityTransitionGroup
            className="modal-content-transitioner"
            enter={{ animation: { translateX: ['0%', `${this.state.isPushing ? '' : '-'}${'100%'}`], translateZ: 0, }, duration: this.modalPageAnimationDuration, easing: 'ease-in-out' }}
            leave={{ animation: { translateX: [`${this.state.isPushing ? '-' : ''}${'100%'}`, '0%'], translateZ: 0 }, duration: this.modalPageAnimationDuration, easing: 'ease-in-out', complete: this.pageDidExit.bind(this) }}
          >
            {this.state.currentView}
          </VelocityTransitionGroup>
        </div>
      </div>
    ) : null;

    // The faded background behind the modal
    const background = ModalState.isOpen ? (
      <div className="background" onClick={this.close.bind(this)} />
    ) : null;

    const classes = `modal ${(ModalState.isOpen ? 'open' : 'closed')}`;

    return (
      <div className={classes}>
        <VelocityTransitionGroup
          className="modal-transition-container"
          enter={{ animation: { opacity: [0.6, 0] }, duration: this.modalAnimationDuration, easing: 'ease-in-out' }}
          leave={{ animation: { opacity: [0, 0.6] }, duration: this.modalAnimationDuration, easing: 'ease-in-out' }}
          runOnMount
        >
          {background}
        </VelocityTransitionGroup>
        <VelocityTransitionGroup
          className="modal-transition-container"
          enter={{ animation: { top: ['0vh', '-100vh'] }, duration: this.modalAnimationDuration, easing: 'ease-in-out' }}
          leave={{ animation: { top: ['-100vh', '0vh'] }, duration: this.modalAnimationDuration, easing: 'ease-in-out' }}
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
