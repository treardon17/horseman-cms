require('whatwg-fetch');

class API {
  makeQuery({ query, method="GET", body }) {
    return new Promise((resolve, reject) => {
      fetch(query, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
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

export default new API();
