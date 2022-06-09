const express = require('express');
const router = express.Router();

const ServiceController = require('../controllers/service.js');
const AuthUtils = require("../utils/auth.js");

router.get('/', ServiceController.getAllServices);
router.post('/', AuthUtils.validateToken, ServiceController.createService);

router.get('/id/:id', ServiceController.getServiceById);
router.get('/title/:title', ServiceController.getServiceByTitle);
router.get('/delete/:id', AuthUtils.validateToken, ServiceController.deleteService);

router.get('/pictures/:id', ServiceController.getServicePictures);
router.get('/vehicle-types/:id', ServiceController.getServiceVehicleTypes);

router.post('/picture/add', AuthUtils.validateToken, ServiceController.addPicture);
router.post('/picture/remove', AuthUtils.validateToken, ServiceController.removePicture);

router.post('/vehicle-type/add', AuthUtils.validateToken, ServiceController.addVehicleType);
router.post('/vehicle-type/remove', AuthUtils.validateToken, ServiceController.removeVehicleType);

router.put('/:id', AuthUtils.validateToken, ServiceController.updateService);

module.exports = router;