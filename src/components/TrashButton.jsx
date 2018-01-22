import React from 'react'
import IconButton from 'material-ui/IconButton'
import ISVG from 'react-inlinesvg'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import styles from '../styles'

export default class TrashButton extends React.Component {
  constructor(props) {
    super(props)
  }

  buttonClicked(event) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event)
    }
  }

  render() {
    return (
      <TrashButtonStyles onClick={this.buttonClicked.bind(this)} >
        <ISVG className="trash-icon" src="/assets/img/featherIcons/trash.svg" />
      </TrashButtonStyles>
    )
  }
}

// STYLES
const TrashButtonStyles = styled.div.attrs({ className: 'trash-button' })`
  cursor: pointer;
  margin: auto;
  top: 0; bottom: 0; right: ${styles.spacing.small};
  display: flex;
  justify-content: center;
  align-items: center;

  .trash-icon{
    svg{ stroke: ${styles.color.base}; }
  }
`

TrashButton.propTypes = {
  onClick: PropTypes.func.isRequired,
}
