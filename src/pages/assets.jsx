import React from 'react'
import PropTypes from 'prop-types'
import Page from './Page'
import AppState from '../state/AppState'
import API from '../../core/util/api'
// import modules here
import EmptyPage from '../components/EmptyPage'

export default class Assets extends React.Component {
  constructor(props) {
    super(props)
  }

  handleUploadImage = (event) => {
    event.preventDefault()
    const formData = new FormData()
    if (this.image.value) {
      const fileList = this.image.files
      formData.append('media', fileList)
    }
    API.makeQuery({
      query: '/api/media',
      headers: { 'Accept': 'application/json' },
      method: 'POST',
      body: formData
    })
  }

  render() {
    let children = []
    if (children.length === 0) {
      children = (<EmptyPage title="No Assets" message="Press the + button in the bottom right to add an asset" />)
    }
    return (
      <Page id="Assets" title="Assets">
        {/* {children} */}
        <input multiple ref={(ref) => { this.image = ref }} type="file" name="pic" accept="image/*" />
        <input onClick={this.handleUploadImage} type="submit" />
      </Page>
    )
  }
}

Assets.propTypes = {
  state: PropTypes.instanceOf(AppState),
}
