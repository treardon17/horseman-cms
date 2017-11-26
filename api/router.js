const express = require('express');
const fs = require('fs-extra'); // eslint-disable-line global-require

// const creds = JSON.parse(fs.readFileSync('./creds.json'));
// const knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host: creds.host,
//     user: creds.user,
//     password: creds.password,
//     database: creds.database,
//   },
// });

const router = express.Router(); // eslint-disable-line new-cap

// import user routes
const types = require('./controllers/type');

// ROUTES
// types
router.post('/type', (req, res) => { types.handleType(req, res); });
router.get('/type', (req, res) => { types.getTypes(req, res); });

module.exports = router;
