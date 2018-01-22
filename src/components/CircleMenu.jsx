import React from 'react'
import PropTypes from 'prop-types'
import ActionButton from './ActionButton'
import { VelocityComponent } from 'velocity-react'
import styled from 'styled-components'
import styles from '../styles'

export default class CircleMenu extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }

    this.animationDuration = 400
    this.rotateDelay = 50
    this.angle = 90
  }

  getButtons() {
    const numButtons = this.props.menuItems.length

    const divideBy = (numButtons > 1 ? (numButtons - 1) : 2)
    const degreesBetweenButtons = (this.angle / divideBy)
    const rotateDuration = this.state.open ? this.animationDuration : this.animationDuration / 3
    const buttons = []
    for (let i = 0; i < numButtons; i++) {
      const button = this.props.menuItems[i]
      const rotateBy = -(i*degreesBetweenButtons)
      const rotateDelay = this.state.open ? ((i * this.rotateDelay) + (this.animationDuration / 1.5)) : 0

      buttons.push(
        <VelocityComponent
          animation={this.state.open ? { rotateZ: rotateBy } : { rotateZ: 0 }}
          duration={rotateDuration}
          easing={this.state.open ? [50, 10] : 'ease-out'}
          delay={rotateDelay}
          key={`button-${i}`}
        >
          <div className="button-anchor">
            <VelocityComponent
              animation={this.state.open ? { height: 100 } : { height: 0 }}
              duration={this.state.open ? this.animationDuration : (this.animationDuration / 2)}
              easing={this.state.open ? [50, 10] : 'ease-out'}
              delay={this.state.open ? 0 : this.animationDuration}
            >
              <div className="button-extent">
                <div className="button-container">
                  <VelocityComponent
                    animation={this.state.open ? { rotateZ: -rotateBy } : { rotateZ: 0 }}
                    duration={rotateDuration}
                    delay={rotateDelay}
                  >
                    <ActionButton icon={button.icon} onClick={() => { this.handleButtonClick(button.onClick) }} />
                  </VelocityComponent>
                </div>
              </div>
            </VelocityComponent>
          </div>
        </VelocityComponent>
      )
    }
    return buttons
  }

  handleButtonClick(callback) {
    this.closeMenu()
    if (typeof callback === 'function') {
      callback()
    }
  }

  toggleMenu() {
    this.setState({ open: !this.state.open })
  }

  closeMenu() {
    this.setState({ open: false })
  }

  openMenu() {
    this.setState({ open: true })
  }

  render() {
    return (
      <MenuStyles>
        <VelocityComponent
          animation={this.state.open ? { rotateZ: '-45deg' } : { rotateZ: '0deg' }}
          duration={this.animationDuration}
          easing={[50, 8]}
        >
          <ActionButton icon="/assets/img/featherIcons/plus.svg" onClick={this.toggleMenu.bind(this)} />
        </VelocityComponent>
        {this.getButtons()}
      </MenuStyles>
    )
  }
}

// STYLES
const MenuStyles = styled.div.attrs({ className: 'circle-menu' })`
  position: fixed;
  bottom: ${styles.spacing.small};
  right: ${styles.spacing.small};
  display: flex;
  align-items: center;
  justify-content: center;

  .action-button{
    position: relative;
    z-index: ${styles.zIndex.upper};
    -webkit-perspective: 1000;
    transform: translate3d(0,0,0);
    backface-visibility: hidden;
  }

  .button-anchor{
    position: absolute;
    z-index: ${styles.zIndex.middle};
    top: 0; bottom: 0; right: 0; left: 0;
    margin: auto;
    width: 1px;
    height: 1px;
    display: flex;
    justify-content: center;
    align-items: flex-end;

    .button-extent{
      transform-origin: bottom center;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: flex-start;

      .button-container{
        // We've gotta offset it by 1px
        // because that's the bottom-anchor size
        transform: translateY(calc(-50% - 1px));
        .action-button{
          transform-origin: center center;
        }
      }
    }
  }
`

CircleMenu.propTypes = {
  menuItems: PropTypes.object.isRequired,
}
