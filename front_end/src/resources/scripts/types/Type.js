import _ from 'lodash';

let ORDER_COUNT = 0;

export default class Type {
  /**
   * constructor
   *
   * @param  {type} { name } description   The name of the type being created
   */
  constructor({ name = '' } = {}) {
    this.name = name;
    this.parts = { };
    this.id = this.guid();
  }

  /* eslint-disable */
  guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}${s4()}`;
  }
  /* eslint-enable */


  /**
   * findUniqueSlug - Finds a unique hash in the `parts` Object
   * so we don't override an existing object
   *
   * @param  {String} { slug } description   The string that will be tested
   * @return {String}          description   A unique hash for the `parts` object
   */
  findUniqueSlug({ slug }) {
    const key = _.camelCase(slug);
    // If a slug already exists
    if (this.parts[key] != null) {
      // If there's already a number at the end
      const pattern = /([0-9]+)/i;
      const matches = key.match(pattern);

      let slugNum = 1;
      let newSlug = key;
      if (matches) {
        // Replace the current number and increment it
        slugNum = parseInt(matches[1]) + 1;
        newSlug = newSlug.replace(matches[0], '');
      }

      // Return the new number and check if it's available
      return this.findUniqueSlug({ slug: `${newSlug}${slugNum}` });
    } else {
      return key;
    }
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
    const slug = this.findUniqueSlug({ slug: name });
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
      orderBy: ORDER_COUNT++,
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
        const newSlug = this.findUniqueSlug({ slug: name });
        this.parts[newSlug] = part;
        if (newSlug !== slug) {
          delete this.parts[slug];
        }
      }
    } else {
      console.error('Cannot edit null object');
    }
  }

  remove({ name }) {
    delete this.parts[name];
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
Type.types.object = 'object';
Type.types.number = 'number';
Type.types.double = 'double';
Type.types.int = 'integer';
Type.types.richText = 'richText';
Type.types.image = 'image';
Type.types.audio = 'audio';
Type.types.video = 'video';
