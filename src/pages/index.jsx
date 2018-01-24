import 'whatwg-fetch' // Fetch polyfill
import React from 'react'
import { observer } from 'mobx-react'
import { PageTransition, Route } from 'react-transition-router'
import '../../core/polyfill/ObjectAssign' // Object.assign polyfill

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
  render() {
    // <div className="app-wrapper">
    //   <Sidebar menuItems={AppState.menuItems} />
    //   <div className="transition-container">
    //     <PageTransition
    //       animations={animationObject}
    //       routes={this.state.routes}
    //       serialize={false}
    //     />
    //     <Modal ref={(ref) => { ModalState.modal = ref }} />
    //     <CircleMenu menuItems={AppState.circleMenuItems} />
    //   </div>
    // </div>
    return (
      <div />
    )
  }
}
