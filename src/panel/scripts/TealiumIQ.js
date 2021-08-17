class TealiumIQ extends Request {
  /**
   * @constructs TealiumIQ
   * @extends Request
   * @param {number} id
   * @param {object} data
   */
  constructor (id, data) {
    super(id, TealiumIQ.getOrigin(), data)
    this.setVariables()
    this.groupData()
  }

  /**
   * @returns {string}
   */
  getHitType () {
    let hitType = ''
    const utEvent = this.getDataVariable('ut.event')
    const tealiumEvent = this.getDataVariable('tealium_event')
    const map = new Map()
    map.set('view', 'Pageview')
    map.set('link', 'Event')
    if (utEvent) {
      hitType = map.get(utEvent) || 'Custom'
    } else if (tealiumEvent) {
      hitType = map.get(tealiumEvent) || 'Custom'
    }
    return hitType
  }

  /**
   * @todo: Add description.
   */
  setVariables () {
    this.type = this.getHitType()
    this.icon = '<img src="../images/tealium-iq.png" alt="TiQ">'
    this.account = [this.getDataVariable('ut.profile')
      , this.getDataVariable('ut.env')].join(' / ')
  }

  /**
   * @todo: Add description.
   */
  groupData () {
    const map = ['_cbrand', '_ccat', '_ccat2', '_ccity', '_ccountry'
      , '_ccurrency', '_ccustid', '_corder', '_cpdisc', '_cprice', '_cprod'
      , '_cprodname', '_cpromo', '_cquan', '_cship', '_csku', '_cstate'
      , '_cstore', '_csubtotal', '_ctax', '_ctotal', '_ctype', '_czip']
    const ec = this.data.filter(v => map.includes(v.name))
    const js = this.data.filter(v => /^js_page\./i.test(v.name))
    const qp = this.data.filter(v => /^qp\./i.test(v.name))
    const cp = this.data.filter(v => /^cp\./i.test(v.name))
    const meta = this.data.filter(v => /^meta\./i.test(v.name))
    const dom = this.data.filter(v => /^dom\./i.test(v.name))
    const ut = this.data.filter(v => /^(tealium_|ut\.)/i.test(v.name))
    const timing = this.data.filter(v => /^timing\./i.test(v.name))
    const general = this.data.filter(v => !map.includes(v.name)
      && !/^(js_page\.|qp\.|cp\.|meta\.|dom\.|tealium_|ut\.|timing\.)/i
      .test(v.name))
    this.data = [{
      group: 'General',
      data: general,
    }, {
      group: 'E-commerce',
      data: ec,
    }, {
      group: 'JavaScript Variables',
      data: js,
    }, {
      group: 'Querystring Parameters',
      data: qp,
    }, {
      group: 'First-Party Cookies',
      data: cp,
    }, {
      group: 'Metadata Elements',
      data: meta,
    }, {
      group: 'Built-in Page Data',
      data: dom,
    }, {
      group: 'Built-in Tealium Data',
      data: ut,
    }, {
      group: 'Timing',
      data: timing,
    }].filter(element => element.data && element.data.length)
  }

  /**
   * @returns {object}
   */
  createDomElement () {
    const container = document.createElement('div')
    container.setAttribute('class', 'request')
    container.dataset.id = this.id
    const header = this.createHeader()
    this.data.forEach(element => {
      header.appendChild(Utils.createDataTable(element.data, element.group))
    })
    container.appendChild(header)
    return container
  }

  /**
   * @returns {string}
   */
  static getOrigin () {
    return 'Tealium iQ'
  }

  /**
   * @returns {string}
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
      Object.keys(data).forEach(key => {
        if (Utils.isEmpty(data[key])) {
          delete data[key]
        }
      })
      console.log(data)
    }
    return data
  }
}