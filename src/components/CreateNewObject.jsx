// Helpers
import React from 'react'
import Proptypes from 'prop-types'
import Creator from './Creator'
import { Button } from '../styles/buttons'
import Select from 'react-select'
import SortUtil from '../../core/util/sort'
import IDUtil from '../../core/util/id'
import _ from 'lodash'

// State
import DataState from '../state/DataState'
import TypeState from '../state/TypeState'

// Definitions
import ObjectType from '../../core/definitions/objectType'

// Modules
import CreateObject from './CreateObject'

import styled from 'styled-components'
import styles from '../styles'

/**
 * Flow ---
 * 1. user select which type they want to create an instance of
 *
 * 2. grab type definition and loop through children
 *
 * 3. if child typePrimary is anything other than a list, object, or module,
 *    grab the appropriate input box and display it
 *
 * 4. if child typePrimary is an object, or module, make another CreateObject
 *    instance and display those input fields tabbed over a little bit
 *
 * 5. if child typePrimary is a list, show an 'add' button that either displays
 *    a simple input field like those mentioned above but defined in the typeSecondary,
 *    or creates another CreateObject instance of whatever type is specified
 *    in the typeSecondary
 *
 * ** Note **
 * This is a recursively defined class, so be wary of infinite recursion.
 */

export default class CreateNewObject extends Creator {
  constructor(props) {
    super(props)

    this.state = {
      ...super.state,
      current: null,
      moduleTypeToAdd: null,
    }
  }

  setObject(objectType) {
    this.setState({
      moduleTypeToAdd: objectType
    }, () => {
      if (this.state.moduleTypeToAdd) {
        const typeDef = TypeState.userMadeTypes.get(this.state.moduleTypeToAdd.value)
        if (!this.state.current || (this.state.current && this.state.current._typeID !== typeDef.id)) {
          const objectInstance = typeDef.createObjectInstance()
          this.setState({ current: objectInstance })
        }
      }
    })
  }

  save() {
    DataState.addOrUpdateData(this.state.current).then((updatedData) => {
      super.save()
    })
  }

  render() {
    let objectCreator = null
    if (this.state.current) {
      // We give it a unique key so that the constructor is called everytime
      // --> we want it to create a new object if a different item was selected
      objectCreator = (<CreateObject key={IDUtil.guid()} childObject={this.state.current} />)
    }
    return (
      <div className="create-new-object">
        <Select
          value={this.state.moduleTypeToAdd}
          className={'type-selector'}
          options={TypeState.getFormattedTypeList(ObjectType.types.module)}
          onChange={(val) => { this.setObject(val) }}
        />
        {objectCreator}
      </div>
    )
  }
}

// STYLES
const CreateNewObjectComponent = styled.div`
  margin: ${styles.spacing.small};
  stroke: ${styles.color.shade3};

  .list-container{
    margin-left: ${styles.spacing.small};
  }
`

CreateNewObject.propTypes = { }
