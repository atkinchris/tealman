class GoogleAnalytics {
  /**
   * @returns {string}
   */
  static getOrigin () {
    return 'Google Analytics'
  }

  /**
   * @returns {object}
   */
  static getUrlPattern () {
    return /google\-analytics\.com\/(r\/)?collect/
  }

  /**
   * @returns {string}
   */
  static getHitTypeParameterName () {
    return GoogleAnalytics.getParameterMap().t
  }

  /**
   * @returns {string}
   */
  static getTrackingIdParameterName () {
    return GoogleAnalytics.getParameterMap().tid
  }

  /**
   * @returns {object}
   * @see {@link https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters|Measurement Protocol Parameter Reference}
   */
  static getParameterMap () {
    return {
      aid: 'Application ID',
      aip: 'Anonymize IP',
      an: 'Application Name',
      av: 'Application Version',
      cc: 'Campaign Content',
      ci: 'Campaign ID',
      cid: 'Client ID',
      ck: 'Campaign Keyword',
      cm: 'Campaign Medium',
      cn: 'Campaign Name',
      cs: 'Campaign Source',
      cu: 'Currency Code',
      de: 'Document Encoding',
      dh: 'Document Host Name',
      dl: 'Document Location URL',
      dp: 'Document Path',
      dr: 'Document Referrer',
      dt: 'Document Title',
      ea: 'Event Action',
      ec: 'Event Category',
      el: 'Event Label',
      ev: 'Event Value',
      fl: 'Flash Version',
      ic: 'Item Code',
      in: 'Item Name',
      ip: 'Item Price',
      iq: 'Item Quantity',
      je: 'Java Enabled',
      sd: 'Screen Colors',
      sr: 'Screen Resolution',
      t: 'Hit Type',
      ti: 'Transaction ID',
      tid: 'Tracking ID',
      tr: 'Transaction Revenue',
      ts: 'Transaction Shipping',
      tt: 'Transaction Tax',
      uid: 'User ID',
      ul: 'User Language',
      v: 'Protocol Version',
      vp: 'Viewport Size',
      z: 'Cache Buster'
    }
  }

  /**
   * @param {object} req
   * @returns {object|null}
   * 
   * Parses Google Analytics payload into JSON.
   */
  static parseData (req) {
    let data = null
    if (req && req.request && req.request.method) {
      data = {}
      const method = req.request.method.trim().toLowerCase()
      if (method === 'get' && req.request.queryString) {
        req.request.queryString.forEach(parameter => {
          data[`${decodeURIComponent(parameter.name)}`] = decodeURIComponent(parameter.value)
        })
      } else if (method === 'post' && req.request.postData && req.request.postData.text) {
        req.request.postData.text.split('&')
          .forEach(text => {
            const textSplit = text.split('=')
            data[`${decodeURIComponent(textSplit[0])}`] = `${decodeURIComponent(textSplit[1])}`
          })
      }
      const parameterMap = GoogleAnalytics.getParameterMap()
      Object.keys(data)
        .forEach(name => {
          const map = parameterMap[name]
          if (map) {
            data[map] = data[name]
            delete data[name]
          } else if (/^cd\d+/.test(name)) {
            let index = parseInt(name.match(/\d+/)[0])
            if (index < 10) {
              index = `00${index}`
            } else if (index < 100) {
              index = `0${index}`
            }
            data[`Custom Dimension ${index}`] = data[name]
            delete data[name]
          }
        })
    }
    return data
  }
}