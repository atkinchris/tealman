class Utils {
  /**
   * @param {number} number
   * @returns {string}
   *
   * Takes a number (1-digit or 2-digit) and casts it to a string. If the number is less than 10, adds a leading 0.
   */
  static addLeadingZero (number) {
    return (number < 10) ? (`0${number}`).slice(-2) : `${number}`
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
   * @param {object} data
   * @returns {object}
   *
   * Sorts data in alphabetical order.
   */
  static sortData = data => {
    const orderedData = []
    Object.keys(data)
      .sort()
      .forEach(name => orderedData.push({
        name,
        value: data[name]
      }))
    return orderedData
  }
}