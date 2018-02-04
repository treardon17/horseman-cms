import { observer, toJS } from 'mobx-react'
import React from 'react'
import PropTypes from 'prop-types'
import AppState from '../state/AppState.jsx'
import TypeState from '../state/TypeState.js'
import DataState from '../state/DataState.js'
import Page from './Page.jsx'
// import modules here
import EmptyPage from '../components/EmptyPage'
import CreateObject from '../components/CreateObject'

@observer export default class Objects extends React.Component {
  getDataObjects() {
    const dataObjects = []
    const userData = DataState.userDataObject
    if (userData) {
      const instance = userData.data
      if (instance) {
        const keys = Object.keys(instance)
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          if (instance[key]) {
            const dataObject = <CreateObject key={`data-object-${i}`} childObject={instance[key]} />
            dataObjects.push(dataObject)
          }
        }
      }
    }
    return dataObjects
  }

  render() {
    let children = this.getDataObjects()
    if (children.length === 0) {
      children = (<EmptyPage title="No Objects" message="Press the + button in the bottom right to add an object" />)
    }
    return (
      <Page id="Objects" title="Objects">
        {children}
      </Page>
    )
  }
}

Objects.propTypes = {
  state: PropTypes.instanceOf(AppState),
}
