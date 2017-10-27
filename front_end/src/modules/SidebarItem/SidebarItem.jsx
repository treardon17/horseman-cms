import React from 'react';
import { VelocityComponent } from 'velocity-react';
import PropTypes from 'prop-types';
import ISVG from 'react-inlinesvg';
import stylePropType from 'react-style-proptype';
import { History } from 'react-transition-router';

// scss
import './SidebarItem.scss';

export default class SidebarItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hovering: false,
    };

    this.animationDuration = 200;
    this.easing = 'ease-in-out';
    this.clicked = false;
  }

  handleClicked() {
    this.clicked = true;
    this.goToPage(this.props.url);
  }

  goToPage(page) {
    History.push(page);
  }

  render() {
    // Should the item be highlighted?
    const onCurrentPage = History.history.location.pathname === this.props.url;
    const isActive = (this.props.active || onCurrentPage || this.clicked);
    // Reset the click state after it's been rendered
    this.clicked = false;
    const classes = `sidebar-item ${this.props.bigIcon ? 'big-icon' : 'regular-icon'} ${isActive ? 'active' : 'inactive'}`;
    // Render
    return (
      <button style={this.props.style} className={classes} onClick={this.handleClicked.bind(this)}>
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
      </button>
    );
  }
}

SidebarItem.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
  bigIcon: PropTypes.bool,
  active: PropTypes.bool,
  style: stylePropType
};
