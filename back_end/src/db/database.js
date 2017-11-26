const mongoose = require('mongoose');
const graphql = require('graphql');

class Database {
  constructor () {
    // Setup database connection
    this.uri = 'mongodb://localhost:27017';
    mongoose.Promise = global.Promise;
    mongoose.connect(this.uri, {
      keepAlive: true,
      reconnectTries: Number.MAX_VALUE,
      useMongoClient: true
    });

    this.db = mongoose.connection;
  }

  setBinds() {
    this.db.on('error', console.error.bind(console, 'connection error:'));

    this.pipe.stdout.on('data', function (data) { printback(data.toString('utf8')); });
    this.pipe.stderr.on('data', (data) => { printback(data.toString('utf8')); });
    this.pipe.on('close', (code) => { callback('Process exited with code: '+ code); });
  }
}

module.exports = new Database();