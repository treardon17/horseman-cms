import { observable, extendObservable, computed } from 'mobx'
import TypeState from './TypeState.js'
import ModalState from './ModalState.js'
import React from 'react'

// components
import CreateType from '../components/CreateType'
import CreateNewObject from '../components/CreateNewObject'

class AppState {
  constructor() {
    this.circleMenuItems = [
      { icon: require('../assets/img/featherIcons/layout.svg'), onClick: () => { ModalState.pushModal({ page: <CreateType />, title: 'Create Module Type' }) } },
      { icon: require('../assets/img/featherIcons/image.svg'), onClick: () => {} },
      { icon: require('../assets/img/featherIcons/layers.svg'), onClick: () => { ModalState.pushModal({ page: <CreateNewObject />, title: 'Create New Object' }) } }
    ]
    this.menuItems = [
      { icon: require('../assets/img/featherIcons/home.svg'), title: 'Home', url: '/' },
      { icon: require('../assets/img/featherIcons/users.svg'), title: 'Users', url: '/users' },
      { icon: require('../assets/img/featherIcons/image.svg'), title: 'Assets', url: '/assets' },
      { icon: require('../assets/img/featherIcons/layout.svg'), title: 'Modules', url: '/modules' },
      { icon: require('../assets/img/featherIcons/layers.svg'), title: 'Objects', url: '/objects' },
      { icon: require('../assets/img/featherIcons/settings.svg'), title: 'Settings', url: '/settings' }
    ]
  }
}

export default new AppState()
