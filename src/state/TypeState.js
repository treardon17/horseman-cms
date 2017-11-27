import { observable, computed, action } from 'mobx';
import Type from '../resources/scripts/types/Type';
import Util from '../resources/scripts/util/util';
import API from '../resources/scripts/util/API.js';

class TypeState {
  @observable userMadeTypes = { };

  constructor() {
    this.updateUserMadeTypes();
  }

  // GETTERS FOR TYPE NAMES
  @computed get validTypeNames() {
    return Object.keys(Type.types).concat(Object.keys(this.userMadeTypes));
  }

  @computed get secondaryTypeNames() {
    const validGeneric = Object.keys(Type.types).filter(val => val !== Type.types.object && val !== Type.types.list);
    return validGeneric.concat(Object.keys(this.userMadeTypeNames));
  }

  @computed get genericTypeNames() {
    return Object.keys(Type.types);
  }

  @computed get userMadeTypeNames() {
    return Object.keys(this.userMadeTypes);
  }

  // ACTIONS
  @action addOrUpdateType(type) {
    return new Promise((resolve, reject) => {
      this.userMadeTypes[type.slug] = type;
      API.makeQuery({
        method: 'post',
        query: `/api/type`,
        body: type
      }).then((types) => {
        this.updateUserMadeTypes();
        resolve(types);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  @action updateUserMadeTypes() {
    return new Promise((resolve, reject) => {
      API.makeQuery({
        method: 'get',
        query: `/api/type`,
      }).then((types) => {
        this.userMadeTypes = types;
        resolve(types);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }

  // FUNCTIONS
  @action addEmptyType() {
    return new Promise((resolve, reject) => {
      const type = new Type({ name: 'New module' });
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
