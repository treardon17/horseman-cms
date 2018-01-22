import 'whatwg-fetch'; // Fetch polyfill
import '../../core/polyfill/ObjectAssign'; // Object.assign polyfill
import React from 'react'
import { observer } from "mobx-react"
import { PageTransition, Route } from 'react-transition-router'

// Components
import CircleMenu from '../components/CircleMenu'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'

// State
import AppState from '../state/AppState'
import ModalState from '../state/ModalState'
import TypeState from '../state/TypeState'

// import pages
import Home from '../pageContainers/Home'
import Modules from '../pageContainers/Modules'
import Settings from '../pageContainers/Settings'
import Users from '../pageContainers/Users'
import Assets from '../pageContainers/Assets'
import Objects from '../pageContainers/Objects'

@observer export default class Routes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      routes: [
        <Route absolute path="/" key="Home" component={<Home />} />,
        <Route absolute exact path="/modules" key="Modules" component={<Modules />} />,
        <Route absolute exact path="/settings" key="Settings" component={<Settings />} />,
        <Route absolute exact path="/users" key="Users" component={<Users />} />,
        <Route absolute exact path="/assets" key="Assets" component={<Assets />} />,
        <Route absolute exact path="/objects" key="Objects" component={<Objects />} />,
      ],
    }
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
    }

    return (
      <div className="app-wrapper">
        <Sidebar menuItems={AppState.menuItems} />
        <div className="transition-container">
          <PageTransition
            animations={animationObject}
            routes={this.state.routes}
            serialize={false}
          />
          <Modal ref={(ref) => { ModalState.modal = ref }} />
          <CircleMenu menuItems={AppState.circleMenuItems} />
        </div>
      </div>
    )
  }
}
