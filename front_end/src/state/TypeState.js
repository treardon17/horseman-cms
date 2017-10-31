import { observable, computed, asStructure } from 'mobx';
import Type from '../resources/scripts/types/Type';

class TypeState {
  @observable _userMadeTypes = [];
  @observable _genericTypes = [];

  constructor() {
    this._genericTypes = Object.keys(Type.types).map(value => value) || [];
  }

  @computed get validTypes() {
    return this._genericTypes.concat(this._userMadeTypes);
  }

  @computed get secondaryTypes() {
    const validGeneric = this.genericTypes.filter(val => val !== Type.types.object && val !== Type.types.list);
    return validGeneric.concat(this.userMadeTypes);
  }

  @computed get genericTypes() {
    return this._genericTypes;
  }

  @computed get userMadeTypes() {
    return this._userMadeTypes;
  }
}

const singleton = new TypeState();
export default singleton;
