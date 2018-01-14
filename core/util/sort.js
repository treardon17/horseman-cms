const _ = require('lodash')

class SortUtil {
  /**
   * [makeListFromObjectKeys Takes an object and creates a list of objects {key, value} from that object]
   * @param  {[Object]} object [The object the list will be created from]
   * @return {[Array]}        [A list of {key, value} pairs]
   */
  makeListFromObjectKeys({ object }) {
    const list = []
    const keys = Object.keys(object)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      list.push({ key, value: object[key] })
    }
    return list
  }

  /**
   * [getObjectProperty Retrieves a nested object]
   * @param  {[Object]} object  [The object to be searched]
   * @param  {[Array]} idArray [A list of IDs that describe the path to the nested object]
   * @return {[Any]}         [The nested object value]
   */
  getObjectProperty({ object, idArray }) {
    let tempObject = object
    for (let i = 0; i < idArray.length; i++) {
      const id = idArray[i]
      tempObject = tempObject[id]
    }
    return tempObject
  }

  /**
   * [sortListByObjectProperty Takes a list and sorts it by the property given]
   * @param  {[Array]} list     [The list to be sorted]
   * @param  {[String]} property [The property on that list to sort by]
   * @return {[Array]}          [The sorted list]
   */
  sortListByObjectProperty({ list, idArray }) {
    list.sort((a, b) => {
      return this.getObjectProperty({ object: a, idArray }) - this.getObjectProperty({ object: b, idArray })
    })
    return list
  }
}

module.exports = new SortUtil()
