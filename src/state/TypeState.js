import { observable, computed, action } from 'mobx';
import Type from '../resources/scripts/types/Type';
import Util from '../resources/scripts/util/util';
import API from '../resources/scripts/util/API.js';

class TypeState {
  @observable userMadeTypes = {};

  // constructor() {
  // }

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
      }).then(() => {
        resolve();
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }
}

const singleton = new TypeState();
export default singleton;
