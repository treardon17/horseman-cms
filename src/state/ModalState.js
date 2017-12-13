import { observable, computed, action } from 'mobx';

class ModalState {
  @observable modalOpen = false;
  @observable modalItems = null;

  @action close() {
    this.modalItems = null;
    this.modalOpen = false;
  }

  @action open(arg = { items: null }) {
    const { items } = arg;
    this.modalItems = items;
    this.modalOpen = true;
  }
}

export default new ModalState();
