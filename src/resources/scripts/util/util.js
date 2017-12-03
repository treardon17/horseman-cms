import _ from 'lodash';

class Util {
  /**
   * findUniqueSlug - Finds a unique hash in the Object
   * so we don't override an existing object
   *
   * @param  {String} { slug } description   The string that will be tested
   * @param  {String} { attribute } description   An attribute of the object that should checked rather than the object keys
   * @return {String}          description   A unique hash
   */
  findUniqueSlug({ slug, object, attribute }) {
    const key = _.camelCase(slug);
    // We're only searching through the object's keys
    if (!attribute) {
      // If a slug already exists
      if (object[key] != null) {
        const newSlug = this.incrementStringIfNeeded(key);
        // Return the new number and check if it's available
        return this.findUniqueSlug({ slug: newSlug, object });
      } else {
        // We found a unique object key
        return key;
      }
    } else {
      // We're searching through the object's children looking for the attribute provided
      const items = Object.keys(object).map(objKey => object[objKey][attribute]);

      // There's a string that's equal to the slug we passed in
      // so let's try again
      if (items.indexOf(slug) !== -1) {
        const newSlug = this.incrementStringIfNeeded(key);
        return this.findUniqueSlug({ slug: newSlug, object, attribute });
      } else {
        // We found a unique object key
        return key;
      }
    }
  }

  incrementStringIfNeeded(string) {
    // If there's already a number at the end
    const pattern = /([0-9]+)/i;
    const matches = string.match(pattern);

    let slugNum = 1;
    let newSlug = string;
    if (matches) {
      // Replace the current number and increment it
      slugNum = parseInt(matches[1]) + 1;
      newSlug = newSlug.replace(matches[0], '');
    }
    return `${newSlug}${slugNum}`;
  }

  /* eslint-disable */
  guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}${s4()}-${s4()}${s4()}-${s4()}${s4()}`;
  }
  /* eslint-enable */
}

const singleton = new Util();
export default singleton;
