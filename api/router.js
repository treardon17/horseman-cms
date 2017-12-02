const express = require('express');
const fs = require('fs-extra'); // eslint-disable-line global-require

// const creds = JSON.parse(fs.readFileSync('./creds.json'));

const router = express.Router(); // eslint-disable-line new-cap

// import user routes
const typeController = require('./controllers/type');
const dataController = require('./controllers/data');

// ROUTES
// typeController
router.post('/type', (req, res) => typeController.handleType(req, res));
router.get('/type', (req, res) => typeController.getTypes(req, res));
router.delete('/type/:slug', (req, res) => typeController.deleteType(req, res));

router.getData('/data', (req, res) => dataController.getData(req,res));

module.exports = router;
