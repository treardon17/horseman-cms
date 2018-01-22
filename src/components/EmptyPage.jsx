import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import styles from '../styles'

export default class EmptyPage extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="empty-page">
        <div className="content-container">
          <h1>{this.props.title}</h1>
          {this.props.message ? <p>{this.props.message}</p> : null}
        </div>
      </div>
    )
  }
}

// STYLES
const EmptyPageComponent = styled.div`
  position: absolute;
  top: 0; bottom: 0; right: 0; left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${styles.color.base};

  .content-container{
    display: block;
    text-align: center;
  }
`

EmptyPage.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
}
