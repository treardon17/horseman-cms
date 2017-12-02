import _ from 'lodash';
import Util from '../util/util';

export default class ObjectType {
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

    if (!this.data) { this.data = { }; }
    if (!this.orderBy) { this.orderBy = Object.keys((this.parent.data || {})).length; }
    if (!this.id) { this.id = Util.guid(); }

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
    const keys = Object.keys(this.data);
    for (let i = 0; i < keys.length; i++) {
      let staticData = this.data[keys[i]];
      // If the data hasn't been made into an object yet
      if (typeof staticData === 'string') {
        staticData = JSON.parse(staticData);
      }
      // Make a new ObjectType based on the data provided
      const dataObject = new ObjectType(staticData, this);
      // Replace the static data with the new dynamic object
      this.data[keys[i]] = dataObject;
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
   * @return {void}
   */
  add(data) {
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
  edit({ slug, data = {} }) {
    const dataCopy = this.data[slug];
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
  remove({ slug }) {
    // Remember which index we removed
    const removedIndex = this.data[slug].orderBy;
    // Get rid of the item from the parts object
    delete this.data[slug];
    // Reorder all the other objects to reflect the change in index
    this.reorder({ newIndex: -1, slug });
  }


  /**
   * reorder - Changes the orderBy attribute to a new position and propagates the change to the other data attributes
   *
   * @param  {type} newIndex description   The index that will replace the current index
   * @param  {type} slug     description   The slug to the item that will be moved
   * @return {void}
   */
  reorder({ newIndex, slug }) {
    const dataLength = Object.keys(this.data).length;
    if (!this.data[slug]) {
      console.warn(`Reorder Warn: Object ${slug} does not exist in ${this.name}'s data`);
      return;
    } else if (newIndex === this.data[slug].orderBy) {
      // No point in reordering if we don't need to
      return;
    }

    // Get the current ordered array of objects
    const dataList = this.getOrderedList();
    // Set the selected object's orderBy attribute here
    this.data[slug].orderBy = newIndex;
    // Reset all of the other orderBy attributes based on their new position
    let reorderIndex = 0;
    for (let i = 0; i < dataList.length; i++) {
      const dataItem = dataList[i];
      if (dataItem.key !== slug) {
        if (newIndex === 0 && i === 0) {
          reorderIndex += 1;
        } else if (reorderIndex === newIndex) {
          reorderIndex += 1;
        }
        this.data[dataItem.key].orderBy = reorderIndex;
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
    this.slug = Util.findUniqueSlug({ slug: name, object: this.parent.data || {} });
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
    const arr = Object.keys(this.data).map(key => ({ key, data: this.data[key] }));
    arr.sort((a, b) => a.data.orderBy - b.data.orderBy);
    return arr;
  }

  /**
   * get - Gets an object from the data object
   *
   * @param  {String} slug - A unique ID for the object
   * @return {ObjectType}      The ObjectType found at the specified slug
   */
  get(slug) {
    return this.data[slug];
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
    const keys = Object.keys(this.data);
    for (let i = 0; i < keys.length; i++) {
      clone.data[keys[i]] = clone.data[keys[i]].getOrphanCopy();
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
    const json = JSON.stringify(clone);
    return json;
  }
}
