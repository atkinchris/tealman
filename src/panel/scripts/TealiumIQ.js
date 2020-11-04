class TealiumIQ extends Hit {
  static ORIGIN = 'Tealium iQ'
  static PATTERN = /tealiumiq\.com(.*)\/i\.gif/

  /**
   * @param {object} req
   * @returns {object}
   *
   * @todo
   */
  static parseData = req => {
    let data = null
    if (req && req.request && req.request.postData && req.request.postData.text) {
      const text = req.request.postData.text
      const start = text.indexOf('{')
      const end = text.lastIndexOf('}') + 1
      data = JSON.parse(text.substring(start, end)).data
    }
    return data
  }

  /**
   * @constructs TealiumIQ
   * @param {number} id
   * @param {object} data
   */
  constructor (id, data) {
    super(id, data)
    this.origin = TealiumIQ.ORIGIN
    this.icon = '<img src="../images/tealium.png" alt="Tealium iQ">'
    this.type = /view/i.test(this.getDataVariable('ut.event')) ? 'Pageview' : 'Event'
    this.profile = this.getDataVariable('ut.profile')
    this.environment = this.getDataVariable('ut.env')
  }
}