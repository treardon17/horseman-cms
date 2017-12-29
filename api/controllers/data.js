const FileManager = require('../util/FileManager.js');
const TypeController = require('./type');

class DataController {
  constructor() {
    this.data = null;
  }


  /**
   *
   *
   * Helper Functions
   *
   */
   initParentIfNeeded() {
     return new Promise((resolve, reject) => {
       // If we already initialized our data object,
       // we don't have to make another read operation
       if (this.data != null) {
         resolve();
       } else {
         // Otherwise, we need to read the data.json file
         // and grab the current data from there
         FileManager.fileToObject({ path: '../data/data.json' }).then(dataObject => {
           // Set our data object
           this.data = dataObject;
           resolve();
         }).catch((error) => {
           // If something bad happened, we need to abort
           // so we start fresh with an empty object
           // and save that to the file
           this.data = {};
           this.saveChanges().then(() => {
             resolve();
           }).catch((error) => {
             reject(error);
           });
         });
       }
     });
   }

   /**
    * saveChanges - Takes the current state of the data object and
    * saves it to the data.json file.
    */
   saveChanges() {
     return new Promise((resolve, reject) => {
       FileManager.writeToFile({ path: '../data/data.json', data: JSON.stringify(this.data, null, 2) }).then(() => {
         console.log('Changes to DATA saved');
         resolve();
       }).catch((err) => {
         console.log('Could not save changes to DATA');
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

   /**
    * [addOrUpdateData Adds new data or updates existing data]
    * @param {[Object]} data [The new data that should be added/updated]
    */
   addOrUpdateData({ data }) {
     console.log('data is: ', data);
     return new Promise((resolve, reject) => {
       this.initParentIfNeeded().then(() => {
         const { _id, _typeID } = data;
         // Make sure we have an _id and a _typeID because
         // our data isn't very useful without them
         if (_id && _typeID) {
           // If the typeID is still a valid type, we should
           // validate the type so it matches the current definition
           TypeController.getType({ id: _typeID }).then(typeDef => {
             const object = this.data[_id];
             if (typeDef) {
               // If we have this object in the data store already
               if (object) {
                 // We're updating the scheme of the object so that it matches
                 // the current parent object
                 this.data[_id] = typeDef.updateExistingObjectSchema({ object: data });
               } else {
                 // We're adding this piece of data for the first time
                 this.data[_id] = typeDef.updateExistingObjectSchema({ object: data });
               }
             } else {
               // The type doesn't exist any longer...
               console.log(`Attempting to update ${_id}, but the type ${_typeID} no longer exists.`)
             }

             // Save our changes to the data file
             this.saveChanges().then(() => resolve(this.data[_id])).catch(error => reject(error));
           }).catch((error) => {
             console.log(error);
             reject(error)
           });
         }
       }).catch((error) => {
         console.log(error);
         reject(error)
       });
     });
   }

  deleteData({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        delete this.data[id];
        this.saveChanges().then(() => {
          resolve();
        }).catch(error => reject(error));
      }).catch(error => reject(error));
    });
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve(this.data);
      }).catch(error => {
        reject(error);
      });
    });
  }

  getData({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve(this.data[id]);
      }).catch(error => {
        reject(error);
      });
    });
  }

  /*
  *
  *
  * Actions
  *
  */

  handleUpdateData(req, res) {
    this.initParentIfNeeded().then(() => {
      const data = req.body;
      console.log('Handling data', data);
      this.addOrUpdateData({ data }).then((addedData) => {
        res.header('Content-Type', 'application/json').status(201).send({ data: addedData });
      }).catch(error => {
        res.header('Content-Type', 'application/json').status(500).send({ error });
      });
    }).catch(error => {
      res.header('Content-Type', 'application/json').status(500).send({ error });
    });
  }

  handleGetData(req, res) {
    this.initParentIfNeeded().then(() => {
      const id = req.params.id;
      console.log('id is:', id);
      // If the user is asking for a specific piece of data
      if (id) {
        this.getData({ id }).then((data) => {
          res.header('Content-Type', 'application/json').status(200).send({ data });
        });
      } else {
        this.getAllData().then((data) => {
          res.header('Content-Type', 'application/json').status(200).send({ data });
        });
      }
    }).catch((error) => {
      res.header('Content-Type', 'application/json').status(500).send({ error });
    });
  }

  handleDeleteData(req, res) {
    this.initParentIfNeeded().then(() => {
      const id = req.params.id;
      this.deleteData({ id }).then(() => {
        res.header('Content-Type', 'application/json').status(200).send({ success: true, id });
      }).catch(error => {
        res.header('Content-Type', 'application/json').status(500).send({ error });
      });
    }).catch((error) => {
      res.header('Content-Type', 'application/json').status(500).send({ error });
    });
  }
}

module.exports = new DataController();
