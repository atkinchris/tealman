((gl, doc) => {
  'use strict'
  try {
    if (!gl || !doc) {
      return false
    }

    class Tab {
      /**
       * @param {string} selector
       */
      constructor (selector) {
        this.selector = selector
        this.container = doc.querySelector(selector)
        this.requestList = []
        this.requestListWrapper = doc.querySelector(`${selector} .request-list`)
        this.postDataHeading = doc.querySelector(`${selector} .right h1`)
        this.postDataWrapper = doc.querySelector(`${selector} .post-data`)
        this.tealiumProfileEnvironment = doc.querySelector('.tealium-profile-environment')
        this.init()
      }

      /**
       * Resets tab, i.e. captured requests, etc.
       */
      init () {
        this.requestList = []
        this.requestListWrapper.innerHTML = ''
        this.postDataHeading.innerHTML = ''
        this.postDataWrapper.innerHTML = ''
        if (this.tealiumProfileEnvironment) {
          this.tealiumProfileEnvironment.innerHTML = ''
        }
      }

      /**
       * Shows tab.
       */
      show () {
        this.container.classList.remove('hidden')
      }

      /**
       * Hides tab.
       */
      hide () {
        this.container.classList.add('hidden')
      }

      /**
       * @param {number} requestIndex
       * @todo Heading can be improved. For example, a combination of unique index + event category + event action.
       * @todo div.post-data is redrawn every time a request link is clicked. This is an efficiency concern.
       */
      showPostData (requestIndex) {
        this.postDataHeading.innerHTML = `Request ${requestIndex + 1} post data`
        const isPageView = this.isPageView(requestIndex)
        if (!isPageView) {
          const ec = this.getEventCategory(requestIndex)
          const ea = this.getEventAction(requestIndex)
          const el = this.getEventLabel(requestIndex)
          if (ec || ea || el) {
            this.postDataHeading.innerHTML += `
              <div class="heading-event-signature">
                <div class="heading-event-category">
                  <span>Category</span>: ${ec}
                </div>
                <div class="heading-event-action">
                  <span>Action</span>: ${ea}
                </div>
                <div class="heading-event-label">
                  <span>Label</span>: ${el}
                </div>
              </div>`
          }
        }
        const requestDataUnordered = this.requestList[requestIndex].data
        const requestDataOrdered = []
        Object.keys(requestDataUnordered).sort().forEach(name => requestDataOrdered.push({
          name,
          value: requestDataUnordered[name]
        }))
        this.postDataWrapper.innerHTML = `${requestDataOrdered.reduce((acc, cur) => {
          let name = cur.name
          let value = cur.value
          if (value === null) {
            value = 'null'
          } else if (typeof value === 'undefined') {
            value = 'undefined'
          } else if (/boolean|number|string/.test(typeof value)) {
            value = `${value}`
          } else if (typeof value === 'object') {
            value = JSON.stringify(value)
          }
          if (/^cp\./i.test(name)) {
            name = name.replace(/^cp\./i, '<span class="color-cookie">cp.</span>')
          } else if (/^dom\./i.test(name)) {
            name = name.replace(/^dom\./i, '<span class="color-dom">dom.</span>')
          } else if (/^js_page\./i.test(name)) {
            name = name.replace(/^js_page\./i, '<span class="color-javascript">js_page.</span>')
          } else if (/^meta\./i.test(name)) {
            name = name.replace(/^meta\./i, '<span class="color-meta">meta.</span>')
          } else if (/^qp\./i.test(name)) {
            name = name.replace(/^qp\./i, '<span class="color-querystring">qp.</span>')
          }
          return acc + `
            <div class="post-data-r">
              <div class="post-data-r-varname">${name}</div>
              <div class="post-data-r-varvalue">${value}</div>
            </div>`
        }, '')}`
      }

      /**
       * @param {number} requestIndex
       * @param {string} name
       * @return {string|null}
       * Extracts the data variable with the specified name from the request at the given index.
       */
      getDataVariable (requestIndex, name) {
        let value = null
        const data = this.requestList[requestIndex].data
        if (data[name]) {
          value = data[name]
        }
        return value
      }

      /**
       * @param {number} requestIndex
       * @return {boolean}
       * Checks if the request at the given index is a page view.
       */
      isPageView (requestIndex) {
        return (this.getDataVariable(requestIndex, 't') === 'pageview'
          || this.getDataVariable(requestIndex, 'tealium_event') === 'view')
      }

      /**
       * @param {number} requestIndex
       * @return {string}
       * Extracts event category from the request at the given index.
       * For Google analytics requests, {ec} variable should consistently work.
       * For Tealium requests, a data layer variable named {eventCategory} must exist within TiQ.
       */
      getEventCategory (requestIndex) {
        return (this.getDataVariable(requestIndex, 'ec') || this.getDataVariable(requestIndex, scope.eventCategoryUdoName) || '')
      }

      /**
       * @param {number} requestIndex
       * @return {string}
       * Extracts event action from the request at the given index.
       * For Google analytics requests, {ea} variable should consistently work.
       * For Tealium requests, a data layer variable named {eventAction} must exist within TiQ.
       */
      getEventAction (requestIndex) {
        return (this.getDataVariable(requestIndex, 'ea') || this.getDataVariable(requestIndex, scope.eventActionUdoName) || '')
      }

      /**
       * @param {number} requestIndex
       * @return {string}
       * Extracts event label from the request at the given index.
       * For Google analytics requests, {el} variable should consistently work.
       * For Tealium requests, a data layer variabled named {eventLabel} must exist within TiQ.
       */
      getEventLabel (requestIndex) {
        return (this.getDataVariable(requestIndex, 'el') || this.getDataVariable(requestIndex, scope.eventLabelUdoName) || '')
      }

      /**
       * @param {number} requestIndex
       * @return {string}
       * Extracts Tealium profile and publish environment from the request at given index.
       */
      getTealiumProfileEnvironment (requestIndex) {
        let result = ''
        const profile = this.getDataVariable(requestIndex, 'tealium_profile')
        const environment = this.getDataVariable(requestIndex, 'tealium_environment')
        if (profile && environment) {
          result = `${profile} / ${environment}`
        }
        return result
      }

      /**
       * Creates a unique link for displaying the newly captured request payload.
       */
      render () {
        this.requestList.forEach((cur, index) => {
          if (!this.container.querySelector(`.request a[data-index="${index}"]`)) {
            const newRequest = doc.createElement('div')
            const isPageView = this.isPageView(index)
            newRequest.setAttribute('class', `request${isPageView ? ' pageview' : ''}`)
            newRequest.setAttribute('title', `${isPageView ? 'Pageview' : 'Event'}`)
            newRequest.innerHTML = `<a href="#" data-index="${index}">Request ${index + 1}</a>`
            newRequest.querySelector('a').addEventListener('click', event => {
              event.preventDefault()
              this.showPostData(parseInt(event.target.dataset.index))
              this.container.querySelectorAll('.request a.active').forEach(cur => cur.classList.remove('active'))
              event.target.classList.add('active')
              scope.highlightKeyword()
            })
            this.requestListWrapper.appendChild(newRequest)
            if (scope.autoFocusOnLatestRequestFlag) {
              newRequest.querySelector('a').click()
            }
            const tealProEnv = this.getTealiumProfileEnvironment(index)
            if (this.tealiumProfileEnvironment && tealProEnv) {
              this.tealiumProfileEnvironment.innerHTML = tealProEnv
            }
          }
        })
      }
    }

    const scope = {
      gaTab: new Tab('.tab-ga'),
      gaTabSwicther: doc.querySelector('.tab-switcher a[data-tab*="tab-ga"]'),
      tealiumTab: new Tab('.tab-tealium'),
      tealiumTabSwicther: doc.querySelector('.tab-switcher a[data-tab*="tab-tealium"]'),
      preserveLogFlag: false,
      preserveLogCheckbox: doc.querySelector('#preserve-log'),
      keywordInput: doc.querySelector('#keyword'),
      keywordMatchCount: doc.querySelector('#keyword-match-count'),
      jumpToPreviousKeywordMatch: doc.querySelector('.jump-to-keyword-match-prev'),
      jumpToNextKeywordMatch: doc.querySelector('.jump-to-keyword-match-next'),
      highlighterContextSelector: '.right .post-data',
      highlighterResultList: [],
      highlighterCurrentResultIndex: 0,
      clearRequests: doc.querySelector('.clear-requests'),
      settingsButton: doc.querySelector('.tab-ctrl-settings a'),
      shadow: doc.querySelector('.shadow'),
      settingsLightbox: doc.querySelector('.settings-lightbox'),
      settingsCloseButton: doc.querySelector('.settings-close-button'),
      autoFocusOnLatestRequestFlag: false,
      autoFocusOnLatestRequestCheckbox: doc.querySelector('#auto-focus-on-latest-request'),
      eventCategoryUdoName: 'eventCategory',
      eventCategoryUdoNameInput: doc.querySelector('#event-category-udo-name'),
      eventActionUdoName: 'eventAction',
      eventActionUdoNameInput: doc.querySelector('#event-action-udo-name'),
      eventLabelUdoName: 'eventLabel',
      eventLabelUdoNameInput: doc.querySelector('#event-label-udo-name')
    }
    scope.highlighterContext = doc.querySelectorAll(scope.highlighterContextSelector)
    scope.highlighter = new Mark(scope.highlighterContext)

    /**
     * Handles switching to the Google Analytics tab.
     */
    scope.gaTabSwicther.addEventListener('click', event => {
      event.preventDefault()
      scope.tealiumTabSwicther.classList.remove('active')
      scope.tealiumTab.hide()
      scope.gaTabSwicther.classList.add('active')
      scope.gaTab.show()
    })

    /**
     * Handles switching to the Tealium tab.
     */
    scope.tealiumTabSwicther.addEventListener('click', event => {
      event.preventDefault()
      scope.gaTabSwicther.classList.remove('active')
      scope.gaTab.hide()
      scope.tealiumTabSwicther.classList.add('active')
      scope.tealiumTab.show()
    })

    /**
     * Handles preserving/not-preserving of logs.
     */
    scope.preserveLogCheckbox.addEventListener('change', event => {
      event.preventDefault()
      scope.preserveLogFlag = !scope.preserveLogFlag
    })

    /**
     * Scrolls to the 'current' keyword match.
     */
    scope.highlighterJumpTo = () => {
      if (scope.highlighterResultList.length && scope.highlighterCurrentResultIndex > -1
        && scope.highlighterCurrentResultIndex < scope.highlighterResultList.length) {
        const tmp = doc.querySelector('mark.current')
        if (tmp) {
          tmp.classList.remove('current')
        }
        scope.keywordMatchCount.value
          = `${scope.highlighterCurrentResultIndex + 1}/${scope.highlighterResultList.length}`
        const highlighterCurrentResult = scope.highlighterResultList[scope.highlighterCurrentResultIndex]
        highlighterCurrentResult.classList.add('current')
        const navHeight = doc.querySelector('nav').getBoundingClientRect().height
        scroll({
          behavior: 'smooth',
          top: highlighterCurrentResult.offsetTop - (navHeight * 1.5)
        })
      }
    }

    /**
     * Highlights all post data strings that match the searched keyword, and scrolls to the first match.
     */
    scope.highlightKeyword = function () {
      var keyword = scope.keywordInput.value
      scope.highlighter.unmark({
        done: function () {
          scope.keywordMatchCount.value = ''
          scope.highlighter.mark(keyword, {
            done: function () {
              scope.highlighterResultList = [...doc.querySelectorAll('mark')]
              scope.highlighterCurrentResultIndex = 0
              scope.highlighterJumpTo()
            }
          })
        }
      })
    }

    /**
     * Handles highlighting of all post data strings that match the searched keyword.
     */
    scope.keywordInput.addEventListener('keyup', scope.highlightKeyword)

    /**
     * Scrolls to the previous keyword match.
     */
    scope.jumpToPreviousKeywordMatch.addEventListener('click', event => {
      event.preventDefault()
      scope.highlighterCurrentResultIndex -= 1
      if (scope.highlighterResultList.length && scope.highlighterCurrentResultIndex < 0) {
        scope.highlighterCurrentResultIndex = scope.highlighterResultList.length - 1
      }
      scope.highlighterJumpTo()
    })

    /**
     * Scrolls to the next keyword match.
     */
    scope.jumpToNextKeywordMatch.addEventListener('click', event => {
      event.preventDefault()
      scope.highlighterCurrentResultIndex += 1
      if (scope.highlighterResultList.length
        && scope.highlighterCurrentResultIndex === scope.highlighterResultList.length) {
        scope.highlighterCurrentResultIndex = 0
      }
      scope.highlighterJumpTo()
    })

    /**
     * Handles clearing of all requests.
     */
    scope.clearRequests.addEventListener('click', event => {
      event.preventDefault()
      scope.gaTab.init()
      scope.tealiumTab.init()
    })

    /**
     * Handles opening of the settings lightbox.
     */
    scope.settingsButton.addEventListener('click', event => {
      event.preventDefault()
      scope.shadow.classList.add('open')
      scope.settingsLightbox.classList.add('open')
    })

    /**
     * Handles closing of the settings lightbox.
     */
    scope.settingsCloseButton.addEventListener('click', event => {
      event.preventDefault()
      scope.shadow.classList.remove('open')
      scope.settingsLightbox.classList.remove('open')
    })

    /**
     * Enables/disables auto rendering of the latest request data.
     */
    scope.autoFocusOnLatestRequestCheckbox.addEventListener('click', () => {
      scope.autoFocusOnLatestRequestFlag = !scope.autoFocusOnLatestRequestFlag
    })

    /**
     * Sets the Event Category UDO name.
     */
    scope.eventCategoryUdoNameInput.addEventListener('keyup', () => {
      scope.eventCategoryUdoName = scope.eventCategoryUdoNameInput.value
    })

    /**
     * Sets the Event Action UDO name.
     */
    scope.eventActionUdoNameInput.addEventListener('keyup', () => {
      scope.eventActionUdoName = scope.eventActionUdoNameInput.value
    })

    /**
     * Sets the Event Label UDO name.
     */
    scope.eventLabelUdoNameInput.addEventListener('keyup', () => {
      scope.eventLabelUdoName = scope.eventLabelUdoNameInput.value
    })

    /**
     * @param {object} req
     * @return {object}
     * Extracts Google Analytics payload from given network request.
     */
    scope.getGaPostData = req => {
      const gaPostData = {}
      const method = req.method.toLowerCase()
      if (method === 'get') {
        req.queryString.forEach(cur => {
          gaPostData[`${decodeURIComponent(cur.name)}`] = decodeURIComponent(cur.value)
        })
      } else if (method === 'post') {
         const tmp = req.postData.text.split('&')
         tmp.forEach(cur => {
           cur = cur.split('=')
           gaPostData[`${decodeURIComponent(cur[0])}`] = `${decodeURIComponent(cur[1])}`
         })
      }
      return gaPostData
    }
    
    /**
     * @param {string} text
     * @return {object}
     * Parses given Tealium payload (originally a stringified JSON object) into JSON.
     */
    scope.getTealiumPostData = text => {
      const begin = text.indexOf('{')
      const end = text.lastIndexOf('}') + 1
      const postData = JSON.parse(text.substring(begin, end))
      return postData.data
    }

    /**
     * @param {object} req
     * Observes network activity to capture Google Analytics and Tealium requests.
     */
    scope.listen = req => {
      if (req && req.request) {
        const isTealiumRequest = /tealiumiq\.com(.*)\/i\.gif/.test(req.request.url) && req.request.postData
          && req.request.postData.text
        const isGaRequest = /google\-analytics\.com\/(r\/)?collect/.test(req.request.url) && req.request.queryString
        if (isTealiumRequest) {
          scope.tealiumTab.requestList.push({
            data: scope.getTealiumPostData(req.request.postData.text)
          })
          scope.tealiumTab.render()
        } else if (isGaRequest) {
          scope.gaTab.requestList.push({
            data: scope.getGaPostData(req.request)
          })
          scope.gaTab.render()
        }
      }
    }

    chrome.devtools.network.onRequestFinished.addListener(scope.listen)
    chrome.devtools.network.onNavigated.addListener(() => {
      if (!scope.preserveLogFlag) {
        scope.gaTab.init()
        scope.tealiumTab.init()
      }
    })

    gl.tealman = scope

    return true
  } catch (error) {
    console.error(error)
    return false
  }
})(window, window.document)
