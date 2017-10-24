
class API {
  makeQuery(query, type="GET") {
    return new Promise((resolve, reject) => {
      fetch(query, { method: type })
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
