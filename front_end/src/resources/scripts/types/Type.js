import _ from 'lodash';

let ID_COUNT = 0;

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
  add({ name = 'New field', primary = Type.empty, secondary = null, description = 'Field description' } = {}) {
    const slug = this.findUniqueSlug({ slug: name });
    // Secondary types should only be specified for object types
    // or for list types that require additional information
    let skip = false;
    if (secondary && (primary !== Type.object && primary !== Type.list)) {
      skip = true;
      console.warn(`Secondary type not permitted when the Primary type is not of type ${Type.object} or ${Type.list}`);
    }
    this.parts[slug] = {
      name,
      primary: primary || Type.empty,
      secondary: !skip ? (secondary || Type.empty) : Type.empty,
      description: description || '',
      id: ID_COUNT++,
    };
  }

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

      // Change the part location to be at the new slug
      const newSlug = this.findUniqueSlug({ slug: name });
      this.parts[newSlug] = part;
      if (newSlug !== slug) {
        delete this.parts[slug];
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
Type.empty = 'empty';
Type.string = 'string';
Type.list = 'list';
Type.object = 'object';
Type.number = 'number';
Type.double = 'double';
Type.int = 'integer';
