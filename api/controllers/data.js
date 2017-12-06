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
       if (this.data == null) {
         FileManager.fileToObject({ path: '../data/data.json' }).then((dataObject) => {
           this.data = dataObject;
           this.saveChanges().then(() => {
             resolve();
           }).catch((error) => {
             reject(error);
           });
         }).catch((error) => {
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

   addOrUpdateData({ data }) {
     const { _id, _typeID } = data;
   }

   deleteData({ id }) {

   }


  /*
  *
  *
  * Actions
  *
  */

  handleUpdateData(req, res) {
    return new Promise(() => {
      this.initParentIfNeeded().then(() => {
        const type = req.body;
      }).catch((error) => {
        res.header('Content-Type', 'application/json').status(500).send({ error });
      });
    });
  }

  handleGetData(req, res) {
    return new Promise(() => {
      this.initParentIfNeeded().then(() => {
        const id = req.params.id;
      }).catch((error) => {
        res.header('Content-Type', 'application/json').status(500).send({ error });
      });
    });
  }

  handleDeleteData(req, res) {
    return new Promise(() => {
      this.initParentIfNeeded().then(() => {
        const id = req.params.id;
        this.deleteData({ id });
      }).catch((error) => {
        res.header('Content-Type', 'application/json').status(500).send({ error });
      });
    });
  }
}

module.exports = new DataController();
