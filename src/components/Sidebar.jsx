import React from 'react'
import PropTypes from 'prop-types'
import { VelocityComponent } from 'velocity-react'
import styled from 'styled-components'
import SidebarItem from './SidebarItem'
import styles from '../styles'

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.openDuration = 300
    this.initialDelay = this.openDuration / 2
    this.itemDelay = 75
    this.itemDuration = 250

    this.state = {
      open: false
    }
  }

  // Sidebar items with transitions
  getSidebarMenuItems() {
    const sidebarItems = []
    if (this.props.menuItems) {
      for (let i = 0; i < this.props.menuItems.length; i++) {
        const calculatedDelay = this.initialDelay + ((i) * this.itemDelay) + (this.openDuration * 0.1)
        const menuItem = this.props.menuItems[i]
        sidebarItems.push(<VelocityComponent
          key={i}
          animation={this.state.open ? {
              paddingTop: '0px',
              paddingLeft: '10px',
              paddingBottom: '0px',
              paddingRight: '10px',
            } : {
              paddingTop: '10px',
              paddingLeft: '10px',
              paddingBottom: '10px',
              paddingRight: '10px',
            }}
          duration={this.itemDuration}
          easing="ease-in-out"
          delay={calculatedDelay}
        >
          <SidebarItem
            key={i}
            bigIcon={!this.state.open}
            icon={menuItem.icon}
            title={menuItem.title}
            url={menuItem.url}
          />
        </VelocityComponent>) }
    }
    return sidebarItems
  }

  getSidebarHeader() {
    return (
      <div className="sidebar-header">
        <div className="header-content">
          <button className="sidebar-logo" onClick={this.toggleMenu} />
        </div>
      </div>
    )
  }

  toggleMenu = () => {
    this.setState({ open: !this.state.open })
  }

  // Render element
  render = () => {
    const classes = `sidebar-content ${(this.state.open ? 'open' : 'closed')}`
    const animation = this.state.open ? { width: '250px' } : { width: '70px' }
    const easing = 'ease-in-out'

    return (
      <SidebarComponent className="sidebar">
        <VelocityComponent
          animation={animation}
          duration={this.openDuration}
          easing={easing}
        >
          <div className="spacer" />
        </VelocityComponent>

        <div className="sidebar-container">
          { this.getSidebarHeader() }
          <VelocityComponent
            animation={animation}
            duration={this.openDuration}
            easing={easing}
          >
            <div className={classes}>
              { this.getSidebarMenuItems() }
            </div>
          </VelocityComponent>
        </div>
      </SidebarComponent>
    )
  }
}


// STYLES
const SidebarComponent = styled.div`
  overflow: hidden;
  position: relative;
  background-color: ${styles.color.shade1};
  min-height: 100vh;
  z-index: ${styles.zIndex.top};
  display: inline-block;

  .sidebar-container{
    position: fixed;
    top: 0; left: 0; bottom: 0;
    background-color: inherit;

    .sidebar-header{
      width: 100%;
      height: ${styles.spacing.headerHeight};
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: ${styles.spacing.medium};
      background-color: inherit;

      &::after{
        content: '';
        position: absolute;
        bottom: 0; right: 0; left: 0;
        margin: 0 auto;
        width: 75%;
        border-bottom: 1px solid ${styles.color.white};
      }

      .header-content{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 80%;

        .sidebar-logo{
          ${styles.image.containImage}
          width: 100%;
          height: ${styles.spacing.closedMenuIconSize};
          background-image: url(${require('../assets/img/lofty-logo.svg')});
          cursor: pointer;
          background-color: transparent;
          border: none;
          outline: none !important;
        }
      }
    }
  }

  .spacer{
    position: relative;
  }

  // SIDE BAR CONTENT ---
  .sidebar-content{
    width: 100%;
    height: 100%;
    width: 250px;
    display: flex;
    flex-direction: column;
    background-color: inherit;

    // SIDE BAR ITEMS ---
    .sidebar-item{
      width: 100%;
    }
  }
`

Sidebar.propTypes = {
  menuItems: PropTypes.array
}
