class WindowUtil {
  /**
   * highlightAll - Highlights the current field so all text is selected
   *
   * @return {void}
   */
  highlightAll() {
    // If we have a target focused
    if (document.activeElement) {
      // Wait until the target has finished focusing
      setTimeout(() => {
        // Select all text on the focused element
        document.execCommand('selectAll', false, null);
      }, 0);
    }
  }
}

module.exports = new WindowUtil();
