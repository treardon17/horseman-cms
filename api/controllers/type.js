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
        // newTypes[type.id] = type;

        // find the Slug of the item that we changed
        let slug = '';
        const keys = Object.keys(newTypes);
        for (let i = 0; i < keys.length; i++) {
          const typeItem = newTypes[keys[i]];
          if (typeItem.id === type.id) {
            slug = typeItem.slug;
          }
        }

        // get rid of the old version
        delete newTypes[slug];
        // add the new type
        newTypes[type.slug] = type;

        FileManager.writeToFile({ path: '../data/types.json', data: JSON.stringify(newTypes, null, 2) }).then(() => {
          resolve({ type });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  deleteType({ slug }) {
    return new Promise((resolve, reject) => {
      this.getTypes().then((types) => {
        const newTypes = types;
        // remove the type completely
        delete newTypes[slug];
        FileManager.writeToFile({ path: '../data/types.json', data: JSON.stringify(newTypes, null, 2) }).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  /*
  *
  *
  * Actions
  *
  */

  handleUpdateType(req, res) {
    const type = req.body;
    if (type.name) {
      this.addOrUpdateType({ type }).then((myType) => {
        res.header('Content-Type', 'application/json').status(200).send(myType);
      }).catch((error) => {
        res.header('Content-Type', 'application/json').status(400).send({ error });
      });
    } else {
      res.header('Content-Type', 'application/json').status(400).send({ error: 'Invalid type: Missing `name` attribute.' });
    }
  }

  handleGetTypes(req, res) {
    this.getTypes().then((types) => {
      res.header('Content-Type', 'application/json').status(200).send(types);
    }).catch((err) => {
      res.header('Content-Type', 'application/json').status(500).send({ error: err });
    });
  }

  handleDeleteType(req, res) {
    const slug = req.params.slug;
    this.deleteType({ slug }).then(() => {
      res.header('Content-Type', 'application/json').status(200).send({ success: true });
    }).catch((err) => {
      res.header('Content-Type', 'application/json').status(500).send({ error: err });
    });
  }
}

module.exports = new TypeController();
