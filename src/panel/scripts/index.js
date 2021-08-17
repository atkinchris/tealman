const tealman = {
  domNavCheckboxPreserveLog: document.querySelector('#navbtn-preserve'),
  domNavBtnClear: document.querySelector('#navbtn-clear'),
  domNavBtnSettings: document.querySelector('#navbtn-settings'),
  domRequestList: document.querySelector('.request-list'),
  domShadow: document.querySelector('.shadow'),
  domSettingsLightbox: document.querySelector('.settings-lightbox'),
  preserveLog: true,
  requestList: []
}

tealman.requestFilterList = [
  new RequestFilter(TealiumIQ.getOrigin(), TealiumIQ.getUrlPattern()
    , TealiumIQ.parseData)
]

/******** Begin: Helpers ********/

/**
 * @param {string} url
 */
tealman.addPageBreak = url => {
  const pageBreak = document.createElement('div')
  pageBreak.setAttribute('class', 'page-break')
  pageBreak.setAttribute('title', url)
  pageBreak.innerHTML = `Navigated to ${url}`
  tealman.domRequestList.appendChild(pageBreak)
}

/**
 * Clears all request data from both the memory and the DOM.
 */
tealman.clearRequestList = () => {
  tealman.requestList = []
  tealman.domRequestList.innerHTML = ''
}

/**
 * @param {string} origin
 * @param {object} data
 * @returns {AdobeAnalytics|GoogleAnalytics|TealiumIQ}
 */
tealman.createRequest = (origin, data) => {
  let request = null
  const id = tealman.requestList.length + 1
  switch (origin) {
    case TealiumIQ.getOrigin():
      request = new TealiumIQ(id, data)
      break;
    default:
      break;
  }
  return request
}

/**
 * @todo: Add description
 */
tealman.togglePreserveLog = () => {
  tealman.preserveLog = !tealman.preserveLog
  tealman.domNavCheckboxPreserveLog.querySelectorAll('i')
    .forEach(icon => icon.classList.toggle('hidden'))
}

/**
 * @param {object} req
 */
tealman.watchNetwork = req => {
  if (req && req.request) {
    tealman.requestFilterList.forEach(filter => {
      if (filter.isActive() && filter.getUrlPattern().test(req.request.url)) {
        const data = filter.parseData(req)
        if (data) {
          const newRequest = tealman.createRequest(filter.getOrigin(), data)
          tealman.requestList.push(newRequest)
          tealman.domRequestList.appendChild(newRequest.createDomElement())
        }
      }
    })
  }
}

/******** End: Helpers ********************************************************/

/******** Begin: Event Listeners ********/

/**
 * @todo: Add description.
 */
tealman.domNavCheckboxPreserveLog.addEventListener('click', event => {
  event.preventDefault()
  tealman.togglePreserveLog()
})

/**
 * Clears all request data from both the memory and the DOM.
 */
tealman.domNavBtnClear.addEventListener('click', event => {
  event.preventDefault()
  alert('@todo: Clear selected requests only.')
  tealman.clearRequestList()
})

/**
 * @todo: Add description.
 */
tealman.domNavBtnSettings.addEventListener('click', event => {
  event.preventDefault()
  alert('@todo: Handle settings button click.')
})

/**
 * @todo: Add description.
 */
chrome.devtools.network.onRequestFinished.addListener(tealman.watchNetwork)

/**
 * @todo: Add description.
 */
chrome.devtools.network.onNavigated.addListener(url => {
  if (tealman.preserveLog) {
    tealman.addPageBreak(url)
  } else {
    tealman.clearRequestList()
  }
})

/******** End: Event Listeners ************************************************/