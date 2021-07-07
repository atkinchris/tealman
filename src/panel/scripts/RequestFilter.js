class RequestFilter {
  /**
   * @constructs RequestFilter
   * @param {string} origin
   * @param {string} urlPattern
   * @param {function} parseData
   * @param {boolean} [active]
   */
  constructor (origin, urlPattern, parseData, active = true) {
    this.origin = origin
    this.urlPattern = urlPattern
    this.parseData = parseData
    this.active = active
  }

  /**
   * @returns {string}
   *
   * Accessor for the {origin} property.
   */
  getOrigin () {
    return this.origin
  }

  /**
   * @returns {object}
   *
   * Accessor for the {urlPattern} property.
   */
  getUrlPattern () {
    return this.urlPattern
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
   * Toggler for the {active} property.
   */
  toggleActive () {
    this.active = !this.active
  }
}