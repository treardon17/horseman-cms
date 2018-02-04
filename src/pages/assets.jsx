import React from 'react'
import PropTypes from 'prop-types'
import Page from './Page.jsx'
import AppState from '../state/AppState.jsx'
// import modules here
import EmptyPage from '../components/EmptyPage'

export default class Assets extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let children = []
    if (children.length === 0) {
      children = (<EmptyPage title="No Assets" message="Press the + button in the bottom right to add an asset" />)
    }
    return (
      <Page id="Assets" title="Assets">
        {children}
      </Page>
    )
  }
}

Assets.propTypes = {
  state: PropTypes.instanceOf(AppState),
}
