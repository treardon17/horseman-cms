import { observable, computed, action } from 'mobx';
import ObjectType from '../../core/definitions/objectType';
import API from '../../core/util/api';

class TypeState {
  @observable userMadeTypes = { };

  constructor() {
    this.typeQueue = [];
    this.updateUserMadeTypes();
  }


  /**
   *
   *
   * Helper Functions
   *
   */

  processedQueuedTypes() {
    if (this.userMadeTypes instanceof ObjectType && this.typeQueue.length > 0) {
      this.addType(this.typeQueue.shift());
      this.processedQueuedTypes();
    }
  }


  /**
   *
   *
   * Getters
   *
   */

  @computed get validTypeNames() {
    if (this.userMadeTypes instanceof ObjectType) {
      return Object.keys(ObjectType.types).concat(this.userMadeTypeNames);
    }
    return [];
  }

  @computed get secondaryTypeNames() {
    const validGeneric = Object.keys(Type.types).filter(val => val !== ObjectType.types.object && val !== ObjectType.types.list);
    if (this.userMadeTypes instanceof ObjectType) {
      return validGeneric.concat(this.userMadeTypeNames);
    }
    return validGeneric;
  }

  @computed get genericTypeNames() {
    return Object.keys(ObjectType.types);
  }

  @computed get userMadeTypeNames() {
    if (this.userMadeTypes instanceof ObjectType) {
      return this.userMadeTypes.getOrderedList().map(type => type.name);
    }
    return [];
  }

  @computed get orderedUserMadeTypeList() {
    if (this.userMadeTypes instanceof ObjectType) {
      return this.userMadeTypes.getOrderedList();
    } else {
      return [];
    }
  }


  /**
  *
  *
  * Actions
  *
  */

  // Grabs all the types in the types.json file on the server
  // and updates the types in the application to reflect what's saved
  @action updateUserMadeTypes() {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'get',
        query: `/api/type`,
      }).then((types) => {
        let typeObject = null;
        // We have an existing type object stored on the server
        // so lets create an object version of that. If no object
        // exists on the server, the server will create one
        typeObject = new ObjectType(types);
        this.userMadeTypes = typeObject;
        this.processedQueuedTypes();
        resolve(this.userMadeTypes);
      }).catch((error) => {
        reject(error);
      });
    });
  }

  @action addType(typeObject) {
    // This is the object we're going to add
    const newType = typeObject || { name: 'New module' };
    return new Promise((resolve, reject) => {
      // If we've gotten the types from the server back
      if (this.userMadeTypes instanceof ObjectType) {
        const id = this.userMadeTypes.add(newType);
        const createdType = this.userMadeTypes.get(id);
        // Add the new type
        this.addOrUpdateType(createdType).then(() => {
          resolve();
        }).catch((error) => {
          reject(error);
        });
      } else {
        // Otherwise we haven't gotten the types back from the server yet
        // so we need to queue this for when we get the types back from
        // the server
        this.typeQueue.push(newType);
      }
    });
  }

  @action addOrUpdateType(type) {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'post',
        query: `/api/type`,
        body: type.getJSON()
      }).then((types) => {
        this.updateUserMadeTypes().then((updatedTypes) => {
          resolve(updatedTypes);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }

  @action removeType(id) {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'delete',
        query: `/api/type/${id}`
      }).then((types) => {
        this.updateUserMadeTypes().then((updatedTypes) => {
          resolve(updatedTypes);
        });
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

export default new TypeState();
