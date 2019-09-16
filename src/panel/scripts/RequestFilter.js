class RequestFilter {
  /**
   * @constructs RequestFilter
   * @param {string} origin
   * @param {string} urlPattern
   * @param {function} parseData
   * @param {boolean} active
   */
  constructor (origin, urlPattern, parseData, active) {
    this.origin = origin
    this.urlPattern = urlPattern
    this.parseData = parseData
    this.active = active
  }

  /**
   * @returns {boolean}
   * 
   * Returns whether this RequestFilter is active.
   */
  isActive () {
    return this.active
  }

  /**
   * @param {boolean} active
   * 
   * Toggler for the active property.
   */
  toggleActive () {
    this.active = !this.active
  }
}