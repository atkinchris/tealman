class Request {
  /**
   * @constructs Request
   * @param {number} id
   * @param {string} origin
   * @param {object} data
   */
  constructor (id, origin, data) {
    this.id = id
    this.origin = origin
    this.data = this.sortData(data)
  }

  /**
   * @param {object} data
   * @returns {object}
   *
   * Sorts data in alphabetical order.
   */
   sortData (data) {
    const orderedData = []
    Object.keys(data)
      .sort()
      .forEach(name => orderedData.push({
        name,
        value: data[name]
      }))
    return orderedData
  }

  /**
   * @param {string} name
   * @returns {string|null}
   */
   getDataVariable (name) {
    var value = null
    const searchResult = this.data.find(element => element.name === name)
    if (searchResult) {
      value = searchResult.value
    }
    return value
  }
}