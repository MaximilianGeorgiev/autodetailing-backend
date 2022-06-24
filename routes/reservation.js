const express = require('express');
const router = express.Router();

const AuthUtils = require("../utils/auth.js");

const ReservationController = require('../controllers/reservation.js');

router.get('/', AuthUtils.validateToken, ReservationController.getAllReservations)
router.post('/', ReservationController.createReservation);

router.get('/id/:id', ReservationController.getReservationById);

router.get('/date/:date', AuthUtils.validateToken, ReservationController.getReservationsOnDate);
router.get('/user/:id', ReservationController.getReservationsForCustomer);

router.get('/delete/:id', AuthUtils.validateToken, ReservationController.deleteReservation); 
router.get('/delete/service/:id', AuthUtils.validateToken, ReservationController.deleteReservationsWithService);
router.get('/delete/user/:id', AuthUtils.validateToken, ReservationController.deleteReservationsForUser);

router.put('/:id', AuthUtils.validateToken, ReservationController.updateReservation);

router.post('/service/add', ReservationController.addService);

module.exports = router;