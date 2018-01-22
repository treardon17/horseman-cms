import React from 'react'
import { VelocityTransitionGroup } from 'velocity-react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import styles from '../styles'

export default class TitleSection extends React.Component {
  constructor(props) {
    super(props)
    this.animationDuration = 500
  }

  render() {
    return (
      <TitleSectionStyles style={this.props.style}>
        <div className="title-container">
          <h2 className="title">
            <span className="secondary">{this.props.titleSecondary}</span>
            <span className="primary">{this.props.title}</span>
          </h2>
        </div>
      </TitleSectionStyles>
    )
  }
}

// STYLES
const TitleSectionStyles = styled.div.attrs({ className: 'title-section' })`
  height: ${styles.spacing.headerHeight};
  position: relative;

  .title-container{
    height: ${styles.spacing.headerHeight};
    position: fixed;
    top: 0;
    text-align: left;
    width: 100%;
    background-color: ${styles.spacing.headerHeight};
    display: flex;
    align-items: center;

    .title{
      display: inline-block;
      text-transform: lowercase;
      font-size: 40px;
      color: ${styles.color.white};
      padding-left: ${styles.spacing.small};
      text-align: left;
      margin: 0;
      position: relative;

      .primary{ font-weight: 300; }
      .seconary{ font-weight: 700; }
    }
  }
`

TitleSection.propTypes = {
  style: PropTypes.instanceOf(Object),
  title: PropTypes.string,
  titleSecondary: PropTypes.string
}
