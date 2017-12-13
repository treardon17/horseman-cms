import { observable, computed, action } from 'mobx';

class ModalState {
  @observable modalOpen = false;
}

export default new ModalState();
