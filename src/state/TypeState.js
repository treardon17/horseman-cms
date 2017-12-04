import { observable, computed, action } from 'mobx';
import ObjectType from '../../core/definitions/objectType';
import API from '../../core/util/api';

class TypeState {
  @observable userMadeTypes = { };

  constructor() {
    this.updateUserMadeTypes();
  }

  // // GETTERS FOR TYPE NAMES
  @computed get validTypeNames() {
    return Object.keys(ObjectType.types).concat(this.userMadeTypeNames);
  }

  @computed get secondaryTypeNames() {
    const validGeneric = Object.keys(Type.types).filter(val => val !== ObjectType.types.object && val !== ObjectType.types.list);
    return validGeneric.concat(this.userMadeTypeNames);
  }

  @computed get genericTypeNames() {
    return Object.keys(ObjectType.types);
  }

  @computed get userMadeTypeNames() {
    return this.userMadeTypes.getOrderedList().map(type => type.name);
  }

  @computed get orderedUserMadeTypeList() {
    if (Object.keys(this.userMadeTypes).length > 0) {
      return this.userMadeTypes.getOrderedList();
    } else {
      return [];
    }
  }

  // ACTIONS
  @action addOrUpdateType(type) {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'post',
        query: `/api/type`,
        body: type
      }).then((types) => {
        this.updateUserMadeTypes().then((updatedTypes) => {
          resolve(updatedTypes);
        });
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  @action removeType(slug) {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'delete',
        query: `/api/type/${slug}`
      }).then((types) => {
        this.updateUserMadeTypes().then((updatedTypes) => {
          resolve(updatedTypes);
        });
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  // Grabs all the types in the types.json file on the server
  // and updates the types in the application to reflect what's saved
  @action updateUserMadeTypes() {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'get',
        query: `/api/type`,
      }).then((types) => {
        let typeObject = null;
        // If there are no types on the server/we got an empty object
        if (types && Object.keys(types).length === 0) {
          typeObject = new ObjectType({ name: 'Object Types', type: { primary: ObjectType.types.object } });
        } else if (types) {
          // We have an existing type object stored on the server
          // so lets create an object version of that
          typeObject = new ObjectType(types);
        }
        this.userMadeTypes = typeObject;
        resolve(this.userMadeTypes);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  // FUNCTIONS
  @action addEmptyType() {
    return new Promise((resolve, reject) => {
      const type = new ObjectType({ name: 'New module' });
      this.addOrUpdateType(type).then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }
}

const singleton = new TypeState();
export default singleton;
