import _ from 'lodash';
import IDUtil from '../util/id';

export default class ObjectType {
  constructor (arg, parent = {}) {
    // parent is the object (if any) that this current ObjectType
    // is living inside
    this.parent = parent
    this.setup(arg);
  }

  /**
   * setup - Copies the data from the object passed in, into the current object
   *
   * @param  {object} arg the object to be copied
   * @return {void}
   */
  setup (arg) {
    // Copy attributes from object passed in
    const keys = Object.keys(arg);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (key === 'name') {
        this.setTypeName({ name: arg[key] });
      } else {
        this[key] = arg[key];
      }
    }

    if (!this.id) { this.id = Util.guid(); }
    if (!this.data) { this.data = { }; }
    if (!this.orderBy) { this.orderBy = Object.keys(this.parent).length; }
    this.constructChildren();
  }

  constructChildren () {
    const keys = Object.keys(this.data);
    for (let i = 0; i < keys.length; i++) {
      let staticData = this.data[keys[i]];
      // If the data hasn't been made into an object yet
      if (typeof staticData === 'string') {
        staticData = JSON.parse(staticData)
      }
      // Make a new ObjectType based on the data provided
      const dataObject = new ObjectType(staticData, this);
      // Replace the static data with the new dynamic object
      this.data[keys[i]] = dataObject;
    }
  }

  /**
   * add - Add properties to the type object
   *
   * @param  {String} name          description   Name of the new property being added to this type
   * @return {void}
   */
  add ({ data }) {
    const newObject = new ObjectType(data, this);
    this.data[newObject.slug] = newObject;
  }

  /**
   * edit - Edit an existing property of the Type object
   *
   * @param  {type} slug      description   The ID of the object being modified in this.data
   * @param  {type} data = {} description   The new data containing what will be updated on the current data
   * @return {type}           description
   */
  edit ({ slug, data = {} }) {
    const dataCopy = this.data[slug]
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
        const newSlug = Util.findUniqueSlug({ slug: data.name, object: this.data });
        this.data[newSlug] = dataCopy;
        // Delete the old object if the ID is different
        if (newSlug !== dataCopy.slug) {
          delete this.data[slug];
        }
      } else {
        // Otherwise we just want to update the data to the newest version
        this.data[slug] = dataCopy;
      }
    } else {
      console.warn(`Doesn't look like there's any thing named ${slug} in this ObjectType`);
    }
  }

  /**
   * remove - Removes an item from this.data
   *
   * @param  {type} slug description   The ID of the item to be removed
   * @return {void}
   */
  remove ({ slug }) {
    // Remember which index we removed
    const removedIndex = this.data[slug].orderBy;
    // Get rid of the item from the parts object
    delete this.data[slug];
    // Reorder all the other objects to reflect the change in index
    const orderedParts = this.getOrderedList();
    for (let i = 0; i < orderedParts.length; i++) {
      const ID = orderedParts.key;
      this.data[ID].orderBy = i;
    }
  }

  reorder ({ newIndex, slug }) {
    // Get an ordered list from this.getOrderedList()
    // Not including the object at this.data[slug]
    // Loop through the list
    // If the newIndex is equal to the current index in the loop
    // Increment the index of every item after that
  }

  /**
   * setTypeName - Finds a unique slug for the object based on the name given
   *
   * @param  {string} { name } description - The new name
   * @return {void}
   */
  setTypeName ({ name }) {
    this.name = name;
    this.slug = Util.findUniqueSlug({ slug: name, object: TypeState.userMadeTypes });
  }

  /**
   * getOrderedList - Gets the items in data based on the orderBy attribute
   *
   * @return {Array of objects}  description   An array of objects containing the key modified and the data of that object
   */
  getOrderedList () {
    const arr = Object.keys(this.data).map((key) => {
      return {
        key,
        data: this.data[key]
      }
    });
    arr.sort((a, b) => a.data.orderBy - b.data.orderBy);
    return arr;
  }

  getJSON () {
    return JSON.stringify(this);
  }
}
