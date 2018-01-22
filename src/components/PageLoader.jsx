import React from 'react'
import PropTypes from 'prop-types'
import { VelocityTransitionGroup, VelocityComponent } from 'velocity-react'
import styled from 'styled-components'
import styles from '../styles'

export default class PageLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      show: true,
      showLogo: false,
      animationState: ''
    }

    this.animationDuration = 500
    this.pauseDuration = 2000
  }

  componentDidMount() {
    this.enterFinished()
  }

  enterFinished() {
    setTimeout(() => {
      this.setState({ showLogo: true })
      setTimeout(() => {
        this.setState({ show: false })
      }, this.pauseDuration)
    }, this.animationDuration)
  }

  exitFinished() {
    if (typeof this.props.animationFinish === 'function') {
      this.props.animationFinish()
    }
  }

  render() {
    const content = this.state.show ? (
      <div className="content-container">
        <div className="loader-container">
          <VelocityComponent
            animation={this.state.showLogo ? {
              opacity: 1,
              translateY: '0%'
            } : {
              opacity: 0,
              translateY: '50%'
            }}
            duration={this.pauseDuration}
            easing={[75, 15]}
          >
            <div className="logo" />
          </VelocityComponent>
        </div>
      </div>
    ) : null

    return (
      <PageLoaderComponent className="page-loader">
        <VelocityTransitionGroup
          className="transition-container"
          leave={{ animation: { opacity: 0 }, duration: this.animationDuration, complete: this.exitFinished.bind(this) }}
          runOnMount
        >
          {content}
        </VelocityTransitionGroup>
      </PageLoaderComponent>
    )
  }
}

// STYLES
const loaderLogoDim = '100px'
const PageLoaderComponent = styled.div`
  position: fixed;
  top: 0; bottom: 0; right: 0; left: 0;
  pointer-events: none;

  .content-container{
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${styles.color.white};

    .loader-container{
      .logo{
        width: ${loaderLogoDim};
        height: ${loaderLogoDim};
        @include containImage();
        background-image: url('/assets/img/lofty-logo.svg');
      }
    }
  }
`

PageLoader.propTypes = {
  animationFinish: PropTypes.func
}
