import { observable, extendObservable, computed, action } from 'mobx'

class ModalState {
  constructor() {
    extendObservable(this, {
      history: [],
      isPushing: false,
      modal: null
    })
  }

  // /////////////////////////
  // GETTERS -----------------
  // /////////////////////////
  /**
   * [isOpen Gets whether or not the modal should currently be open]
   * @type {Bool}
   */
  @computed get isOpen() {
    return this.history.length > 0
  }

  @computed get currentView() {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1].page
    }
    return null
  }

  @computed get currentTitle() {
    if (this.history.length > 0) {
      return this.history[this.history.length - 1].title
    }
    return null
  }

  // /////////////////////////
  // ACTIONS -----------------
  // /////////////////////////
  @action close() {
    this.history = []
  }

  @action push({ page, title }) {
    this.isPushing = true
    this.history.push({ page, title })
  }

  @action pushModal({ page, title }) {
    this.isPushing = true
    if (this.modal) this.modal.pushHistory({ page, title })
    else this.push({ page, title })
  }

  @action pop() {
    this.isPushing = false
    this.history.pop()
  }

  @action popModal() {
    this.isPushing = false
    if (this.modal) this.modal.popHistory()
    else this.pop()
  }
}

export default new ModalState()
