class Utils {
  /**
   * @param {number} number
   * @returns {string}
   *
   * Takes a 1-digit or a 2-digit number and casts it to a string. If the number
   * is less than 10, adds a leading 0.
   */
  static addLeadingZero (number) {
    return (number < 10) ? (`0${number}`).slice(-2) : `${number}`
  }

  /**
   * @param {string} text
   */
  // static copyToClipboard (text) {
  //   // @todo
  // }

  /**
   * @param {object} data
   * @param {string} caption
   * @returns {object}
   */
  static createDataTable (data, caption) {
    const table = document.createElement('table')
    table.innerHTML = data.reduce((accumulator, row) => {
      return accumulator + `
        <tr>
          <td>${row.name}</td>
          <td>${row.value}</td>
        </tr>
      `
    }, '')
    const details = document.createElement('details')
    details.setAttribute('class', 'data-table')
    details.innerHTML = `
      <summary>${caption}</summary>
      ${table.outerHTML}
    `
    return details
  }

  /**
   * @returns {string}
   *
   * Returns the current timestamp in the yyyy-MM-ddThh:mm:ss format.
   */
  static getTimestamp () {
    const now = new Date()
    const year = now.getFullYear()
    const month = Utils.addLeadingZero(now.getMonth() + 1)
    const day = Utils.addLeadingZero(now.getDate())
    const hours = Utils.addLeadingZero(now.getHours())
    const minutes = Utils.addLeadingZero(now.getMinutes())
    const seconds = Utils.addLeadingZero(now.getSeconds())
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }

  /**
   * @param {*} value
   * @returns {boolean}
   *
   * Returns true if the specified value is one of the following:
   *   1. Undefined
   *   2. Empty string
   *   3. Null
   *   4. Empty object
   *   5. Empty array
   */
  static isEmpty (value) {
    let isEmpty = false
    if (typeof value === 'undefined') {
      isEmpty = true
    } else if (typeof value === 'string' && value.trim() === '') {
      isEmpty = true
    } else if (typeof value === 'object') {
      if (value === null) {
        isEmpty = true
      } else if (Object.entries(value).length === 0
        && value.constructor === Object) {
        isEmpty = true
      } else if (Array.isArray(value) && value.length === 0) {
        isEmpty = true
      }
    }
    return isEmpty
  }
}