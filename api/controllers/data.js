// const FileManager = require('../util/FileManager.js');

class DataController {
  getData(req, res) {
    return new Promise((resolve, reject) => {
      resolve();
    });
  }
  /*
  *
  *
  * Actions
  *
  */
  handleGetData(req, res) {
    // get some data...
    this.getData().then((data) => {
      res.header('Content-Type', 'application/json').status(200).send(data);
    }).catch((err) => {
      res.header('Content-Type', 'application/json').status(500).send({ error: err });
    });
  }
}

module.exports = new DataController();
