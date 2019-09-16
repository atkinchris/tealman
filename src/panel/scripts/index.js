const scope = {
  domBtnClear: document.querySelector('.nav-ctrl-clear .iconbtn'),
  domBtnSettings: document.querySelector('.nav-ctrl-settings .iconbtn'),
  domBtnSettingsClose: document.querySelector('.settings-close .iconbtn'),
  domCheckboxFilterGoogleAnalytics: document.querySelector('.filter-google-analytics'),
  domCheckboxFilterTealiumIq: document.querySelector('.filter-tealium-iq'),
  domCheckboxPreserveLog: document.querySelector('.nav-ctrl-preserve-log .iconbtn'),
  domInputSearchResultsCount: document.querySelector('#search-results-count'),
  domInputSearchTerm: document.querySelector('#search-term'),
  domRequestList: document.querySelector('.request-list'),
  domSettingsLightbox: document.querySelector('.settings-lightbox'),
  domShadow: document.querySelector('.shadow'),
  keywordHighlighter: new Mark('.request-list'), /* @todo: Review context. */
  keywordHighlighterTarget: [],
  navHeight: document.querySelector('nav').getBoundingClientRect().height,
  preserveLog: false,
  requestList: []
}

/**
 * @see {@link https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters|Measurement Protocol Parameter Reference}
 */
scope.googleAnalyticsParameterMap = {
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

/**
 * @param {object} req
 * @returns {object|null}
 * 
 * Parses Google Analytics payload into JSON.
 */
scope.parseGoogleAnalyticsData = req => {
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
  }
  Object.keys(data)
    .forEach(name => {
      const map = scope.googleAnalyticsParameterMap[name]
      if (map) {
        data[map] = data[name]
        delete data[name]
      } else if (/^cd\d+/.test(name)) {
        data[name.replace(/^cd/, 'Custom Dimension ')] = data[name]
        delete data[name]
      }
    })
  return data
}

/**
 * @param {object} req
 * @returns {object|null}
 * 
 * Parses Tealium iQ payload into JSON.
 */
scope.parseTealiumIqData = req => {
  let data = null
  if (req && req.request && req.request.postData && req.request.postData.text) {
    const text = req.request.postData.text
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}') + 1
    data = JSON.parse(text.substring(start, end)).data
  }
  return data
}

scope.requestFilterList = [
  new RequestFilter('Google Analytics', /google\-analytics\.com\/(r\/)?collect/, scope.parseGoogleAnalyticsData, true),
  new RequestFilter('Tealium iQ', /tealiumiq\.com(.*)\/i\.gif/, scope.parseTealiumIqData, true)
]

/**
 * @param {object} req
 * 
 * Observes network activity to capture Google Analytics and Tealium iQ requests.
 * 
 * @todo: Hide 'Listening...' <div>.
 */
scope.watchNetwork = req => {
  if (req && req.request) {
    scope.requestFilterList.forEach(filter => {
      if (filter.isActive() && filter.urlPattern.test(req.request.url)) {
        const data = filter.parseData(req)
        if (data) {
          const newRequest = new Request(scope.requestList.length + 1, filter.origin, data)
          scope.requestList.push(newRequest)
          scope.domRequestList.appendChild(newRequest.createDomElement())
        }
      }
    })
  }
}

chrome.devtools.network.onRequestFinished.addListener(scope.watchNetwork)

/**
 * Clears all requests.
 * 
 * @todo: Show 'Listening...' <div>.
 */
scope.clearRequestList = () => {
  scope.requestList = []
  scope.domRequestList.innerHTML = ''
  scope.domInputSearchResultsCount.value = ''
}

chrome.devtools.network.onNavigated.addListener(() => {
  if (!scope.preserveLog) {
    scope.clearRequestList()
  }
})

/* -------- Begin: Event Listeners ---------------------------------------------------------------------------------- */

/**
 * Highlights all request payload strings that match the searched term.
 */
scope.highlightSearchTermMatches = () => {
  const searchTerm = scope.domInputSearchTerm.value
  scope.keywordHighlighter.unmark({
    done: function () {
      scope.domInputSearchResultsCount.value = ''
      scope.keywordHighlighter.mark(searchTerm, {
        separateWordSearch: false,
        done: function () {
          scope.keywordHighlighterTarget = [...document.querySelectorAll('mark')]
          scope.domInputSearchResultsCount.value = scope.keywordHighlighterTarget.length
        }
      })
    }
  })
}

/**
 * Handles highlighting of all request payload strings that match the searched term.
 */
scope.domInputSearchTerm.addEventListener('keyup', scope.highlightSearchTermMatches)

/**
 * Handles preserving/not-preserving of logs.
 */
scope.domCheckboxPreserveLog.addEventListener('click', event => {
  event.preventDefault()
  scope.preserveLog = !scope.preserveLog
  scope.domCheckboxPreserveLog.querySelectorAll('i').forEach(icon => icon.classList.toggle('hidden'))
})

/**
 * Handles clearing of all requests.
 */
scope.domBtnClear.addEventListener('click', event => {
  event.preventDefault()
  scope.clearRequestList()
})

/**
 * Handles opening of the settings lightbox.
 */
scope.domBtnSettings.addEventListener('click', event => {
  event.preventDefault()
  scope.domShadow.classList.add('open')
  scope.domSettingsLightbox.classList.add('open')
})

/**
 * Closes the settings lightbox.
 */
scope.closeSettingsLightbox = () => {
  scope.domShadow.classList.remove('open')
  scope.domSettingsLightbox.classList.remove('open')
}

/**
 * Handles closing of the settings lightbox (settings lightbox close button click).
 */
scope.domBtnSettingsClose.addEventListener('click', event => {
  event.preventDefault()
  scope.closeSettingsLightbox()
})

/**
 * Handles closing of the settings lightbox (shadow click).
 */
scope.domShadow.addEventListener('click', event => {
  event.preventDefault()
  scope.closeSettingsLightbox()
})

/**
 * Handles filtering/not-filtering of Google Analytics requests.
 */
scope.domCheckboxFilterGoogleAnalytics.addEventListener('click', event => {
  event.preventDefault()
  scope.requestFilterList
    .find(filter => filter.origin === 'Google Analytics')
    .toggleActive()
  scope.domCheckboxFilterGoogleAnalytics.querySelectorAll('i')
    .forEach(icon => icon.classList.toggle('hidden'))
})

/**
 * Handles filtering/not-filtering of Tealium iQ requests.
 */
scope.domCheckboxFilterTealiumIq.addEventListener('click', event => {
  event.preventDefault()
  scope.requestFilterList
    .find(filter => filter.origin === 'Tealium iQ')
    .toggleActive()
  scope.domCheckboxFilterTealiumIq.querySelectorAll('i')
    .forEach(icon => icon.classList.toggle('hidden'))
})

/**
 * Handles closing of the settings lightbox (escape key press).
 */
document.body.addEventListener('keyup', event => {
  if (event.keyCode === 27 && scope.domSettingsLightbox.classList.contains('open')) {
    scope.closeSettingsLightbox()
  }
})

/* -------- End: Event Listeners ------------------------------------------------------------------------------------ */