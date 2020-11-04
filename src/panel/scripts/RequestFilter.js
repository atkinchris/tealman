class RequestFilter {
  /**
   * @constructs RequestFilter
   * @param {string} hitSubClass
   * @param {boolean} active
   */
  constructor (hitSubClass, active = true) {
    this.hitSubClass = hitSubClass
    this.active = active
    this.origin = window[hitSubClass].ORIGIN
    this.pattern = window[hitSubClass].PATTERN
    this.parseData = window[hitSubClass].parseData
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

  /**
   * @param {string} url
   * @returns {boolean}
   *
   * Returns whether the specified URL matches this RequestFilter's pattern.
   */
  hasMatch (url) {
    return this.pattern.test(url)
  }
}