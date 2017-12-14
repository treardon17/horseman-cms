import { observable, computed, action } from 'mobx';

class ModalState {
  /**
  * [history The current history stack]
  * @type {Array}
  */
  @observable history = [];

  // /////////////////////////
  // GETTERS -----------------
  // /////////////////////////
  /**
   * [isOpen Gets whether or not the modal should currently be open]
   * @type {Bool}
   */
  @computed get isOpen() {
    return this.history.length > 0;
  }

  @computed get currentView() {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1];
    }
    return null;
  }

  // /////////////////////////
  // ACTIONS -----------------
  // /////////////////////////
  @action close() {
    this.history = [];
  }

  @action push({ page }) {
    this.history.push(page);
  }

  @action pop() {
    this.history.pop();
  }
}

export default new ModalState();
