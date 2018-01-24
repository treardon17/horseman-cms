// Helpers
import React from 'react'
// import ReactRTE from 'react-rte'
import Proptypes from 'prop-types'
import styled from 'styled-components'
import styles from '../styles'

let ReactRTE

export default class RichTextEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ReactRTE.createValueFromString(this.props.value || '', 'html')
    }
  }

  componentDidMount() {
    ReactRTE = require('react-rte')
  }

  onChange(value) {
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange(value.toString('html'))
    }
  }

  render() {
    return (
      <ReactRTE
        value={this.state.value}
        onChange={this.onChange.bind(this)}
      />
    )
  }
}

// STYLES
// const RichTextEditorComponent = styled.div``

RichTextEditor.propTypes = {
  onChange: Proptypes.func,
  value: Proptypes.string,
}
