import { observable, computed, action } from 'mobx';
import ObjectType from '../../core/definitions/objectType';
import API from '../../core/util/api';

class DataState {
  @observable userData = { };

  // constructor() {
  // }

  /**
   *
   *
   * Getters
   *
   */


  /**
  *
  *
  * Actions
  *
  */

  // Grabs all the data in the data.json file on the server
  // and updates the data in the application to reflect what's saved
  @action updateUserData() {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'get',
        query: `/api/data`,
      }).then((data) => {
        this.userData = data;
        resolve(this.userData);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  @action addOrUpdateData(data) {
    return new Promise((resolve, reject) => {
      // If we've gotten the types from the server back
      if (typeof this.userData === 'object') {
        // Tell the server about the changes we made
        API.makeQuery({
          method: 'post',
          query: `/api/data`,
          body: newData
        }).then(() => {
          this.updateUserData().then((updatedData) => {
            resolve(updatedData);
          });
        }).catch((error) => {
          reject(error);
        });
      }
    });
  }

  @action removeData(id) {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'delete',
        query: `/api/data/${id}`
      }).then((types) => {
        this.updateUserData().then((updatedData) => {
          resolve(updatedData);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

export default new DataState();
