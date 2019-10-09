class TealiumIQ {
  /**
   * @returns {string}
   */
  static getOrigin () {
    return 'Tealium iQ'
  }

  /**
   * @returns {object}
   */
  static getUrlPattern () {
    return /tealiumiq\.com(.*)\/i\.gif/
  }

  /**
   * @param {object} req
   * @returns {object|null}
   * 
   * Parses Tealium iQ payload into JSON.
   */
  static parseData (req) {
    let data = null
    if (req && req.request && req.request.postData && req.request.postData.text) {
      const text = req.request.postData.text
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}') + 1
      data = JSON.parse(text.substring(start, end)).data
    }
    return data
  }
}