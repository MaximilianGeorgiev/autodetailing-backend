const express = require('express');
const router = express.Router();

const ServiceController = require('../controllers/service.js');

router.route('/')
.get(ServiceController.getAllServices)
.post(ServiceController.createService);

router.get('/id/:id', ServiceController.getServiceById);
router.get('/title/:title', ServiceController.getServiceByTitle);
router.get('/delete/:id', ServiceController.deleteService); 

router.get('/pictures/:id', ServiceController.getServicePictures);
router.get('/vehicle-types/:id', ServiceController.getServiceVehicleTypes);

router.post('/picture/add', ServiceController.addPicture);
router.post('/picture/remove', ServiceController.removePicture);

router.post('/vehicle-type/add', ServiceController.addVehicleType);
router.post('/vehicle-type/remove', ServiceController.removeVehicleType);

router.put('/:id', ServiceController.updateService);

module.exports = router;