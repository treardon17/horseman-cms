// React
import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import 'whatwg-fetch'
// Polyfills
import '../../core/polyfill/ObjectAssign'
// State
import AppState from '../state/AppState'
import ModalState from '../state/ModalState'
import TypeState from '../state/TypeState'
// Components
import CircleMenu from '../components/CircleMenu'
import Sidebar from '../components/Sidebar'
import Modal from '../components/Modal'
// Styles
import styles from '../styles'

const TemplateWrapper = ({ children }) => pug`
  .app
    Helmet(
      title="Horseman CMS"
      meta=[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' }
      ]
    )
    .page-wrapper
      Sidebar(menuItems=${AppState.menuItems})
      CircleMenu(menuItems=${AppState.circleMenuItems})
      .page-container
        ${children()}
`

export default TemplateWrapper
