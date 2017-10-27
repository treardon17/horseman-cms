import React from 'react';
import { PageTransition, Route } from 'react-transition-router';
import Sidebar from './modules/Sidebar/Sidebar';
import AppState from './state/AppState';
// import styles
import './resources/styles/base.scss';
// import pages
import Home from './pages/Home';
import Modules from './pages/Modules';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Assets from './pages/Assets';

// create global state
const appState = new AppState();

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuItems: [
        { icon: "/assets/img/icons/home.svg", title: "Home", url: "/" },
        { icon: "/assets/img/icons/users.svg", title: "Users", url: "/users" },
        { icon: "/assets/img/icons/image.svg", title: "Assets", url: "/assets" },
        { icon: "/assets/img/icons/layout.svg", title: "Modules", url: "/modules" },
        { icon: "/assets/img/icons/settings.svg", title: "Settings", url: "/settings" }
      ],
      routes: [
        <Route path="/" key="Home" component={<Home state={appState} />} />,
        <Route path="/modules" key="Modules" component={<Modules state={appState} />} />,
        <Route path="/settings" key="Settings" component={<Settings state={appState} />} />,
        <Route path="/users" key="Users" component={<Users state={appState} />} />,
        <Route path="/assets" key="Assets" component={<Assets state={appState} />} />,
      ],
    };
  }

  render() {
    const animationObject = {
      load: { animation: { opacity: [1, 0], translateY: ['0vh', '100vh'] }, duration: 1000 },
      pop: {
        enter: { animation: { opacity: [1, 0], translateY: ['0px', '20px'], rotateX: ['0deg', '15deg'], scale: [1, 0.98] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateY: ['-20px', '0px'], rotateX: ['15deg', '0deg'], scale: [0.98, 1] }, duration: 500 },
      },
      push: {
        enter: { animation: { opacity: [1, 0], translateY: ['0px', '-20px'], rotateX: ['0deg', '15deg'], scale: [1, 0.98] }, duration: 500 },
        exit: { animation: { opacity: [0, 1], translateY: ['20px', '0px'], rotateX: ['15deg', '0deg'], scale: [0.98, 1] }, duration: 500 },
      },
    };
    return (
      <div className="app-wrapper">
        <Sidebar menuItems={this.state.menuItems} />
        <PageTransition
          routes={this.state.routes}
          loadAnimationName="load"
          fallback="/404"
          serialize={false}
        />
      </div>
    );
  }
}
