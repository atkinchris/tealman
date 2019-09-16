class Request {
  /**
   * @constructs Request
   * @param {number} id
   * @param {string} origin
   * @param {object} data
   */
  constructor (id, origin, data) {
    this.id = id
    this.origin = origin
    this.data = this.sortData(data)

    this.setGoogleAnalyticsVariables()
    this.setTealiumIqVariables()
  }

  /**
   * @param {object} data
   * @returns {object}
   * 
   * Sorts data in alphabetical order.
   */
  sortData (data) {
    const orderedData = []
    Object.keys(data)
      .sort()
      .forEach(name => orderedData.push({
        name,
        value: data[name]
      }))
    return orderedData
  }

  /**
   * @param {string} name
   * @returns {string|null}
   * 
   * Extracts the data variable with the specified name.
   */
  getDataVariable (name) {
    let value = null
    const searchResult = this.data.find(dataVar => dataVar.name === name)
    if (searchResult) {
      value = searchResult.value
    }
    return value
  }

  /**
   * Sets hit type.
   * Extracts Google Analytics specific variables.
   */
  setGoogleAnalyticsVariables () {
    if (this.origin === 'Google Analytics') {
      const hitType = this.getDataVariable('Hit Type')
      this.type = hitType.toLowerCase().replace(/^\w/, firstCharacter => firstCharacter.toUpperCase())

      this.gaTrackingId = this.getDataVariable('Tracking ID')
    }
  }

  /**
   * Sets hit type.
   * Extracts Tealium iQ specific variables.
   */
  setTealiumIqVariables () {
    if (this.origin === 'Tealium iQ') {
      const hitType = this.getDataVariable('tealium_event')
      this.type = hitType.toLowerCase() === 'view' ? 'Pageview' : 'Event'

      this.tiqProfile = this.getDataVariable('tealium_profile')
      this.tiqEnvironment = this.getDataVariable('tealium_environment')
    }
  }

  /**
   * @param {number} number
   * @returns {string}
   * 
   * Takes a number (1-digit or 2-digit) and casts it to a string. If the number is less than 10, adds a leading 0.
   */
  addLeadingZero (number) {
    return (number < 10) ? (`0${number}`).slice(-2) : `${number}`
  }

  /**
   * @returns {string}
   * 
   * Returns the current timestamp in the yyyy-MM-ddThh:mm:ss format.
   */
  getTimestamp () {
    const now = new Date()
    const year = now.getFullYear()
    const month = this.addLeadingZero(now.getMonth() + 1)
    const day = this.addLeadingZero(now.getDate())
    const hours = this.addLeadingZero(now.getHours())
    const minutes = this.addLeadingZero(now.getMinutes())
    const seconds = this.addLeadingZero(now.getSeconds())
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
  }

  /**
   * @param {string} text
   * @param {string} [className]
   * @returns {string}
   * 
   * Wraps given string in a <span> element with class 'highlight'.
   * If className is specified, it is add to the class list of the span element.
   */
  highlightText (text, className) {
    return `<span class="highlight${(className) ? [' highlight-', className].join('') : ''}">${text}</span>`
  }

  /**
   * @returns {string}
   * 
   * Returns the HTML string detailing this Request.
   */
  createDomElement () {
    const container = document.createElement('div')
    container.setAttribute('class', 'request')
    container.dataset.id = this.id

    const header = document.createElement('div')
    header.setAttribute('class', 'request-header')

    const link = document.createElement('a')
    link.setAttribute('href', '#')
    link.setAttribute('class', 'request-link linkbtn linkbtn-light')
    link.dataset.id = this.id
    link.innerHTML = `
      <span class="request-id">${this.id}</span>
      <span class="request-type">${this.type}</span>
      <span class="request-origin">${this.origin}</span>
      ${
        (this.origin === 'Google Analytics')
          ? ['<span>', this.gaTrackingId, '</span>'].join('')
          : (this.origin === 'Tealium iQ')
            ? ['<span>', this.tiqProfile, ' / ', this.tiqEnvironment, '</span>'].join('')
            : ''
      }
      <span class="request-timestamp">
        ${this.getTimestamp()}
      </span>
      <span class="request-accordion">
        <i class="fas fa-chevron-down"></i>
        <i class="fas fa-chevron-right"></i>
      </span>
    `
    link.addEventListener('click', event => {
      event.preventDefault()
      const reqId = event.target.dataset.id
      const reqContainer = document.querySelector(`.request[data-id="${reqId}"]`)
      if (reqContainer.classList.contains('active')) {
        reqContainer.classList.remove('active')
      } else {
        document.querySelectorAll('.request.active')
          .forEach(active => active.classList.remove('active'))
        reqContainer.classList.add('active')
      }
    })

    const body = document.createElement('div')
    body.setAttribute('class', 'request-body')
    body.innerHTML = `
      <div class="request-data">
        ${this.data.reduce((accumulator, row) => {
          if (this.origin === 'Tealium iQ') {
            row.name = (/^cp./.test(row.name)) 
              ? row.name.replace(/^cp./, this.highlightText('cp.', 'cookie')) : row.name
            row.name = (/^dom./.test(row.name))
              ? row.name.replace(/^dom./, this.highlightText('dom.', 'dom')) : row.name
            row.name = (/^js_page./.test(row.name))
              ? row.name.replace(/^js_page./, this.highlightText('js_page.', 'js_page')) : row.name
            row.name = (/^meta./.test(row.name))
              ? row.name.replace(/^meta./, this.highlightText('meta.', 'meta')) : row.name
            row.name = (/^qp./.test(row.name)) ? row.name.replace(/^qp./, this.highlightText('qp.', 'qp')) : row.name
          }
          return accumulator + `
            <div class="request-data-row">
              <div class="request-data-row-name">${row.name}</div>
              <div class="request-data-row-value">${row.value}</div>
            </div>
          `
        }, '')}
      </div>
    `

    header.appendChild(link)
    container.appendChild(header)
    container.appendChild(body)
    
    return container
  }
}