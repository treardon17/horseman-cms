// Helpers
import React from 'react'
import Proptypes from 'prop-types'
import styled from 'styled-components'
import styles from '../styles'

const ReactRTE = (typeof window !== 'undefined') ? require('react-rte').default : null

export default class RichTextEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: ReactRTE ?
        ReactRTE.createValueFromString(this.props.value || '', 'html')
        : ''
    }
  }

  onChange = (value) => {
    this.setState({ value })
    if (this.props.onChange) {
      this.props.onChange(value.toString('html'))
    }
  }

  render() {
    const child = ReactRTE ?
      <ReactRTE value={this.state.value} onChange={this.onChange} />
      : null

    return (
      <div className="text-editor-wrapper">
        { child }
      </div>
    )
  }
}

// STYLES
// const RichTextEditorComponent = styled.div``

RichTextEditor.propTypes = {
  onChange: Proptypes.func,
  value: Proptypes.string,
}
