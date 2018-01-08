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

  /**
   * initParentIfNeeded - This checks if we've initialized our parentObject.
   * if we have, it immediately resolves, otherwise it creates a parent object
   * from the JSON in the types.json file. If there is nothing in that file, it
   * saves a new object to that file.
   */
  initParentIfNeeded() {
    return new Promise((resolve, reject) => {
      // If we already have a parent object, we don't need to recreate it
      if (this.parentObject != null) {
        resolve();
      } else {
        // Otherwise we don't have a parent object, so we
        // read the current types file and get the current types
        FileManager.fileToObject({ path: '../data/types.json' }).then((storedTypes) => {
          // There is one parent container. All of the parent's
          // children are the types.
          this.parentObject = new ObjectType(storedTypes);
          // Save our progress
          this.saveChanges().then(() => {
            resolve();
          }).catch((error) => {
            reject(error);
          });
        }).catch((err) => {
          // The file didn't have a valid JSON object in it,
          // so we make a completely new parent and save that
          // to the file
          this.parentObject = this.createParent();
          this.saveChanges().then(() => {
            resolve();
          }).catch((error) => {
            console.log('Error initializing parent: ', error);
            reject(error);
          });
        });
      }
    });
  }


  /**
   * createParent - Creates an ObjectType that will act as the parent
   * container for all other object types to live inside
   *
   * @param  {Object} obj description   The data that will be used to create
   * the new object type. If it is null, we use default values.
   */
  createParent(obj) {
    if (obj && Object.keys(obj).length > 0) {
      // Otherwise we want to make an object version
      // of the json object stored in the types file
      return new ObjectType(obj);
    } else {
      // There isn't anything in the types object
      // we should make a parent object
      return new ObjectType({ name: 'Parent Type Container', typePrimary: ObjectType.types.object });
    }
  }


  /**
   * saveChanges - Takes the current state of the parent object and
   * saves it to the types.json file.
   */
  saveChanges() {
    return new Promise((resolve, reject) => {
      FileManager.writeToFile({ path: '../data/types.json', data: this.parentObject.getJSON() }).then(() => {
        console.log('Changes to TYPE saved');
        resolve();
      }).catch((err) => {
        console.log('Could not save changes to TYPE', err);
        reject(err);
      });
    });
  }


  /**
   * getTypes - Reads the types.json file and returns an object version of that file.
   */
  getTypes() {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve(this.parentObject);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getType({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve(this.parentObject.get(id));
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getTypeSync({ id }) {
    if (this.parentObject) {
      return this.parentObject.get(id);
    }
    return null;
  }

  /*
  *
  *
  * Mutations
  *
  */


  /**
   * addOrUpdateType - Adds a type to the parent if it doesn't exist
   * or edits it if it does exist
   *
   * @param  {ObjectType} type The type to be edited or added
   */
  addOrUpdateType({ type }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        const newType = new ObjectType(type);
        // If the type is an actual object
        if (newType && newType.id) {
          // If the type exists in the parent object, we edit it
          if (this.parentObject.get(newType.id)) {
            this.parentObject.edit(newType);
          } else {
            // If the type does not exist in the parent object,
            // we add it
            this.parentObject.add(newType);
          }
        }

        this.saveChanges().then(() => {
          resolve(newType);
        }).catch((error) => {
          reject(error);
        });
      }).catch((error) => {
        reject(error);
        console.log('Issue initializing parent');
      });
    });
  }


  /**
   * deleteType - Deletes the type with the given ID
   *
   * @param  {String} { id } The string ID of the type to be deleted
   */
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
          res.header('Content-Type', 'application/json').status(201).send(myType.getJSON());
        }).catch((error) => {
          console.log(`Error processing update type`, error);
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
        this.getType({ id }).then((type) => {
          res.header('Content-Type', 'application/json').status(200).send(type.getJSON());
        }).catch((error) => {
          res.header('Content-Type', 'application/json').status(500).send({ error });
        });
      }
      this.getTypes().then((types) => {
        res.header('Content-Type', 'application/json').status(200).send(types.getJSON());
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
        res.header('Content-Type', 'application/json').status(202).send({ success: true });
      }).catch((err) => {
        res.header('Content-Type', 'application/json').status(500).send({ error: err });
      });
    }).catch(() => {
      res.header('Content-Type', 'application/json').status(500).send({ error: err });
    });
  }
}

module.exports = new TypeController();
