import React from 'react';
// import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { VelocityComponent } from 'velocity-react';
import SidebarItem from '../SidebarItem/SidebarItem.jsx';
import API from '../../resources/scripts/API';


// scss
import './Sidebar.scss';

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.openDuration = 300;
    this.initialDelay = this.openDuration / 2;
    this.itemDelay = 75;
    this.itemDuration = 250;

    this.state = {
      open: false
    };

    // API.makeQuery('http://localhost:8080/graphql?query={moduleSettingOne(filter:{name:%22test-module%22}){name,fields}moduleSettingMany(filter:{name:%22test-module%22}){name,fields}}').then((response) => {
    //   console.log(response);
    // });
  }

  // Sidebar items with transitions
  getSidebarMenuItems() {
    const sidebarItems = [];
    for (let i = 0; i < this.props.menuItems.length; i++) {
      const calculatedDelay = this.initialDelay + ((i) * this.itemDelay) + (this.openDuration * 0.1);
      const menuItem = this.props.menuItems[i];
      sidebarItems.push(
        <VelocityComponent
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
          easing={'ease-in-out'}
          delay={calculatedDelay}
        >
          <SidebarItem key={i} bigIcon={!this.state.open} icon={menuItem.icon} title={menuItem.title} url={menuItem.url} />
        </VelocityComponent>
      );
    }
    return sidebarItems;
  }

  getSidebarHeader() {
    return (
      <div className="sidebar-header">
        <div className="header-content">
          <button className="sidebar-logo" onClick={this.toggleMenu.bind(this)} />
        </div>
      </div>
    );
  }

  toggleMenu() {
    this.setState({ open: !this.state.open });
  }

  // Render element
  render() {
    const classes = `sidebar-content ${(this.state.open ? 'open' : 'closed')}`;
    const animation = this.state.open ? { width: "250px" } : { width: "70px" };
    const easing = 'ease-in-out';

    return (
      <div className="sidebar">
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
      </div>
    );
  }
}

Sidebar.propTypes = {
  menuItems: PropTypes.arrayOf(Object)
};
