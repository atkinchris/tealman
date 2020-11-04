const tealman = {
  requestFilterList: [
    // new RequestFilter('GoogleAnalytics'),
    new RequestFilter('TealiumIQ')
  ],
  requestList: [],
  preserveLog: true,
  domNavBtnPreserve: document.querySelector('#navbtn-preserve'),
  domNavBtnClear: document.querySelector('#navbtn-clear'),
  domNavBtnSettings: document.querySelector('#navbtn-settings'),
  domRequestList: document.querySelector('.request-list'),
  domShadow: document.querySelector('.shadow'),
  domSettingsLightbox: document.querySelector('.settings-lightbox')
}

/**
 * @param {object} req
 *
 * @todo
 */
tealman.watchNetwork = req => {
  if (req && req.request) {
    tealman.requestFilterList.forEach(filter => {
      if (filter.isActive() && filter.hasMatch(req.request.url)) {
        const data = filter.parseData(req)
        if (data) {
          const id = tealman.requestList.length + 1
          const hit = new window[filter.hitSubClass](id, data)
          tealman.requestList.push(hit)
          tealman.domRequestList.appendChild(hit.createDomElement())
        }
      }
    })
  }
}

chrome.devtools.network.onRequestFinished.addListener(tealman.watchNetwork)

/**
 * Clears all requests.
 */
tealman.clearRequestList = () => {
  tealman.requestList = []
  tealman.domRequestList.innerHTML = ''
}

/**
 * @param {string} url
 *
 * @todo
 */
tealman.addPageBreak = url => {
  const pageBreak = document.createElement('div')
  pageBreak.setAttribute('class', 'page-break')
  pageBreak.setAttribute('title', url)
  pageBreak.innerHTML = `Navigated to ${url}`
  tealman.domRequestList.appendChild(pageBreak)
}

chrome.devtools.network.onNavigated.addListener(url => {
  if (!tealman.preserveLog) {
    tealman.clearRequestList()
  } else {
    tealman.addPageBreak(url)
  }
})

/* -------- Begin: Event Listeners ------------------------------------------ */

tealman.domNavBtnPreserve.addEventListener('click', event => {
  event.preventDefault()
  alert('@todo: Preserve log')
})

tealman.domNavBtnClear.addEventListener('click', event => {
  event.preventDefault()
  alert('@todo: Clear all requests')
})

tealman.domNavBtnSettings.addEventListener('click', event => {
  event.preventDefault()
  alert('@todo: Settings')
})

/* -------- End: Event Listeners -------------------------------------------- */