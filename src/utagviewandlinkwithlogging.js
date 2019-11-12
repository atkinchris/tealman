const contentScript = document.createElement('script')
contentScript.type = 'text/javascript'
contentScript.async = true
contentScript.id = 'tealman-utagviewandlinkwithlogging'
contentScript.text = `
  function decorateWithLogging (fn, logMessagePrefix = '') {
    return function () {
      const message = {...arguments[0]}
      console.log('[Tealman]', logMessagePrefix, message)
      const result = fn.apply(this, arguments)
      return result
    }
  }

  const delay = 125
  const maxRetries = 32
  let retries = 0

  function wait () {
    if (window.utag && typeof window.utag.view === 'function' && typeof window.utag.link === 'function') {
      window.setTimeout(() => {
        window.utag.view  = decorateWithLogging(window.utag.view, 'utag.view')
        window.utag.link  = decorateWithLogging(window.utag.link, 'utag.link')
      }, delay)
    } else {
      retries++
      if (retries < maxRetries) {
        window.setTimeout(wait, delay)
      }
    }
  }

  wait()
`
document.body.appendChild(contentScript)