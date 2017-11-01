import _ from 'lodash';

class Util {
  /**
   * findUniqueSlug - Finds a unique hash in the Object
   * so we don't override an existing object
   *
   * @param  {String} { slug } description   The string that will be tested
   * @return {String}          description   A unique hash for the `parts` object
   */
  findUniqueSlug({ slug, object }) {
    const key = _.camelCase(slug);
    // If a slug already exists
    if (object[key] != null) {
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
      return this.findUniqueSlug({ slug: `${newSlug}${slugNum}`, object });
    } else {
      return key;
    }
  }

  /* eslint-disable */
  guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}${s4()}`;
  }
  /* eslint-enable */
}

const singleton = new Util();
export default singleton;
