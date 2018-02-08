const fs = require('fs-extra')
const Path = require('path')
const isJSON = require('is-json')

class FileManager {
  createFolderIfNeeded(myDir) {
    const newDir = Path.resolve(__dirname, myDir)
    return new Promise((resolve) => {
      fs.access(myDir, (err) => {
        if (err && err.code === 'ENOENT') {
          fs.mkdir(newDir)
          resolve()
        } else {
          resolve()
        }
      })
    })
  }

  writeToFile({ path, data }) {
    const newPath = Path.resolve(__dirname, path)
    return new Promise((resolve, reject) => {
      fs.writeFile(newPath, data, { flag: 'w' }, (err) => {
        if (err) { reject() }
        else { resolve() }
      })
    })
  }

  readFile({ path }) {
    const newPath = Path.resolve(__dirname, path)
    return new Promise((resolve, reject) => {
      fs.readFile(newPath, (err, data) => {
        if (err) reject(err)
        else resolve(data.toString())
      })
    })
  }

  fileToObject({ path }) {
    return new Promise((resolve, reject) => {
      this.readFile({ path }).then((data) => {
        if (isJSON(data)) {
          resolve(JSON.parse(data))
        } else {
          reject(`Invalid JSON in file ${path}`)
        }
      }).catch((err) => {
        reject(err)
      })
    })
  }

  getFiles({ path }) {
    const newPath = Path.resolve(__dirname, path)
    return new Promise((resolve, reject) => {
      fs.readdir(newPath, (err, files) => {
        if (err) { reject(err) }
        else { resolve(files) }
      })
    })
  }
}

module.exports = new FileManager()
