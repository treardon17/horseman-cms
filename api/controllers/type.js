const FileManager = require('../util/FileManager.js');
const ObjectType = require('../../core/definitions/objectType');

class TypeController {
  constructor() {
    this.parentObject = null;
  }

  /*
  *
  *
  * Helpers
  *
  */

  initParentIfNeeded() {
    return new Promise((resolve, reject) => {
      // If we already have a parent object, we don't need to recreate it
      if (this.parentObject != null) {
        resolve();
      } else {
        // Read the current types file and get the current types
        this.getTypes().then((storedTypes) => {
          this.parentObject = this.createParent(storedTypes);
          this.saveChanges().then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        }).catch(() => {
          this.parentObject = this.createParent();
          this.saveChanges().then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        });
      }
    });
  }

  createParent(obj) {
    if (obj && Object.keys(obj).length > 0) {
      // Otherwise we want to make an object version
      // of the json object stored in the types file
      return new ObjectType(obj);
    } else {
      // There isn't anything in the types object
      // we should make a parent object
      return new ObjectType({ name: 'Parent Type Container', type: { primary: ObjectType.types.object } });
    }
  }

  saveChanges() {
    return new Promise((resolve, reject) => {
      FileManager.writeToFile({ path: '../data/types.json', data: JSON.stringify(this.parentObject, null, 2) }).then(() => {
        console.log('Changes saved');
        resolve();
      }).catch((err) => {
        console.log('Could not save changes');
        reject(err);
      });
    });
  }

  getTypes() {
    return new Promise((resolve, reject) => {
      FileManager.fileToObject({ path: '../data/types.json' }).then((object) => {
        // There is one parent container. All of the parent's
        // children are the types.
        resolve(object);
      }).catch((err) => {
        reject(err);
      });
    });
  }


  /*
  *
  *
  * Mutations
  *
  */

  addOrUpdateType({ type }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        const newType = new ObjectType(type);
        // If the type is an actual object
        if (newType && newType.id) {
          // If the type exists in the parent object
          if (this.parentObject.get(newType.id)) {
            this.parentObject.edit(newType);
          } else {
            this.parentObject.add(newType);
          }
        }

        this.saveChanges().then(() => {
          resolve({ type: newType });
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
        console.log('Issue initializing parent');
      });
    });
  }

  deleteType({ id }) {
    console.log(`Deleting ${id}`);
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        this.parentObject.remove({ id });
        this.saveChanges().then(() => {
          resolve({ success: id });
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error)
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
    this.initParentIfNeeded().then(() => {
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
    }).catch((error) => {
      res.header('Content-Type', 'application/json').status(500).send({ error });
    });
  }

  handleGetTypes(req, res) {
    const id = req.params.id;
    this.initParentIfNeeded().then(() => {
      if (id) {
        console.log(`DELETE TYPE ${id} HERE. NOT YET IMPLEMENTED`);
      }
      this.getTypes().then((types) => {
        res.header('Content-Type', 'application/json').status(200).send(types);
      }).catch((error) => {
        res.header('Content-Type', 'application/json').status(500).send({ error });
      });
    }).catch((error) => {
      res.header('Content-Type', 'application/json').status(500).send({ error });
    });
  }

  handleDeleteType(req, res) {
    this.initParentIfNeeded().then(() => {
      const id = req.params.id;
      this.deleteType({ id }).then(() => {
        res.header('Content-Type', 'application/json').status(200).send({ success: true });
      }).catch((err) => {
        res.header('Content-Type', 'application/json').status(500).send({ error: err });
      });
    }).catch(() => {
      res.header('Content-Type', 'application/json').status(500).send({ error: err });
    });
  }
}

module.exports = new TypeController();
