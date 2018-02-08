const express = require('express')
const fs = require('fs-extra')
const typeController = require('./controllers/type')
const dataController = require('./controllers/data')
const mediaController = require('./controllers/media')

// const multer = require('multer')
// const Config = require('./config/config')
//
// const MediaUpload = multer({ dest: Config.mediaPath })

// Create router
const router = express.Router()

// ROUTES
// typeController
router.post('/type', (req, res) => typeController.handleUpdateType(req, res))
router.get('/type', (req, res) => typeController.handleGetTypes(req, res))
router.get('/type/:id', (req, res) => typeController.handleGetTypes(req, res))
router.delete('/type/:id', (req, res) => typeController.handleDeleteType(req, res))

// dataController
router.post('/data', (req, res) => dataController.handleUpdateData(req, res))
router.get('/data', (req, res) => dataController.handleGetData(req, res))
router.get('/data/:id', (req, res) => dataController.handleGetData(req, res))
router.delete('/data/:id', (req, res) => dataController.handleDeleteData(req, res))

// mediaController
// router.post('/media', MediaUpload.array('media', 12), (req, res) => mediaController.handleUpdateMedia(req, res))
router.post('/media', (req, res) => mediaController.handleUpdateMedia(req, res))
router.get('/media', (req, res) => mediaController.handleGetMedia(req, res))
router.get('/media/:id', (req, res) => mediaController.handleGetMedia(req, res))
router.delete('/media/:id', (req, res) => mediaController.handleDeleteMedia(req, res))

module.exports = router
