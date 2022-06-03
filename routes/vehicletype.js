const express = require('express');
const router = express.Router();

const VehicleTypeController = require("../controllers/vehicletype.js");

router.route('/')
.get(VehicleTypeController.getAllVehicleTypes)
.post(VehicleTypeController.createVehicleType);

router.get("/id/:id", VehicleTypeController.getVehicleTypeById);
router.get("/type/:type", VehicleTypeController.getVehicleTypeByType);
router.get('/delete/:id', VehicleTypeController.deleteVehicleType); 

router.put('/:id', VehicleTypeController.updateVehicleType);

module.exports = router;