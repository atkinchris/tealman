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
   * @returns {object}
   * @see {@link https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters|Measurement Protocol Parameter Reference}
   */
  static getGroups () {
    return {
      gen: 'General',
      u: 'User',
      s: 'Session',
      tfcSrc: 'Traffic Sources',
      sys: 'System Info',
      h: 'Hit',
      ci: 'Content Information',
      app: 'App Tracking',
      e: 'Event Tracking',
      ec: 'E-commerce',
      soc: 'Social Interactions',
      t: 'Timing',
      ex: 'Exceptions',
      cd: 'Custom Dimensions',
      cm: 'Custom Metrics',
      o: 'Other'
    }
  }

  /**
   * @returns {object}
   * @see {@link https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters|Measurement Protocol Parameter Reference}
   */
  static getKeys () {
    const group = GoogleAnalytics.getGroups()
    return {
      v: { name: 'Protocol Version', group: group.gen },
      tid: { name: 'Tracking ID', group: group.gen },
      aip: { name: 'Anonymize IP', group: group.gen },
      ds: { name: 'Data Source', group: group.gen },
      qt: { name: 'Queue Time', group: group.gen },
      z: { name: 'Cache Buster', group: group.gen },
      cid: { name: 'Client ID', group: group.u },
      uid: { name: 'User ID', group: group.u },
      sc: { name: 'Session Control', group: group.s },
      uip: { name: 'IP Override', group: group.s },
      ua: { name: 'User Agent Override', group: group.s },
      geoid: { name: 'Geographical Override', group: group.s },
      dr: { name: 'Document Referrer', group: group.tfcSrc },
      cn: { name: 'Campaign Name', group: group.tfcSrc },
      cs: { name: 'Campaign Source', group: group.tfcSrc },
      cm: { name: 'Campaign Medium', group: group.tfcSrc },
      ck: { name: 'Campaign Keyword', group: group.tfcSrc },
      cc: { name: 'Campaign Content', group: group.tfcSrc },
      ci: { name: 'Campaign ID', group: group.tfcSrc },
      gclid: { name: 'Google Ads ID', group: group.tfcSrc },
      dclid: { name: 'Google Display Ads ID', group: group.tfcSrc },
      sr: { name: 'Screen Resolution', group: group.sys },
      vp: { name: 'Viewport Size', group: group.sys },
      de: { name: 'Document Encoding', group: group.sys },
      sd: { name: 'Screen Colors', group: group.sys },
      ul: { name: 'User Language', group: group.sys },
      je: { name: 'Java Enabled', group: group.sys },
      fl: { name: 'Flash Version', group: group.sys },
      t: { name: 'Hit Type', group: group.h },
      ni: { name: 'Non-Interaction Hit', group: group.h },
      dl: { name: 'Document location URL', group: group.ci },
      dh: { name: 'Document Host Name', group: group.ci },
      dp: { name: 'Document Path', group: group.ci },
      dt: { name: 'Document Title', group: group.ci },
      cd: { name: 'Screen Name', group: group.ci },
      linkid: { name: 'Link ID', group: group.ci },
      an: { name: 'Application Name', group: group.app },
      aid: { name: 'Application ID', group: group.app },
      av: { name: 'Application Version', group: group.app },
      aiid: { name: 'Application Installer ID', group: group.app },
      ec: { name: 'Event Category', group: group.e },
      ea: { name: 'Event Action', group: group.e },
      el: { name: 'Event Label', group: group.e },
      ev: { name: 'Event Value', group: group.e },
      ti: { name: 'Transaction ID', group: group.ec },
      ta: { name: 'Transaction Affiliation', group: group.ec },
      tr: { name: 'Transaction Revenue', group: group.ec },
      ts: { name: 'Transaction Shipping', group: group.ec },
      tt: { name: 'Transaction Tax', group: group.ec },
      in: { name: 'Item Name', group: group.ec },
      ip: { name: 'Item Price', group: group.ec },
      iq: { name: 'Item Quantity', group: group.ec },
      ic: { name: 'Item Code', group: group.ec },
      iv: { name: 'Item Category', group: group.ec },
      pa: { name: 'Product Action', group: group.ec },
      tcc: { name: 'Coupon Code', group: group.ec },
      pal: { name: 'Product Action List', group: group.ec },
      cos: { name: 'Checkout Step', group: group.ec },
      col: { name: 'Checkout Step Option', group: group.ec },
      promoa: { name: 'Promotion Action', group: group.ec },
      cu: { name: 'Currency Code', group: group.ec },
      sn: { name: 'Social Network', group: group.soc },
      sa: { name: 'Social Action', group: group.soc },
      st: { name: 'Social Action Target', group: group.soc },
      utc: { name: 'User timing category', group: group.t },
      utv: { name: 'User timing variable name', group: group.t },
      utt: { name: 'User timing time', group: group.t },
      utl: { name: 'User timing label', group: group.t },
      plt: { name: 'Page Load Time', group: group.t },
      dns: { name: 'DNS Time', group: group.t },
      pdt: { name: 'Page Download Time', group: group.t },
      rrt: { name: 'Redirect Response Time', group: group.t },
      tcp: { name: 'TCP Connect Time', group: group.t },
      srt: { name: 'Server Response Time', group: group.t },
      dit: { name: 'DOM Interactive Time', group: group.t },
      clt: { name: 'Content Load Time', group: group.t },
      exd: { name: 'Exception Description', group: group.ex },
      exf: { name: 'Is Exception Fatal?', group: group.ex }
    }
  }

  /**
   * @returns {string}
   */
  static getHitTypeParameterName () {
    return GoogleAnalytics.getKeys().t.name
  }

  /**
   * @returns {string}
   */
  static getTrackingIdParameterName () {
    return GoogleAnalytics.getKeys().tid.name
  }

  /**
   * @param {string} key 
   * @returns {object|null}
   * @see {@link https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters|Measurement Protocol Parameter Reference}
   */
  static getIndexedKey (key) {
    const group = GoogleAnalytics.getGroups()
    let result = null
    if (/^cg(\d+)$/i.test(key)) {
      const found = key.match(/^cg(\d+)$/i)
      result = {
        name: `Content Group ${found[1]}`,
        group: group.ci
      }
    } else if (/^pr(\d+)([a-z]{2})$/i.test(key)) {
      const found = key.match(/^pr(\d+)([a-z]{2})$/i)
      const dictionary = {
        id: 'SKU',
        nm: 'Name',
        br: 'Brand',
        ca: 'Category',
        va: 'Variant',
        pr: 'Price',
        qt: 'Quantity',
        cc: 'Coupon Code',
        ps: 'Position'
      }
      result = {
        name: `Product ${found[1]} ${dictionary[found[2]]}`,
        group: group.ec
      }
    } else if (/^pr(\d+)(cd|cm)(\d+)$/i.test(key)) {
      const found = key.match(/^pr(\d+)(cd|cm)(\d+)$/i)
      const dictionary = {
        cd: 'Custom Dimension',
        cm: 'Custom Metric'
      }
      result = {
        name: `Product ${found[1]} ${dictionary[found[2]]} ${found[3]}`,
        group: group.ec
      }
    } else if (/^il(\d+)nm$/i.test(key)) {
      const found = key.match(/^il(\d+)nm$/i)
      result = {
        name: `Product Impression List ${found[1]} Name`,
        group: group.ec
      }
    } else if (/^il(\d+)pi(\d+)([a-z]{2})$/i.test(key)) {
      const found = key.match(/^il(\d+)pi(\d+)([a-z]{2})$/i)
      const dictionary = {
        id: 'SKU',
        nm: 'Name',
        br: 'Brand',
        ca: 'Category',
        va: 'Variant',
        pr: 'Price',
        ps: 'Position'
      }
      result = {
        name: `Product Impression List ${found[1]} Product ${found[2]} ${dictionary[found[3]]}`,
        group: group.ec
      }
    } else if (/^il(\d+)pi(\d+)(cd|cm)(\d+)$/i.test(key)) {
      const found = key.match(/^il(\d+)pi(\d+)(cd|cm)(\d+)$/i)
      const dictionary = {
        cd: 'Custom Dimension',
        cm: 'Custom Metric'
      }
      result = {
        name: `Product Impression List ${found[1]} Product ${found[2]} ${dictionary[found[3]]} ${found[4]}`,
        group: group.ec
      }
    } else if (/^promo(\d+)([a-z]{2})$/i.test(key)) {
      const found = key.match(/^promo(\d+)([a-z]{2})$/i)
      const dictionary = {
        id: 'ID',
        nm: 'Name',
        cr: 'Creative',
        ps: 'Position',
      }
      result = {
        name: `Promotion ${found[1]} ${dictionary[found[2]]}`,
        group: group.ec
      }
    } else if (/^cd(\d+)$/i.test(key)) {
      const found = key.match(/^cd(\d+)$/i)
      result = {
        name: `Custom Dimension ${found[1].padStart(3, '0')}`,
        group: group.cd
      }
    } else if (/^cm(\d+)$/i.test(key)) {
      const found = key.match(/^cm(\d+)$/i)
      result = {
        name: `Custom Metric ${found[1].padStart(3, '0')}`,
        group: group.cm
      }
    }
    return result
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
      let dataByGroup = {}
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
      Object.keys(data)
        .forEach(key => {
          const param = GoogleAnalytics.getKeys()[key] || GoogleAnalytics.getIndexedKey(key)
          let rowName = key
          let rowValue = data[key]
          let rowGroup = 'Other'
          if (param) {
            data[param.name] = data[key]
            delete data[key]
            rowName = param.name
            rowGroup = param.group
          }
          if (!(dataByGroup[rowGroup] && dataByGroup[rowGroup].length)) {
            dataByGroup[rowGroup] = []
          }
          dataByGroup[rowGroup].push({
            name: rowName,
            value: rowValue
          })
        })
      GoogleAnalytics.html = '<div class="request-data">'
      Object.keys(dataByGroup).forEach(g => { /* @todo: Sort dataByGroup. */
        GoogleAnalytics.html += `<details open data-group="${g}"><summary>${g}</summary>`
        dataByGroup[g].forEach(p => {
          GoogleAnalytics.html += `
            <div class="request-data-row">
              <div class="request-data-row-name">${p.name}</div>
              <div class="request-data-row-value">${p.value}</div>
            </div>`
        })
        GoogleAnalytics.html += `</details>`
      })
      GoogleAnalytics.html += '</div>'
    }
    return data
  }
}