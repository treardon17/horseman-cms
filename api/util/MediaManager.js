const fs = require('fs-extra')
const Path = require('path')
const FileManager = require('./FileManager')
// const appRoot = require('app-root-path')

class MediaManager {
  getMediaFiles({ path }) {
    return new Promise((resolve, reject) => {
      FileManager.getFiles({ path }).then((files) => {
        resolve({ files })
      }).catch(err => reject(err))
    })
  }
}

module.exports = new MediaManager()
