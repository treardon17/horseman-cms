import { observable, computed, action } from 'mobx';

class ModalState {
  /**
  * [history The current history stack]
  * @type {Array}
  */
  @observable history = [];
  @observable isPushing = false;
  @observable modal = null;

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
    this.isPushing = true;
    this.history.push(page);
  }

  @action pushModal({ page }) {
    this.isPushing = true;
    if (this.modal) this.modal.pushHistory({ page });
    else this.push({ page });
  }

  @action pop() {
    this.isPushing = false;
    this.history.pop();
  }

  @action popModal() {
    this.isPushing = false;
    if (this.modal) this.modal.popHistory();
    else this.pop();
  }
}

export default new ModalState();
