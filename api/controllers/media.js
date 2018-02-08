const FileManager = require('../util/FileManager.js')
const Config = require('../config/config')
const multer = require('multer')

// const upload = multer({ dest: Config.mediaPath }).array('media', 20)
// CONFIGURATION FOR STORING FILES
const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, Config.mediaPath)
  },
  filename(req, file, callback) {
    callback(null, file.originalname)
  }
})
const upload = multer({ storage }).array('media', 20)

// CONTROLLER DEFINITION
class MediaController {
  constructor() {
    this.mediaPath = Config.mediaPath
  }

  /**
  *
  *
  * Helper Functions
  *
  */
  initParentIfNeeded() {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  saveChanges() {
    console.log(this.media)
    return new Promise((resolve, reject) => {})
  }


  /*
  *
  *
  * Mutations
  *
  */

  addOrUpdateMedia({ req, res }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        upload(req, res, (err) => {
          if (err) { reject(err) }
          else resolve()
        })
      }).catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  deleteMedia({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve()
      }).catch(error => reject(error))
    })
  }

  getAllMedia() {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        FileManager.getFiles({ path: this.mediaPath }).then((media) => {
          resolve(media)
        }).catch(err => reject(err))
      }).catch(error => reject(error))
    })
  }

  getMedia({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve()
      }).catch(error => reject(error))
    })
  }

  /*
  *
  *
  * Actions
  *
  */

  handleUpdateMedia(req, res) {
    this.initParentIfNeeded().then(() => {
      this.addOrUpdateMedia({ req, res }).then((addedMedia) => {
        res.header('Content-Type', 'application/json').status(201).send({ success: true })
      }).catch(error => res.header('Content-Type', 'application/json').status(500).send({ error }))
    }).catch(error => res.header('Content-Type', 'application/json').status(500).send({ error }))
  }

  handleGetMedia(req, res) {
    this.initParentIfNeeded().then(() => {
      const { id } = req.params
      // If the user is asking for a specific piece of media
      if (id != null) {
        console.log(`Getting media with id ${id}`)
        this.getMedia({ id }).then((media) => {
          res.header('Content-Type', 'application/json').status(200).send({ media })
        })
      } else {
        console.log('Getting all media')
        this.getAllMedia().then((media) => {
          res.header('Content-Type', 'application/json').status(200).send(media)
        })
      }
    }).catch(error => res.header('Content-Type', 'application/json').status(500).send({ error }))
  }

  handleDeleteMedia(req, res) {
    this.initParentIfNeeded().then(() => {
      const { id } = req.params
      this.deleteMedia({ id }).then(() => {
        res.header('Content-Type', 'application/json').status(200).send({ success: true, id })
      }).catch(error => res.header('Content-Type', 'application/json').status(500).send({ error }))
    }).catch(error => res.header('Content-Type', 'application/json').status(500).send({ error }))
  }
}

module.exports = new MediaController()
