import { observer } from 'mobx-react'
import React from 'react'
import ISVG from 'react-inlinesvg'
import PropTypes from 'prop-types'
import { VelocityTransitionGroup } from 'velocity-react'
import ModalState from '../state/ModalState'
import styled from 'styled-components'
import styles from '../styles'

@observer export default class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.modalAnimationDuration = 600
    this.modalPageAnimationDuration = 200
    this.modalHeight = null
    this.modalContent = null

    this.state = {
      currentView: ModalState.currentView,
    }
  }

  getModalContentHeight() {
    if (this.modalContent) {
      const element = this.modalContent
      const computedStyle = getComputedStyle(element)
      // height with padding
      let elementHeight = element.clientHeight
      elementHeight -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
      return elementHeight
    }
    return 0
  }

  popHistory() {
    const modalHeight = this.getModalContentHeight()
    this.modalHeight = modalHeight
    ModalState.pop()
    // We need to set this to null so
    // the enter/exit animation can happen.
    // The actual navigation stuff happens in the
    // pageDidExit function
    this.setState({ currentView: null })
  }

  pushHistory({ page, title, animate }) {
    const modalHeight = this.getModalContentHeight()
    this.modalHeight = modalHeight
    ModalState.push({ page, title })
    if (animate) {
      this.setState({ currentView: null })
    } else {
      this.setState({ currentView: ModalState.currentView })
    }
  }

  close() {
    ModalState.close()
  }

  pageDidExit() {
    this.setState({ currentView: ModalState.currentView }, () => {
      this.modalHeight = null
    })
  }

  modalDidEnter() { }
  modalDidClose() { }

  render() {
    const modalStyles = { minHeight: this.modalHeight || 0 }
    // The actual modal itself
    const modal = ModalState.isOpen ? (
      <div className="modal-container">
        <div className="modal-header">
          <div className="back-btn" onClick={this.popHistory.bind(this)}>
            <ISVG src={require('../assets/img/featherIcons/arrow-left.svg')} />
          </div>
          <h3 className="modal-title">{ModalState.currentTitle}</h3>
          <div className="exit-btn" onClick={this.close.bind(this)}>
            <ISVG src={require('../assets/img/featherIcons/x.svg')} />
          </div>
        </div>
        <div className="modal-content" style={modalStyles} ref={(el) => { this.modalContent = el }}>
          <VelocityTransitionGroup
            className="modal-content-transitioner"
            enter={{ animation: { translateX: ['0%', `${ModalState.isPushing ? '' : '-'}${'100%'}`], translateZ: 0, }, duration: this.modalPageAnimationDuration, easing: 'ease-in-out' }}
            leave={{
 animation: { translateX: [`${ModalState.isPushing ? '-' : ''}${'100%'}`, '0%'], translateZ: 0 }, duration: this.modalPageAnimationDuration, easing: 'ease-in-out', complete: this.pageDidExit.bind(this)
}}
          >
            {this.state.currentView}
          </VelocityTransitionGroup>
        </div>
      </div>
    ) : null

    // The faded background behind the modal
    const background = ModalState.isOpen ? (
      <div className="background" onClick={this.close.bind(this)} />
    ) : null

    const classes = `modal ${(ModalState.isOpen ? 'open' : 'closed')}`

    return (
      <ModalComponent className={classes}>
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
      </ModalComponent>
    )
  }
}

// STYLES
const ModalComponent = styled.div`
  position: fixed;
  top: 0; bottom: 0; right: 0; left: 0;
  z-index: ${styles.zIndex.top};

  &.closed{ pointer-events: none; }

  .background{
    position: absolute;
    top: 0; bottom: 0; right: 0; left: 0;
    background-color: ${styles.color.black};
    opacity: 0.4;
    z-index: ${styles.zIndex.bottom};
  }

  .modal-container{
    max-width: 100%;
    width: 650px;
    margin: ${styles.spacing.medium} auto;
    box-shadow: ${styles.boxShadow.regular};
    position: absolute;
    top: 0; left: 0; right: 0;

    .modal-header{
      height: 45px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: ${styles.color.shade1};

      .back-btn, .exit-btn{
        cursor: pointer;
        svg{
          margin: 0 ${styles.spacing.medium};
          stroke: ${styles.color.white};
        }
      }

      .back-btn{ }
      .exit-btn{ }
      .modal-title{
        font-weight: bold;
        color: ${styles.color.white};
        margin: 0;
      }
    }

    .modal-content{
      padding: ${styles.spacing.medium};
      background-color: ${styles.color.white};
      position: relative;
      transition: height $transitionSlow ease-in-out;
      max-height: calc(100vh - 125px);
      overflow-y: visible;

      .modal-transition-container{
        *{ backface-visibility: hidden !important; }
      }
    }
  }
`

Modal.propTypes = {
  children: PropTypes.any,
}
