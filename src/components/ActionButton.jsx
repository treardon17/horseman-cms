import React from 'react'
import IconButton from 'material-ui/IconButton'
import ISVG from 'react-inlinesvg'
import PropTypes from 'prop-types'
import _ from 'lodash'
import styled from 'styled-components'
import styles from '../styles'

export default class ActionButton extends React.Component {
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
      <ActionButtonComponent className="action-button">
        <ButtonComponent onClick={this.buttonClicked.bind(this)}>
          <ISVG
            style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto', height: 24, width: 24 }}
            className="item-icon"
            src={this.props.icon}
          />
        </ButtonComponent>
      </ActionButtonComponent>
    )
  }
}

// STYLES
// const StyledIconButton = styled(IconButton)``
const ButtonComponent = styled.div`
  cursor: pointer;
  border-radius: 100%;
  background-color: ${styles.color.shade1};
  width: ${styles.spacing.large};
  height: ${styles.spacing.large};
  transition: background-color ${styles.transition.slow} ease-in-out;

  &:hover{
    background-color: ${styles.color.shade2};
  }

  svg{
    stroke: ${styles.color.white};
  }
`

const ActionButtonComponent = styled(({ ...rest }) => {
  return <div {...rest} />
})
`
  border: 2px solid ${styles.color.white};
  border-radius: 100%;
`

ActionButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}
