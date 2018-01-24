const path = require('path')
const chokidar = require('chokidar')
const express = require('express')
const compress = require('compression')
const bodyParser = require('body-parser')
const execa = require('execa')

// get port
const port = parseInt(process.env.PORT, 10)

// create express instance
const app = express()

// use body parser for api requests
app.use(bodyParser.json())

// Use router for API calls
app.use('/api', (req, res, next) => {
  require(path.resolve('api/router'))(req, res, next) // eslint-disable-line
})

const watchPath = ({ filepath, message }) => {
  // listen for changes to files in /api/
  const watcher = chokidar.watch(path.resolve(filepath))
  watcher.on('ready', () => {
    watcher.on('all', () => {
      execa.shell('eslint -c .eslintrc.js --ext .js ./api --color always').then((result) => {
        console.log(message)
      }).catch(err => console.log(err.stdout))
      // clear require cache and re require new files after change
      Object.keys(require.cache).forEach((id) => {
        if (/[\/\\]api[\/\\]/.test(id)) delete require.cache[id] // eslint-disable-line
      })
    })
  })
}

watchPath({ filepath: './api/', message: 'Updated backend' })
watchPath({ filepath: './core/', message: 'Updated core' })

// start server
app.listen(port + 30)

// start Gatsby
const startGatsby = () => {
  execa.shell(`gatsby develop --port ${port} --color always`).stdout.pipe(process.stdout)
}

// lint ./api
execa.shell('eslint -c .eslintrc.js --ext .js ./api --color always').then((result) => {
  startGatsby()
}).catch((err) => {
  console.log(err.stdout)
  startGatsby()
})

// export app
module.exports = app
