const _ = require('lodash')

class IDUtil {
  /**
   * findUniqueSlug - Finds a unique hash in the Object
   * so we don't override an existing object
   *
   * @param  {String} { slug } description   The string that will be tested
   * @param  {String} { attribute } description   An attribute of the object that should checked rather than the object keys
   * @return {String}          description   A unique hash
   */
  findUniqueSlug({ slug, object, attribute }) {
    const key = _.camelCase(slug)
    // We're only searching through the object's keys
    if (!attribute) {
      // If a slug already exists
      if (object[key] != null) {
        const newSlug = this.incrementStringIfNeeded(key)
        // Return the new number and check if it's available
        return this.findUniqueSlug({ slug: newSlug, object })
      } else {
        // We found a unique object key
        return key
      }
    } else {
      // We're searching through the object's children looking for the attribute provided
      const items = Object.keys(object).map(objKey => object[objKey][attribute])
      // There's a string that's equal to the slug we passed in
      // so let's try again
      if (items.indexOf(key) !== -1) {
        const newSlug = this.incrementStringIfNeeded(key)
        return this.findUniqueSlug({ slug: newSlug, object, attribute })
      } else {
        // We found a unique object key
        return key
      }
    }
  }

/**
 * [incrementStringIfNeeded Takes a string and appends a number to the end. If a number
 * already exists, it increments that number]
 *
 * @param  {[String]} string [The string the number will be appended to]
 * @return {[String]}        [The modified string]
 */
  incrementStringIfNeeded(string) {
    // If there's already a number at the end
    const pattern = /([0-9]+)/i
    const matches = string.match(pattern)

    let slugNum = 1
    let newSlug = string
    if (matches) {
      // Replace the current number and increment it
      slugNum = parseInt(matches[1]) + 1
      newSlug = newSlug.replace(matches[0], '')
    }
    return `${newSlug}${slugNum}`
  }

  /**
   * [trimObject Deletes all keys/values from the first object that don't exist in the second object]
   * @param  {[Object]} obj1 [The object that will be modified]
   * @param  {[Object]} obj2 [The object that will act as the schema]
   */
  trimObject(obj1, obj2) {
    for (const key in obj1) {
      // All keys that begin with _ are variables that shouldn't
      // be modified here (they're reserved)
      if (key.length > 0 && key[0] !== '_') {
        if (obj2[key] == null) {
          delete obj1[key]
        } else if (obj1[key] instanceof Array && obj2[key] instanceof Array) {
          break
        } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          this.trimObject(obj1[key], obj2[key])
        }
      }
    }
  }

  mergeObject({ object, idArray, newVal }) {
    const idArrayCopy = idArray.slice();
    let value = this.nestedObject({ object, idArray: idArrayCopy, newVal });
    while (idArrayCopy && idArrayCopy.length > 1) {
      idArrayCopy.pop();
      value = this.nestedObject({ object, idArray: idArrayCopy, newVal: value });
    }
    return value;
  }

  nestedObject({ object, idArray, newVal = null }) {
    let value = _.cloneDeep(object);
    for (let i = 0; i < idArray.length; i++) {
      const id = idArray[i];
      if ((newVal || newVal === '' || newVal === 0) && i === idArray.length - 1) {
        value[id] = newVal;
      } else {
        // Get the next nested value
        value = value[id];
      }
    }
    return value;
  }

  /**
   * [guid Generates a unique string ID]
   * @return {[String]} [Unique ID]
   */
   /* eslint-disable */
  guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return `${s4()}${s4()}-${s4()}${s4()}-${s4()}${s4()}`
  }
  /* eslint-enable */
}

module.exports = new IDUtil()
