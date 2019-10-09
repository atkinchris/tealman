const scope = {
  domBtnClear: document.querySelector('.nav-ctrl-clear .iconbtn'),
  domBtnSettings: document.querySelector('.nav-ctrl-settings .iconbtn'),
  domBtnSettingsClose: document.querySelector('.settings-close .iconbtn'),
  domCheckboxFilterGoogleAnalytics: document.querySelector('.filter-google-analytics'),
  domCheckboxFilterTealiumIq: document.querySelector('.filter-tealium-iq'),
  domCheckboxPreserveLog: document.querySelector('.nav-ctrl-preserve-log .iconbtn'),
  domInputSearchResultsCount: document.querySelector('#search-results-count'),
  domInputSearchTerm: document.querySelector('#search-term'),
  domListening: document.querySelector('.listening'),
  domRequestList: document.querySelector('.request-list'),
  domSettingsLightbox: document.querySelector('.settings-lightbox'),
  domShadow: document.querySelector('.shadow'),
  keywordHighlighter: new Mark('.request-list'), /* @todo: Review context. */
  keywordHighlighterTarget: [],
  navHeight: document.querySelector('nav').getBoundingClientRect().height,
  preserveLog: true,
  requestList: []
}

scope.requestFilterList = [
  new RequestFilter(GoogleAnalytics.getOrigin(), GoogleAnalytics.getUrlPattern(), GoogleAnalytics.parseData, true),
  new RequestFilter(TealiumIQ.getOrigin(), TealiumIQ.getUrlPattern(), TealiumIQ.parseData, true)
]

/**
 * @param {object} req
 * 
 * Observes network activity to capture Google Analytics and Tealium iQ requests.
 */
scope.watchNetwork = req => {
  if (req && req.request) {
    scope.requestFilterList.forEach(filter => {
      if (filter.isActive() && filter.urlPattern.test(req.request.url)) {
        const data = filter.parseData(req)
        if (data) {
          const newRequest = new Request(scope.requestList.length + 1, filter.origin, data)
          scope.requestList.push(newRequest)
          // scope.domRequestList.prepend(newRequest.createDomElement())
          scope.domRequestList.appendChild(newRequest.createDomElement())
          scope.domListening.classList.add('hidden')
        }
      }
    })
  }
}

chrome.devtools.network.onRequestFinished.addListener(scope.watchNetwork)

/**
 * Clears all requests.
 */
scope.clearRequestList = () => {
  scope.requestList = []
  scope.domRequestList.innerHTML = ''
  scope.domInputSearchResultsCount.value = ''
  scope.domListening.classList.remove('hidden')
}

/**
 * @param {string} url
 * 
 * @todo: Add description.
 */
scope.addPageBreak = (url) => {
  const pageBreak = document.createElement('div')
  pageBreak.setAttribute('class', 'page-break')
  pageBreak.setAttribute('title', url)
  pageBreak.innerHTML = `
    Navigated to ${url}
  `
  scope.domRequestList.prepend(pageBreak)
}

chrome.devtools.network.onNavigated.addListener(url => {
  if (!scope.preserveLog) {
    scope.clearRequestList()
  } else {
    // scope.addPageBreak(url)
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
    .find(filter => filter.origin === GoogleAnalytics.getOrigin())
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
    .find(filter => filter.origin === TealiumIQ.getOrigin())
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