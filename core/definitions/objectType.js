const _ = require('lodash');
const IDUtil = require('../util/id');

class ObjectType {
  /**
   * [constructor Construct the object]
   * @param  {Object} [arg={}]    [The arg object should contain at least a `name` attribute]
   * @param  {Object} [parent={}] [The parent object containing this object (so we can find unique slugs)]
   */
  constructor(arg = {}, parent = {}) {
    // parent is the object (if any) that this current ObjectType
    // is living inside
    this.parent = parent
    this.setup(arg)
  }

  /**
   * [setup Copies the data from the object passed in, into the current object]
   * @param  {[type]} arg [The object to be copied]
   */
  setup(arg) {
    // Copy attributes from object passed in
    for (const key in arg) {
      if (key === 'name') this.setName({ name: arg[key] })
      else this[key] = arg[key]
    }

    if (!this.children) this.children = { }
    if (!this.orderBy) this.orderBy = Object.keys((this.parent.children || {})).length
    if (!this.id) this.id = IDUtil.guid()
    if (!this.name) this.setName({ name: 'New Type' })
    if (!this.type) this.type = { primary: ObjectType.types.empty, secondary: ObjectType.types.empty }

    // We never want to mutate this ID
    Object.freeze(this.id)

    // Construct the children of this object if there are any
    this.constructChildren()
  }

  /**
   * [constructChildren Build out all of the children to be instances ObjectType]
   */
  constructChildren() {
    for (const key in this.children) {
      let staticData = this.children[key]
      // If the data hasn't been made into an object yet
      if (typeof staticData === 'string') staticData = JSON.parse(staticData)
      // Make a new ObjectType based on the data provided
      const dataObject = new ObjectType(staticData, this)
      // Replace the static data with the new dynamic object
      this.children[key] = dataObject
    }
  }

  /**
   * [add Add properties to the type object]
   * @param {[ObjectType || object]} data [Can be a regular object, or an ObjectType]
   * @return {[String]} The ID of the object type
   */
  add(data) {
    // Create a new ObjectType using the data given,
    // add it to the children of the current object
    // and return the ID that was generated
    const newObject = new ObjectType(data, this)
    this.children[newObject.id] = newObject
    return newObject.id
  }

  /**
   * [edit Edit properties on the object]
   * @param  {[ObjectType || object]} data [Can be a regular object, or an ObjectType]
   * @return {[type]}      [description]
   */
  edit(data) {
    const { id } = data
    const dataCopy = this.children[id]
    // If we even have data for that slug
    if (dataCopy) {
      for (const key in data) {
        // We don't want to set the slug/name here because there's a
        // special function that handles those
        if (key !== 'slug' && key !== 'name') dataCopy[key] = data[key]
      }
      // If the name changed, we need to change the slug
      if (data.name && data.name !== dataCopy.name) {
        // Change the part location to be at the new slug
        this.children[id].setName({ name: data.name })
      }
      this.children[id] = dataCopy
    } else {
      console.warn(`Doesn't look like there's any thing with the id: ${id} in this ObjectType`)
    }
  }

  /**
   * [remove Removes a type from the parent object and reorders the types]
   * @param  {[String]} id [The string ID of the item to be deleted]
   */
  remove({ id }) {
    // Get rid of the item from the parts object and then
    // reorder all the other objects to reflect the change in index
    delete this.children[id]
    this.reorder({ newIndex: -1, id })
  }

  /**
   * [reorder Changes the orderBy attribute to a new position and propagates the change to the other data attributes]
   * @param  {[Int]} newIndex [The index that will replace the current index]
   * @param  {[type]} id       [The id to the item that will be moved]
   */
  reorder({ newIndex, id }) {
    const dataLength = Object.keys(this.children).length
    if (!this.children[id]) {
      console.warn(`Reorder Warn: Object ${id} does not exist in ${this.name}'s data`)
      return
    } else if (newIndex === this.children[id].orderBy) {
      // No point in reordering if we don't need to
      return
    }

    // Get the current ordered array of objects
    const dataList = this.getOrderedList()
    // Set the selected object's orderBy attribute here
    this.children[id].orderBy = newIndex
    // Reset all of the other orderBy attributes based on their new position
    let reorderIndex = 0
    for (let i = 0; i < dataList.length; i++) {
      const dataItem = dataList[i]
      if (dataItem.key !== id) {
        if (newIndex === 0 && i === 0) {
          reorderIndex += 1
        } else if (reorderIndex === newIndex) {
          reorderIndex += 1
        }
        this.children[dataItem.key].orderBy = reorderIndex;
        reorderIndex += 1
      }
    }
  }

  // -----------------------------
  // SETTERS
  // -----------------------------
  /**
   * [setName Finds a unique slug for the object based on the name given]
   * @param {[type]} name [The new name]
   */
  setName({ name }) {
    this.name = name
    this.slug = IDUtil.findUniqueSlug({ slug: name, object: this.parent.children || {}, attribute: 'slug' })
  }

  // -----------------------------
  // GETTERS
  // -----------------------------
  /**
   * [getOrderedList Gets the items in data based on the orderBy attribute]
   * @return {[Array]} [An array of objects containing the key modified and the data of that object]
   */
  getOrderedList() {
    const arr = Object.keys(this.children).map(key => ({ key, data: this.children[key] }))
    arr.sort((a, b) => a.data.orderBy - b.data.orderBy)
    return arr
  }

  /**
   * [get Gets an object from the data object]
   * @param  {[String]} id [The unique ID for the object]
   * @return {[ObjectType]}    [The ObjectType found at the specified ID]
   */
  get(id) {
    return this.children[id]
  }

  /**
   * [getOrphanCopy JSON.stringify can't deal with circular structures, so this removes all of the parent objects]
   * @return {[ObjectType]} [An ObjectType without the circular reference to parent]
   */
  getOrphanCopy() {
    // Make a deep clone of this so we don't mutate our current object
    const clone = _.cloneDeep(this)
    // Delete the parent object so the structure isn't circular any longer
    delete clone.parent
    // Do this for all children as well
    for (const key in this.children) clone.children[key] = clone.children[key].getOrphanCopy()
    // All children now have no parent
    return clone
  }

  /**
   * [getJSON Makes a JSON string of the current object]
   * @return {[JSON]} [A stringified version of the object]
   */
  getJSON() {
    const clone = this.getOrphanCopy()
    const json = JSON.stringify(clone, null, 2)
    return json
  }

/**
 * [createObjectInstance Creates an object using the scheme defined in the ObjectType]
 * @return {[Object]}                       [The object instance]
 */
  createObjectInstance() {
    const object = {}

    // We need to give it an ID and a typeID
    object._id = IDUtil.guid()
    object._typeID = this.id
    object._slug = this.slug

    for (const key in this.children) {
      const child = this.children[key]

      // If the child has children, it's just another object
      if (Object.keys(child.children).length > 0) {
        object[child.slug] = child.buildEmptyObject()
      } else if (child.type.primary === ObjectType.types.string) {
        // Otherwise we take the type that the object has and create an empty version of it
        object[child.slug] = ''
      } else if (child.type.primary === ObjectType.types.list) {
        object[child.slug] = []
      } else if (child.type.primary === ObjectType.types.number) {
        object[child.slug] = Number.MIN_SAFE_INTEGER
      } else if (child.type.primary === ObjectType.types.empty) {
        object[child.slug] = '__empty__'
      }
    }

    return object
  }


  /**
   * [updateExistingObjectSchema Takes an existing object and updates the schema to reflect the current schema]
   * @param  {[Object]} [object={}}] [The object that will be updated]
   * @return {[Object]}                [The updated object]
   */
  updateExistingObjectSchema({ object }) {
    let objectCopy = object
    // If we actually have an existing object we're trying to modify
    if (object) {
      const currentSchemaObject = this.createObjectInstance();
      // Check to make sure it's the right type of object
      if (objectCopy._typeID === this.id) {
        // If the parent slug changed, we want to reflect that change to the object we're re-creating
        objectCopy._slug = this.slug
        // Go through the different properties and make sure we don't keep
        // a property if that property was deleted
        IDUtil.trimObject(objectCopy, currentSchemaObject)
        // If any new fields were added to the object type, add them to the object,
        // but override the values of the new object with those of the existing object
        objectCopy = Object.assign({}, currentSchemaObject, objectCopy)
      } else {
        console.warn(`Object of type ${objectCopy._typeID} does not match ${this.name} of type ${this.id}`)
      }
    }
    return objectCopy
  }
}



// Setup static constant definitions of ObjectTypes
ObjectType.types = { }
ObjectType.types.object = 'object'
ObjectType.types.empty = 'empty'
ObjectType.types.string = 'string'
ObjectType.types.list = 'list'
ObjectType.types.module = 'module'
ObjectType.types.number = 'number'
ObjectType.types.double = 'double'
ObjectType.types.int = 'integer'
ObjectType.types.richText = 'richText'
ObjectType.types.image = 'image'
ObjectType.types.audio = 'audio'
ObjectType.types.video = 'video'

module.exports = ObjectType;
