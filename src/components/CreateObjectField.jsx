import React from 'react'
import Proptypes from 'prop-types'
import styled from 'styled-components'
import styles from '../styles'

export default class CreateObject extends React.Component {
  render() {
    const classes = `${this.props.type}-object-field create-object-field`
    const title = this.props.title ? <h4>{this.props.title}:</h4> : null
    return (
      <CreateObjectFieldComponent className={classes} {...this.props}>
        {title}
        {this.props.children}
      </CreateObjectFieldComponent>
    )
  }
}

// STYLES
const CreateObjectFieldComponent = styled.div`
  text-align: left;
  margin: ${styles.spacing.small} 0;

  h4{
    margin: 0 ${styles.spacing.small} ${styles.spacing.small} 0;
    display: block;
    text-align: left;
  }

  input{
    width: 100%;
  }
`

CreateObject.propTypes = {
  title: Proptypes.string,
  type: Proptypes.string,
  children: Proptypes.object,
}
