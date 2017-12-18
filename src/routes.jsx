import React from 'react';
import { PageTransition, Route } from 'react-transition-router';
import Sidebar from './modules/Sidebar/Sidebar';
import AppState from './state/AppState';
import CircleMenu from './modules/CircleMenu/CircleMenu';
import Modal from './modules/Modal/Modal';
import ModalState from './state/ModalState.js';
import TypeState from './state/TypeState.js';
// import styles
import './styles/base.scss';
// import pages
import Home from './pages/Home';
import Modules from './pages/Modules';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Assets from './pages/Assets';
import Objects from './pages/Objects';

// create global state
const appState = new AppState();

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [
        <Route absolute path="/admin/" key="Home" component={<Home state={appState} />} />,
        <Route absolute exact path="/admin/modules" key="Modules" component={<Modules state={appState} />} />,
        <Route absolute exact path="/admin/settings" key="Settings" component={<Settings state={appState} />} />,
        <Route absolute exact path="/admin/users" key="Users" component={<Users state={appState} />} />,
        <Route absolute exact path="/admin/assets" key="Assets" component={<Assets state={appState} />} />,
        <Route absolute exact path="/admin/objects" key="Objects" component={<Objects state={appState} />} />,
      ],
    };
  }

  render() {
    const animationObject = {
      load: { animation: { opacity: [1, 0], top: ['0px', '50px'] }, duration: 1000 },
      pop: {
        enter: { animation: { left: ['0vw', '100vw'] }, duration: 500 },
        exit: { animation: { left: ['-100vw', '0vw'] }, duration: 500 },
      },
      push: {
        enter: { animation: { left: ['0vw', '-100vw'] }, duration: 500 },
        exit: { animation: { left: ['100vw', '0vw'] }, duration: 500 },
      },
    };
    return (
      <div className="app-wrapper">
        <Sidebar menuItems={appState.menuItems} />
        <div className="transition-container">
          <PageTransition
            animations={animationObject}
            routes={this.state.routes}
            serialize={false}
          />
          <Modal ref={(ref) => { ModalState.modal = ref; }} />
          <CircleMenu menuItems={appState.circleMenuItems} />
        </div>
      </div>
    );
  }
}
