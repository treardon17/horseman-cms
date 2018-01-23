const path = require('path');
const chokidar = require('chokidar');
const express = require('express');
const compress = require('compression');
const bodyParser = require('body-parser');
const execa = require('execa');

// get port
const port = parseInt(process.env.PORT);

// create express instance
const app = express();

// use body parser for api requests
app.use(bodyParser.json());

// Use router for API calls
app.use('/api', (req, res, next) => {
  require(path.resolve('api/router'))(req, res, next);
});

const watchPath = ({ filepath, message }) => {
  // listen for changes to files in /api/
  const watcher = chokidar.watch(path.resolve(filepath));
  watcher.on('ready', function() {
    watcher.on('all', function() {
      execa.shell(`eslint -c .eslintrc.js --ext .js ./api --color always`).then((result) => {
        console.log(message)
      }).catch(err => console.log(err.stdout))
      // clear require cache and re require new files after change
      Object.keys(require.cache).forEach(function(id) {
        if (/[\/\\]api[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });
}

watchPath({ filepath: './api/', message: 'Updated backend' });
watchPath({ filepath: './core/', message: 'Updated core' });

// start server
app.listen(port + 30);

// lint ./api
execa.shell(`eslint -c .eslintrc.js --ext .js ./api --color always`).then((result) => {
  startGatsby()
}).catch((err) => {
  console.log(err.stdout)
  startGatsby()
})

// start Gatsby
const startGatsby = () => {
  execa.shell(`gatsby develop --port ${port} --color always`).stdout.pipe(process.stdout);
}

// export app
module.exports = app;
