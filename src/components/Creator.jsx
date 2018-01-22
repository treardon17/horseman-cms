import React from 'react'
import Proptypes from 'prop-types'
import _ from 'lodash'
import Button from 'material-ui/Button'

export default class Creator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      prev: null,
      current: null,
      needSave: false,
      revert: false,
    }
  }

  /**
   * getButtons - Gets the buttons (add, save, cancel) based on state and if
   * changes have been made
   *
   * @return {list}  the buttons to be displayed
   */
  getButtons() {
    const buttons = this.persistentButtons()

    const classNames = this.state.needSave ? `square-button active-button` : `square-button inactive-button`
    buttons.push(<Button key="save-type" className={classNames} onClick={this.save.bind(this)}>Save</Button>)
    buttons.push(<Button key="cancel-type" className={classNames} onClick={this.cancel.bind(this)}>Cancel</Button>)
    return buttons
  }

  /**
  * [persistentButtons The buttons that will be persistent]
  * @return {[type]} [A list of persistent buttons]
  */
  persistentButtons() {
    return []
  }

  // ---------------------------------
  // SAVE AND CANCEL OPERATIONS
  // ---------------------------------

  /**
   * saveStateIfNeeded - When the user makes changes, this should be called before
   * any of those changes are saved so that the user can cancel their Changes
   * and have them reverted to this previous saved state
   *
   * @return {type}  description
   */
  saveStateIfNeeded() {
    // We have the current, unedited version of state
    if (!this.state.needSave) {
      this.setState({
        prev: _.cloneDeep(this.state.current),
        needSave: true,
      })
    }
  }

  /**
   * save - Sets the state to saved
   *
   * @return {void}
   */
  save() {
    this.setState({
      prevType: null,
      needSave: false,
    })
  }


  /**
   * cancel - Reverts the changes made by the user to the state before the changes were made
   *
   * @return {void}
   */
  cancel() {
    // Grab our last state and keep that as the current type
    const current = this.state.prev
    this.setState({
      revert: true,
    }, () => {
      this.setState({
        current,
        prevType: null,
        needSave: false,
      })
    })
  }
}
