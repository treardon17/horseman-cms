const _ = require('lodash');
const IDUtil = require('../util/id');

class ObjectType {
  /**
   * constructor - description  Construct the object
   *
   * @param  {type} arg = {}    description
   * The arg object should contain at least a `name` attribute
   *
   * @param  {type} parent = {} description
   * The parent object containing this object (so we can find unique slugs)
   *
   * @return {type}             description
   */
  constructor(arg = {}, parent = {}) {
    // parent is the object (if any) that this current ObjectType
    // is living inside
    this.parent = parent;
    this.setup(arg);
  }

  /**
   * setup - Copies the data from the object passed in, into the current object
   *
   * @param  {object} arg the object to be copied
   * @return {void}
   */
  setup(arg) {
    // Copy attributes from object passed in
    const keys = Object.keys(arg);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key === 'name') {
        this.setName({ name: arg[key] });
      } else {
        this[key] = arg[key];
      }
    }

    if (!this.children) { this.children = { }; }
    if (!this.orderBy) { this.orderBy = Object.keys((this.parent.children || {})).length; }
    if (!this.id) { this.id = IDUtil.guid(); }
    if (!this.type) { this.type = { primary: ObjectType.types.empty, secondary: ObjectType.types.empty }; }

    // We never want to mutate this ID
    Object.freeze(this.id);

    // Construct the children of this object if there are any
    this.constructChildren();
  }


  /**
   * constructChildren - Build out all of the children to be instances ObjectType
   *
   * @return {type}  description
   */
  constructChildren() {
    const keys = Object.keys(this.children);
    for (let i = 0; i < keys.length; i++) {
      let staticData = this.children[keys[i]];
      // If the data hasn't been made into an object yet
      if (typeof staticData === 'string') {
        staticData = JSON.parse(staticData);
      }
      // Make a new ObjectType based on the data provided
      const dataObject = new ObjectType(staticData, this);
      // Replace the static data with the new dynamic object
      this.children[keys[i]] = dataObject;
    }
  }

  generateProxy({ slug, data }) {
    const proxy = new Proxy(data, {
      get: (target, name, receiver) => {
        const rv = target[name];
        return rv;
      }
    });
    this[slug] = proxy;
  }

  /**
   * add - Add properties to the type object
   *
   * @param  {String} name          description   Name of the new property being added to this type
   * @return {String} The ID of the object type
   */
  add(data) {
    const newObject = new ObjectType(data, this);
    this.children[newObject.id] = newObject;
    return newObject.id;
  }

  /**
   * edit - Edit an existing property of the Type object
   *
   * @param  {type} slug      description   The ID of the object being modified in this.children
   * @param  {type} data = {} description   The new data containing what will be updated on the current data
   * @return {type}           description
   */
  edit({ id, data = {} }) {
    const dataCopy = this.children[id];
    // If we even have data for that slug
    if (dataCopy) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== 'slug' && key !== 'name') {
          dataCopy[key] = data[key];
        }
      }
      // If the name changed, we need to change the slug
      if (data.name !== dataCopy.name) {
        // Change the part location to be at the new slug
        this.children[id].setName({ name: data.name });
      }
      this.children[id] = dataCopy;
    } else {
      console.warn(`Doesn't look like there's any thing with the id: ${id} in this ObjectType`);
    }
  }

  /**
   * remove - Removes an item from this.children
   *
   * @param  {type} slug description   The ID of the item to be removed
   * @return {void}
   */
  remove({ id }) {
    // Remember which index we removed
    const removedIndex = this.children[id].orderBy;
    // Get rid of the item from the parts object
    delete this.children[id];
    // Reorder all the other objects to reflect the change in index
    this.reorder({ newIndex: -1, id });
  }


  /**
   * reorder - Changes the orderBy attribute to a new position and propagates the change to the other data attributes
   *
   * @param  {type} newIndex description   The index that will replace the current index
   * @param  {type} slug     description   The slug to the item that will be moved
   * @return {void}
   */
  reorder({ newIndex, id }) {
    const dataLength = Object.keys(this.children).length;
    if (!this.children[id]) {
      console.warn(`Reorder Warn: Object ${id} does not exist in ${this.name}'s data`);
      return;
    } else if (newIndex === this.children[id].orderBy) {
      // No point in reordering if we don't need to
      return;
    }

    // Get the current ordered array of objects
    const dataList = this.getOrderedList();
    // Set the selected object's orderBy attribute here
    this.children[id].orderBy = newIndex;
    // Reset all of the other orderBy attributes based on their new position
    let reorderIndex = 0;
    for (let i = 0; i < dataList.length; i++) {
      const dataItem = dataList[i];
      if (dataItem.key !== id) {
        if (newIndex === 0 && i === 0) {
          reorderIndex += 1;
        } else if (reorderIndex === newIndex) {
          reorderIndex += 1;
        }
        this.children[dataItem.key].orderBy = reorderIndex;
        reorderIndex += 1;
      }
    }
  }

  // -----------------------------
  // SETTERS
  // -----------------------------
  /**
   * setName - Finds a unique slug for the object based on the name given
   *
   * @param  {string} { name } description - The new name
   * @return {void}
   */
  setName({ name }) {
    this.name = name;
    this.slug = IDUtil.findUniqueSlug({ slug: name, object: this.parent.children || {}, attribute: 'slug' });
  }

  // -----------------------------
  // GETTERS
  // -----------------------------
  /**
   * getOrderedList - Gets the items in data based on the orderBy attribute
   *
   * @return {Array of objects}  description   An array of objects containing the key modified and the data of that object
   */
  getOrderedList() {
    const arr = Object.keys(this.children).map(key => ({ key, data: this.children[key] }));
    arr.sort((a, b) => a.children.orderBy - b.children.orderBy);
    return arr;
  }

  /**
   * get - Gets an object from the data object
   *
   * @param  {String} slug - A unique ID for the object
   * @return {ObjectType}      The ObjectType found at the specified slug
   */
  get(id) {
    return this.children[id];
  }

  /**
   * getOrphanCopy - JSON.stringify can't deal with circular structures, so we remove all of the parent objects
   *
   * @return {type}  description
   */
  getOrphanCopy() {
    // Make a deep clone of this so we don't mutate our current object
    const clone = _.cloneDeep(this);
    // Delete the parent object so the structure isn't circular any longer
    delete clone.parent;
    // Do this for all children as well
    const keys = Object.keys(this.children);
    for (let i = 0; i < keys.length; i++) {
      clone.children[keys[i]] = clone.children[keys[i]].getOrphanCopy();
    }
    // All children now have no parent
    return clone;
  }

  /**
   * getJSON - Get a string version of the current object
   *
   * @return {String}  description   A JSON representation of the object
   */
  getJSON() {
    const clone = this.getOrphanCopy();
    const json = JSON.stringify(clone, null, 4);
    return json;
  }

  createObjectInstance(existingObject = null) {
    const existingObjectCopy = existingObject;
    const object = {};

    // If we're not re-creating an object that's already been made,
    // wee need to give it an ID and a typeID
    if (!existingObjectCopy) {
      object._id = IDUtil.guid();
      object._typeID = this.id;
      object._slug = this.slug;
    }

    const keys = Object.keys(this.children);
    for (let i = 0; i < keys.length; i++) {
      const child = this.children[keys[i]];

      // If the child has children, it's just another object
      if (Object.keys(child.children).length > 0) {
        object[child.slug] = child.buildEmptyObject();
      } else if (child.type.primary === ObjectType.types.string) {
        // Otherwise we take the type that the object has and create an empty version of it
        object[child.slug] = '';
      } else if (child.type.primary === ObjectType.types.list) {
        object[child.slug] = [];
      } else if (child.type.primary === ObjectType.types.number) {
        object[child.slug] = Number.MIN_SAFE_INTEGER;
      } else if (child.type.primary === ObjectType.types.empty) {
        object[child.slug] = '__empty__';
      }
    }

    // If we have an existing object we're trying to re-create
    if (existingObjectCopy) {
      // Check to make sure it's the right type of object
      if (existingObjectCopy._typeID === this.id) {
        // If the parent slug changed, we want to reflect that change to the object we're re-creating
        existingObjectCopy._slug = this.slug;
        // If any new fields were added to the object type, add them to the object,
        // but override the values of the new object with those of the existing object
        Object.assign(object, existingObjectCopy);
      } else {
        console.warn(`Object of type ${existingObjectCopy._typeID} does not match ${this.name} of type ${this.id}`);
      }
    }

    // We have a set structure, so the attributes shouldn't be modified after initial creation
    Object.preventExtensions(object);
    return object;
  }
}


// Setup static constant definitions of ObjectTypes
ObjectType.types = { };
ObjectType.types.object = 'object';
ObjectType.types.empty = 'empty';
ObjectType.types.string = 'string';
ObjectType.types.list = 'list';
ObjectType.types.module = 'module';
ObjectType.types.number = 'number';
ObjectType.types.double = 'double';
ObjectType.types.int = 'integer';
ObjectType.types.richText = 'richText';
ObjectType.types.image = 'image';
ObjectType.types.audio = 'audio';
ObjectType.types.video = 'video';

module.exports = ObjectType;
