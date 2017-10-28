
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
   * add - Add properties to the type object
   *
   * @param  {String} name          description   Name of the new property being added to this type
   * @param  {Type}   primary       description   The primary type of the property
   * @param  {Type}   secondary     description   If the primary type is an object or list, this is used to specify what the object or list contains
   * @param  {type}   description   description   A description of the property being added
   * @return {void}
   */
  add({ name = 'default', primary = Type.empty, secondary = null, description } = {}) {
    // Seconary types should only be specified for object types
    // or for list types that require additional information
    let skip = false;
    if (secondary && (primary !== Type.object && primary !== Type.list)) {
      skip = true;
      console.warn(`Seconary type not permitted when the Primary type is not of type ${Type.object} or ${Type.list}`);
    }
    this.parts[name] = {
      primary: primary || Type.empty,
      seconary: !skip ? (secondary || Type.empty) : Type.empty,
      description: description || '',
    };
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
