const FileManager = require('../util/FileManager.js');

class TypeController {
  getTypes() {
    return new Promise((resolve, reject) => {
      FileManager.fileToObject({ path: '../data/types.json' }).then((object) => {
        resolve(object);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  addOrUpdateType({ type }) {
    return new Promise((resolve, reject) => {
      this.getTypes().then((types) => {
        const newTypes = types;
        newTypes[type.name] = type;
        FileManager.writeToFile({ path: '../data/types.json', data: JSON.stringify(newTypes, null, 2) }).then(() => {
          resolve({ success: true, type });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }
}

const typeController = new TypeController();

module.exports = {
  handleType: (req, res) => {
    const type = req.body;
  
    if (type.name) {
      typeController.addOrUpdateType({ type }).then((params) => {
        res.header('Content-Type', 'application/json').status(200).send(params);
      }).catch((error) => {
        res.header('Content-Type', 'application/json').status(400).send({ error });
      });
    } else {
      res.header('Content-Type', 'application/json').status(400).send({ error: 'Invalid type: Missing `name` attribute.' });
    }
  },
  getTypes: (req, res) => {
    typeController.getTypes().then((types) => {
      res.header('Content-Type', 'application/json').status(200).send(types);
    }).catch((err) => {
      res.header('Content-Type', 'application/json').status(500).send({ error: err });
    });
  }
};