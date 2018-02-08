require('whatwg-fetch')
const isJSON = require('is-json')

class API {
  /**
   * [makeQuery A wrapper for the fetch method]
   * @param  {[String]} query               [The url that will be queried/posted to]
   * @param  {String} [method="GET"]        [The fetch method]
   * @param  {[Object or String]} body      [The data that will be sent]
   * @return {[Promise]}
  */
  makeQuery({
    query, method = 'GET', body, headers
  }) {
    let newHeaders = null
    if (headers === undefined) {
      newHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    } else {
      newHeaders = headers
    }

    let newBody = null
    if (typeof body === 'object' && newHeaders['Content-Type'] === 'application/json') {
      newBody = JSON.stringify(body)
    } else {
      newBody = body
    }

    return new Promise((resolve, reject) => {
      if (typeof window !== 'undefined') {
        fetch(query, {
          method,
          headers: newHeaders,
          body: newBody
        })
          .then((response) => {
            if (isJSON(response)) { return response.json() }
            return response
          })
          .then((json) => {
            resolve(json)
          }).catch((error) => {
            reject(error)
          })
      } else {
        resolve({})
      }
    })
  }
}

module.exports = new API()
