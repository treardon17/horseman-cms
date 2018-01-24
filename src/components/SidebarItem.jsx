import React from 'react'
import { VelocityComponent } from 'velocity-react'
import PropTypes from 'prop-types'
import ISVG from 'react-inlinesvg'
import styled from 'styled-components'
import stylePropType from 'react-style-proptype'
import { navigateTo } from 'gatsby-link'
import styles from '../styles'

export default class SidebarItem extends React.Component {
  constructor(props) {
    super(props)

    this.animationDuration = 200
    this.easing = 'ease-in-out'
    this.clicked = false
  }

  handleClicked = () => {
    this.clicked = true
    navigateTo(this.props.url)
  }

  render = () => {
    // Should the item be highlighted?
    let currentPage = false
    if (typeof window !== 'undefined') {
      currentPage = (window.location.pathname === this.props.url)
    }
    const isActive = (this.props.active || currentPage || this.clicked)
    // Reset the click state after it's been rendered
    this.clicked = false
    const classes = `sidebar-item ${this.props.bigIcon ? 'big-icon' : 'regular-icon'} ${isActive ? 'active' : 'inactive'}`
    // Render
    return (
      <SidebarItemComponent style={this.props.style} className={classes} onClick={this.handleClicked}>
        <VelocityComponent
          animation={this.props.bigIcon ? {
              width: '30px',
              left: '50%',
              translateX: '-50%'
            } : {
              translateX: '0%',
              left: '5%',
              width: '18px'
            }}
          duration={this.animationDuration}
          easing={this.easing}
        >
          <ISVG className="item-icon" src={this.props.icon} />
        </VelocityComponent>
        <VelocityComponent
          animation={this.props.bigIcon ? {
              positionX: 20,
              opacity: 0,
            } : {
              positionX: 0,
              opacity: 1,
            }}
          duration={this.animationDuration}
          easing={this.easing}
        >
          <h4 className="item-title">{this.props.title}</h4>
        </VelocityComponent>
      </SidebarItemComponent>
    )
  }
}

// STYLES
const SidebarItemComponent = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: ${styles.spacing.small};
  border: 0;
  transition: background-color ${styles.transition.slow} ease-in-out;
  outline: none;
  position: relative;
  cursor: pointer;
  background-color: ${styles.color.shade1};
  backface-visibility: hidden;

  &:hover, &.active{ background-color: ${styles.color.base}; }

  .item-icon{
    position: absolute;
    margin: auto;

    svg{
      stroke: ${styles.color.shade3};
      width: inherit;
      height: 100%;
    }
  }

  .item-title{
    text-transform: uppercase;
    letter-spacing: 1px;
    color: ${styles.color.shade3};
    margin-left: 40px;
  }
`

SidebarItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
  bigIcon: PropTypes.bool,
  active: PropTypes.bool,
  style: stylePropType
}
