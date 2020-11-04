class GoogleAnalytics extends Hit {
  static ORIGIN = 'Google Analytics'
  static PATTERN = /google\-analytics\.com\/(r\/)?collect/

  /**
   * @param {object} req
   * @returns {object}
   *
   * @todo
   */
  static parseData = req => {
    // @todo
  }

  /**
   * @constructs GoogleAnalytics
   * @param {number} id
   * @param {object} data
   */
  constructor (id, data) {
    super(id, data)
    this.origin = GoogleAnalytics.ORIGIN
  }
}