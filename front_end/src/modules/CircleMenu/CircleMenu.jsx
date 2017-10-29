import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton/ActionButton';
import { VelocityComponent } from 'velocity-react';

// scss
import './CircleMenu.scss';

export default class CircleMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    this.animationDuration = 400;
    this.rotateDelay = 50;
    this.angle = 90;
  }


  getButtons() {
    const numButtons = 3;

    const divideBy = (numButtons > 1 ? (numButtons - 1) : 2);
    const degreesBetweenButtons = (this.angle / divideBy);
    const rotateDuration = this.state.open ? this.animationDuration : this.animationDuration / 3;
    const buttons = [];
    for (let i = 0; i < numButtons; i++) {
      const rotateBy = -(i*degreesBetweenButtons);
      const rotateDelay = this.state.open ? ((i * this.rotateDelay) + (this.animationDuration / 1.5)) : 0;

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
                    <ActionButton type="add" />
                  </VelocityComponent>
                </div>
              </div>
            </VelocityComponent>
          </div>
        </VelocityComponent>
      );
    }
    return buttons;
  }

  toggleMenu() {
    console.log('opening menu');
    this.setState({
      open: !this.state.open,
    });
  }

  render() {
    return (
      <div className="circle-menu">
        <VelocityComponent
          animation={this.state.open ? { rotateZ: '-45deg' } : { rotateZ: '0deg' }}
          duration={this.animationDuration}
          easing={[50, 8]}
        >
          <ActionButton type="add" onClick={this.toggleMenu.bind(this)} />
        </VelocityComponent>
        {this.getButtons()}
      </div>
    );
  }
}

CircleMenu.propTypes = {
  menuItems: PropTypes.array,
};
