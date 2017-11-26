import { observable, computed, action } from 'mobx';
import Type from '../resources/scripts/types/Type';
import Util from '../resources/scripts/util/util';

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
    this.userMadeTypes[type.slug] = type;
    console.log(type);
  }
}

const singleton = new TypeState();
export default singleton;
