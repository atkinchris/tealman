class Hit {
  /**
   * @constructs Hit
   * @param {number} id
   * @param {object} data
   */
  constructor (id, data) {
    this.id = id
    this.data = Utils.sortData(data)
    this.timestamp = Utils.getTimestamp()
  }

  /**
   * @param {string} name
   * @returns {string|null}
   *
   * Extracts the data variable with the specified name.
   */
  getDataVariable (name) {
    const searchResult = this.data.find(dataVar => dataVar.name === name)
    return (searchResult) ? searchResult.value : null
  }

  /**
   * @returns {object}
   *
   * @todo
   */
  createDomElement () {
    const container = document.createElement('div')
    container.setAttribute('class', 'request')
    container.dataset.id = this.id

    const header = document.createElement('details')
    header.innerHTML = `
      <summary>${this.id}</summary>
      <div>Lorem ipsum.</div>
    `

    container.appendChild(header)

    return container

    // `<div class="request-data">
    //   <details open="" data-group="General">
    //     <summary>General</summary>
    //     <div class="request-data-row">
    //       <div class="request-data-row-name">Protocol Version</div>
    //       <div class="request-data-row-value">1</div>
    //     </div>
    //     <div class="request-data-row">
    //       <div class="request-data-row-name">Anonymize IP</div>
    //       <div class="request-data-row-value">1</div>
    //     </div>
    //   </details>
    // </div>`
  }
}