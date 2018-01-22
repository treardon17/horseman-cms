import React from 'react'
import Proptypes from 'prop-types'
import _ from 'lodash'
import WindowUtil from '../../core/util/window'

import Select from 'react-select'
import Button from 'material-ui/Button'
import ContentEditable from 'react-simple-contenteditable'
import ISVG from 'react-inlinesvg'
import TrashButton from './TrashButton'
import { VelocityTransitionGroup } from 'velocity-react'
import Creator from './Creator'

import TypeState from '../state/TypeState'
import ObjectType from '../../core/definitions/objectType'

import styled from 'styled-components'
import styles from '../styles'

export default class CreateType extends Creator {
  constructor(props) {
    super(props)

    this.state = {
      ...super.state,
      current: this.props.type || new ObjectType({ name: 'Module title', typePrimary: ObjectType.types.object }),
    }
  }

  /**
   * getFields - Based on the properties of this type, this determines the fields to show
   *
   * @return {list}  list of UI elements
   */
  getFields() {
    // Get all of the slugs from the type.parts
    // If we don't have an ordered array, React gets its references
    // all messed up. So we keep an orderBy property on each part so
    // it works like it's supposed to.
    // DO NOT REMOVE THIS OR EVERYTHING GOES TO HELL
    const partsArray = this.state.current.getOrderedList()
    const slugs = Object.keys(this.state.current.children)
    const fields = []

    // This is the formatting for all of the fields in the module type
    for (let i = 0; i < partsArray.length; i++) {
      // const id = partsArray[i].key
      const part = partsArray[i].data

      // Only give the option to edit the secondary type if the primary
      // type is a list or an object
      let secondaryType = null
      if (part.typePrimary === ObjectType.types.module || part.typePrimary === ObjectType.types.list) {
        secondaryType = (
          <Select
            key={`field-type-secondary-${part.id}-${i}`}
            value={part.typeSecondary}
            className={'secondary-type'}
            options={TypeState.getFormattedTypeList(part.typePrimary)}
            onChange={(val) => { this.handleChangePart({ val: (val ? val.value : Type.types.empty), partID: 'typeSecondary', typeID: part.id }) }}
          />
        )
      }

      fields.push(
        <div className="field" key={`module-field-${part.id}`}>
          <div className="name-container">
            <ContentEditable
              key={`field-name-${part.id}-${i}`}
              html={part.name}
              className={`field-name input-field`}
              onClick={WindowUtil.highlightAll}
              onFocus={WindowUtil.highlightAll}
              onChange={(e, val) => { this.handleChangePart({ event: e, val, partID: 'name', typeID: part.id }) }}
              contentEditable="plaintext-only"
            />
            <div className="slug-name sub-text">{part.slug}</div>
          </div>
          <Select
            key={`field-type-primary-${part.id}-${i}`}
            value={part.typePrimary}
            className={'primary-type'}
            options={TypeState.getFormattedTypeList('primary')}
            onChange={(val) => { this.handleChangePart({ val: (val ? val.value : Type.types.empty), partID: 'typePrimary', typeID: part.id }) }}
          />
          {secondaryType}
          <ContentEditable
            key={`field-description-${part.id}-${i}`}
            html={part.description}
            className={`field-description input-field`}
            onClick={WindowUtil.highlightAll}
            onFocus={WindowUtil.highlightAll}
            onChange={(e, val) => { this.handleChangePart({ event: e, val, partID: 'description', typeID: part.id }) }}
            contentEditable="plaintext-only"
          />
          <TrashButton onClick={() => { this.removeField(part.id) }} />
        </div>
      )
    }
    return fields
  }

  // ---------------------------------
  // EDIT OPERATIONS
  // ---------------------------------
  /**
   * editTypeState - Convenience method. When user makes changes to the type,
   * this method will make the save/cancel buttons appear
   *
   * @param  {type} type description
   * @return {type}      description
   */
  editTypeState(type) {
    this.setState({
      type,
      needSave: true,
    })
  }


  /**
   * handleChangePart - When the user is changing values, this makes it easy to
   * reflect those changes in the type object by specifying which field is changing
   * and what the new value is
   *
   * @param  {type} event description
   * @param  {type} val     description
   * @param  {type} partID  description
   * @param  {type} subPartID If there's a nested object we need to access
   * @param  {type} typeID  The ID of the item being edited
   * @return {type}         description
   */
  handleChangePart({ event, val, partID, subPartID, typeID }) {
    this.saveStateIfNeeded()
    const type = this.state.current
    const editObject = {}
    editObject[partID] = val
    editObject.id = typeID
    type.edit(editObject)
    this.editTypeState(type)
  }


  /**
   * addProperty - Adds a new empty field to the type
   *
   * @return {void}
   */
  addProperty() {
    this.saveStateIfNeeded()
    const type = this.state.current
    type.add()
    this.editTypeState(type)
  }


  /**
   * removeField - Removes an existing field from the type
   *
   * @param  {string} slug - the unique identifier of the field being removed
   * @return {void}
   */
  removeField(id) {
    this.saveStateIfNeeded()
    const type = this.state.current
    type.remove({ id })
    this.editTypeState(type)
  }


  /**
   * handleNameChange - Changes the name of the module
   *
   * @param  {string} val - new name
   * @return {void}
   */
  handleNameChange(val) {
    this.saveStateIfNeeded()
    const type = this.state.current
    type.setName({ name: val })
    this.editTypeState(type)
  }


  /**
   * save - Saves the changes the user made to the server
   *
   * @return {void}
   */
  save() {
    // Save the current type to the server
    TypeState.addOrUpdateType(this.state.current).then(() => {
      super.save()
    })
  }

  removeModule() {
    let id = ''
    if (this.state.current.prev) {
      id = this.state.prev.id
    } else {
      id = this.state.current.id
    }
    TypeState.removeType(id)
  }

  persistentButtons() {
    return [
      <Button key="add-field" className="square-button" onClick={this.addProperty.bind(this)}>Add Field</Button>
    ]
  }

  render() {
    // We need this ternary here because of the content editable fields.
    // If we cancel the operation, the content editable fields do
    // not rerender to the correct values
    const content = this.state.revert
      ? null
      : (
        <div className="construct-type">
          <div className="module-title-container">
            <ISVG className="module-icon" src="/assets/img/featherIcons/layout.svg" />
            <div className="module-title-data">
              <ContentEditable
                key="module-title"
                html={this.state.current.name}
                className="module-title input-field"
                onClick={WindowUtil.highlightAll}
                onFocus={WindowUtil.highlightAll}
                onChange={(e, val) => { this.handleNameChange(val) }}
                contentEditable="plaintext-only"
              />
              <h3 className="module-slug sub-text">{this.state.current.slug}</h3>
            </div>
            <div className="module-settings-container">
              <div className="remove-module" onClick={() => { this.removeModule() }}>
                <ISVG className="remove-icon" src="/assets/img/featherIcons/trash.svg" />
              </div>
            </div>
          </div>
          <div className="constructor-container">
            <VelocityTransitionGroup
              leave={{ animation: { opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }, duration: 300 }}
              enter={{ animation: { opacity: 1, height: 77, paddingTop: 10, paddingBottom: 10 }, duration: 300 }}
              runOnMount
            >
              {this.getFields()}
            </VelocityTransitionGroup>
          </div>
          <div className="button-container">
            {this.getButtons()}
          </div>
        </div>
      )

    return (
      <CreateTypeComponent>
        <VelocityTransitionGroup
          leave={{ animation: { opacity: 0 }, duration: 300, complete: () => { this.setState({ revert: false }) } }}
          enter={{ animation: { opacity: 1 }, duration: 300 }}
          runOnMount
        >
          {content}
        </VelocityTransitionGroup>
      </CreateTypeComponent>
    )
  }
}

// STYLES
const svgSize = '20px'
const CreateTypeComponent = styled.div`
  margin: ${styles.spacing.small};

  .remove-icon{
    svg{
      width: ${svgSize};
      height: ${svgSize};
    }
  }

  .module-title-container{
    position: relative;
    padding: ${styles.spacing.small/2} ${styles.spacing.small};
    background-color: ${styles.color.shade1};
    display: flex;
    align-items: center;

    .module-icon{
      svg{
        width: 50px;
        height: 50px;
        stroke: ${styles.color.shade3};
      }
    }

    .module-title-data{
      margin: ${styles.spacing.medium};

      .module-title{
        display: block;
        font-size: 30px;
        font-weight: bold;
        outline: none;
        text-align: left;
        color: ${styles.color.shade3};
        min-width: 100px;
        border-bottom: ${styles.border.regular};
        margin-bottom: ${styles.spacing.small};
        padding-bottom: ${styles.spacing.small};
      }
      .module-slug{
        text-align: left;
      }
    }

    .module-settings-container{
      position: absolute;
      top: 0; bottom: 0; right: ${styles.spacing.small};
      display: flex;
      justify-content: center;
      align-items: center;
      .remove-module{
        svg{
          stroke: ${styles.color.shade3};
          transition: stroke ${styles.transition.slow} ease-in-out;
          &:hover{ stroke: ${styles.color.shade2}; }
        }
        .remove-icon{
          cursor: pointer;
        }
      }
    }
  }
  .constructor-container{
    .field{
      position: relative;
      background-color: ${styles.color.shade3};
      padding: ${styles.spacing.small};
      border-top: 1px solid rgba(${styles.color.base}, 0.2);
      display: flex;
      align-items: center;

      .field-name, .slug-name, .Select{
        width: 150px;
        max-width: 90%;
        text-align: left;
        margin-right: ${styles.spacing.medium};
      }

      .name-container{
        .field-name{
          border-bottom: ${styles.border.regular};
          margin-bottom: ${styles.spacing.small/2};
        }

        .slug-name{
        }
      }

      .Select{
        position: relative;
        z-index: 200;
        &-menu-outer{
        }
      }

      .field-description{
        max-width: 200px;
        overflow: auto;
        user-select: all;
      }

      .trash-button{
        cursor: pointer;
        margin: auto;
        position: absolute;
        top: 0; bottom: 0; right: ${styles.spacing.small};
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .button-container{
    display: flex;
    button{
      margin: 0 2px 0 0;
      flex: 1;

      &:last-of-type{
        margin-right: 0;
      }
    }
  }
`

CreateType.propTypes = {
  type: Proptypes.object,
}
