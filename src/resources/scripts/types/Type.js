import _ from 'lodash';
import Util from '../util/util';
import TypeState from '../../../state/TypeState.js';

export default class Type {
  /**
   * constructor
   *
   * @param  {type} { name } description   The name of the type being created
   */
  constructor(arg = { }) {
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
    if (!this.parts) { this.parts = { }; }
  }

  /**
   * add - Add properties to the type object
   *
   * @param  {String} name          description   Name of the new property being added to this type
   * @param  {Type}   primary       description   The primary type of the property
   * @param  {Type}   secondary     description   If the primary type is an object or list, this is used to specify what the object or list contains
   * @param  {type}   description   description   A description of the property being added
   * @return {void}
   */
  add({ name = 'New field', primary = Type.types.empty, secondary = null, description = 'Field description' } = {}) {
    const slug = Util.findUniqueSlug({ slug: name, object: this.parts });
    // Secondary types should only be specified for object types
    // or for list types that require additional information
    let skip = false;
    if (secondary && (primary !== Type.types.object && primary !== Type.types.list)) {
      skip = true;
      console.warn(`Secondary type not permitted when the Primary type is not of type ${Type.types.object} or ${Type.types.list}`);
    }
    this.parts[slug] = {
      name,
      primary: primary || Type.types.empty,
      secondary: !skip ? (secondary || Type.types.empty) : Type.types.empty,
      description: description || '',
      orderBy: Object.keys(this.parts).length,
    };
  }

  /**
   * edit - Edit an existing property of the Type object
   *
   * @param  {type} { slug }  description   Unique ID for the property being edited
   * @param  {type} { name }  description   Name of the property
   * @param  {type} { primary }  description   Primary type of the property
   * @param  {type} { secondary }  description   If the type of the property is a list or an object, more information may be needed (list of what, or object of what type?)
   * @param  {type} { description }  description   Description of the property being edited
   * @return {void}
   */
  edit(arg = { }) {
    const { slug = '', name, primary, secondary, description } = arg || {};
    // If we changed the name, we change the slug
    const part = this.parts[slug];
    // Set the new values if they exist
    if (part) {
      const keys = Object.keys(arg);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key !== 'slug') {
          part[key] = arg[key];
        }
      }

      // Reset the secondary type if the primary type is not
      // a list or an object
      if (part.primary !== Type.types.object && part.primary !== Type.types.list) {
        part.secondary = Type.types.empty;
      }

      // If the name changed, we need to change the slug
      if (name) {
        // Change the part location to be at the new slug
        const newSlug = Util.findUniqueSlug({ slug: name, object: this.parts });
        this.parts[newSlug] = part;
        if (newSlug !== slug) {
          delete this.parts[slug];
        }
      }
    } else {
      console.error('Cannot edit null object');
    }
  }

  setTypeName({ name }) {
    this.name = name;
    this.slug = Util.findUniqueSlug({ slug: name, object: TypeState.userMadeTypes });
  }

  getOrderedList() {
    const arr = Object.keys(this.parts).map(key => [key, this.parts[key]]);
    arr.sort((a, b) => a[1].orderBy - b[1].orderBy);
    return arr;
  }

  remove({ name }) {
    // Remember which index we removed
    const removedIndex = this.parts[name].orderBy;
    // Get rid of the item from the parts object
    delete this.parts[name];
    // Reorder all the other objects to reflect the change in index
    const orderedParts = this.getOrderedList();
    for (let i = 0; i < orderedParts.length; i++) {
      const partName = orderedParts[i][0];
      const part = orderedParts[i][1];
      if (part.orderBy > removedIndex) {
        this.parts[partName].orderBy -= 1;
      }
    }
  }

  getJSON() {
    return JSON.stringify(this);
  }
}

// Setup static constant definitions of types
Type.types = { };
Type.types.empty = 'empty';
Type.types.string = 'string';
Type.types.list = 'list';
Type.types.module = 'module';
Type.types.number = 'number';
Type.types.double = 'double';
Type.types.int = 'integer';
Type.types.richText = 'richText';
Type.types.image = 'image';
Type.types.audio = 'audio';
Type.types.video = 'video';
