const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
// const creds = JSON.parse(fs.readFileSync('./creds.json'));

// import user routes
const typeController = require('./controllers/type');
const dataController = require('./controllers/data');

// ROUTES
// typeController
router.post('/type', (req, res) => typeController.handleUpdateType(req, res));
router.get('/type', (req, res) => typeController.handleGetTypes(req, res));
router.get('/type/:id', (req, res) => typeController.handleGetTypes(req, res));
router.delete('/type/:id', (req, res) => typeController.handleDeleteType(req, res));

// dataController
router.post('/data', (req, res) => dataController.handleUpdateData(req, res));
router.get('/data', (req, res) => dataController.handleGetData(req,res));
router.get('/data/:id', (req, res) => dataController.handleGetData(req, res));
router.delete('/data/:id', (req, res) => dataController.handleDeleteData(req, res));

module.exports = router;
