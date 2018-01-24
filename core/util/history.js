import createHistory from 'history/createBrowserHistory'

class History {
  constructor() {
    this.history = createHistory()
    this.unlisten = null
    this.listeners = { }
    this.hashHistory = [window.location.pathname]
    this.historyLength = window.history.length
    this.currentRoute = window.location.pathname
    this.allowPushDuplicates = false
    this.setBinds()

    this.directions = {
      push: 'PUSH',
      pop: 'POP',
    }
  }

  /* eslint-disable */
  guid() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}${s4()}`;
  }
  /* eslint-enable */

  setBinds() {
    this.unlisten = this.history.listen(this.historyChanged.bind(this))
  }

  /**
   * listen - Subscribe to history changes.
   *
   * @param  {Function} callback - Function to be run when history change occurs
   * @return {String} Unique ID to reference listener
   */
  listen(callback) {
    const id = this.guid()
    this.listeners[id] = callback
    return id
  }

  /**
   * Unsubscribe to the history change notifications.
   *
   * @param  {String} id - The string identifier returned by 'listen'
   * @return {void}
   */
  unlisten(id) {
    this.listeners[id] = null
    delete this.listeners[id]
  }

  /**
   * push - Push a route to the page history. This will change the page.
   * Also, to prevent loading the same page over and over again, this prevents
   * pushing the current path again, unless `this.allowPushDuplicates` is set to true
   *
   * @param  {String} path - Route to be pushed to the history
   * @return {void}
   */
  push(path) {
    if (this.currentRoute !== path || this.allowPushDuplicates) {
      this.currentRoute = path
      this.history.push(path)
    }
  }


  /**
   * pop - Pop the history state --> go back one in history
   *
   * @return {void}
   */
  pop() {
    this.history.goBack()
  }

  /**
   * getHistoryDirection - description
   *
   * We've gotta determine which direction in history we're going.
   * `action` will be `PUSH` only if we called History.push,
   * but not if we pressed the forward arrow in the browser.
   * Here we're checking to see if the route we're requesting was
   * the last page we were on.  If it is, we probably went backwards (POP)
   * in history.  Otherwise, we probably pushed (PUSH) to the history
   *
   * @param  {String} location - The path about to be loaded
   * @return {String} The direction the history is moving (PUSH is forward, POP is backwards)
   */
  getHistoryDirection(location) {
    const prevRoute = this.hashHistory[this.hashHistory.length - 2]
    const currentRoute = location.pathname

    if (prevRoute === currentRoute) {
      this.hashHistory.pop()
      return this.directions.pop
    }
    this.hashHistory.push(location.pathname)
    return this.directions.push
  }


  /**
   * historyChanged - Notifies all listeners of history changes
   *
   * @param  {Object} location - window location object for new route
   * @param  {String} action - direction the history is heading
   * @return {void}
   */
  historyChanged(location, action) {
    // Get the direction (back button is POP, forward button is PUSH)
    const direction = this.getHistoryDirection(location)
    const keys = Object.keys(this.listeners)
    for (let i = 0; i < keys.length; i += 1) {
      const listener = this.listeners[keys[i]]
      if (typeof listener === 'function') {
        listener(location, direction)
      }
    }
  }
}

const history = new History()
export default history
