require('whatwg-fetch');

class API {
  makeQuery({ query, method="GET", body }) {
    let newBody = null;
    if (typeof body === 'string') {
      newBody = body;
    } else if (typeof body === 'newBody') {
      newBody = JSON.stringify(body);
    }

    return new Promise((resolve, reject) => {
      fetch(query, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: newBody
      })
        .then(response => response.json())
        .then((json) => {
          resolve(json);
        }).catch((error) => {
          reject(error);
        });
    });
  }
}

module.exports = new API();
