const MediaManager = require('../util/MediaManager.js')

class MediaController {
  constructor() {
    this.media = null
    this.mediaPath = '../media'
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
     return new Promise((resolve, reject) => {

     })
   }


   /*
   *
   *
   * Mutations
   *
   */

   addOrUpdateMedia({ media }) {
     return new Promise((resolve, reject) => {
       this.initParentIfNeeded().then(() => {

       }).catch((error) => {
         console.log(error)
         reject(error)
       })
     })
   }

  deleteMedia({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {

      }).catch(error => reject(error))
    })
  }

  getAllMedia() {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        MediaManager.getMediaFiles({ path: this.mediaPath }).then((media) => {
          resolve(media)
        }).catch(err => reject(err))
      }).catch(error => {
        reject(error)
      })
    })
  }

  getMedia({ id }) {
    return new Promise((resolve, reject) => {
      this.initParentIfNeeded().then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
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
      const media = req.body
      this.addOrUpdateMedia({ media }).then((addedMedia) => {
        res.header('Content-Type', 'application/json').status(201).send({ media: addedMedia })
      }).catch(error => {
        res.header('Content-Type', 'application/json').status(500).send({ error })
      })
    }).catch(error => {
      res.header('Content-Type', 'application/json').status(500).send({ error })
    })
  }

  handleGetMedia(req, res) {
    this.initParentIfNeeded().then(() => {
      const id = req.params.id
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
    }).catch((error) => {
      res.header('Content-Type', 'application/json').status(500).send({ error })
    })
  }

  handleDeleteMedia(req, res) {
    this.initParentIfNeeded().then(() => {
      const id = req.params.id
      this.deleteMedia({ id }).then(() => {
        res.header('Content-Type', 'application/json').status(200).send({ success: true, id })
      }).catch(error => {
        res.header('Content-Type', 'application/json').status(500).send({ error })
      })
    }).catch((error) => {
      res.header('Content-Type', 'application/json').status(500).send({ error })
    })
  }
}

module.exports = new MediaController()