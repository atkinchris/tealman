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

  /**
   * @returns {object}
   */
  createHeader () {
    const details = document.createElement('details')
    details.innerHTML = `
      <summary>
        <div class="request-header">
          <div class="request-id">${this.id}</div>
          <div class="request-type">${this.type}</div>
          <div class="request-origin">${[this.icon, this.origin].join('')}</div>
          <div class="request-account">${this.account}</div>
          <div class="request-timestamp">${Utils.getTimestamp()}</div>
          <div class="request-select">
            <a href="#" class="iconbtn iconbtn-dark">
              <i class="fas fa-square hidden"></i>
              <i class="fas fa-check-square"></i>
            </a>
          </div>
        </div>
      </summary>
    `
    return details
  }
}