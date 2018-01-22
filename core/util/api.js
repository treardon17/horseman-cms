require('whatwg-fetch')

class API {
  /**
   * [makeQuery A wrapper for the fetch method]
   * @param  {[String]} query               [The url that will be queried/posted to]
   * @param  {String} [method="GET"]        [The fetch method]
   * @param  {[Object or String]} body      [The data that will be sent]
   * @return {[Promise]}
  */
  makeQuery({ query, method = 'GET', body }) {
    let newBody = null
    if (typeof body === 'string') {
      newBody = body
    } else if (typeof body === 'object') {
      newBody = JSON.stringify(body)
    }

    return new Promise((resolve, reject) => {
      fetch(query, {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: newBody
      })
        .then(response => response.json())
        .then((json) => {
          resolve(json)
        }).catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = new API()
