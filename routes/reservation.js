const express = require('express');
const router = express.Router();

const ReservationController = require('../controllers/reservation.js');

router.route('/')
.get(ReservationController.getAllReservations)
.post(ReservationController.createReservation);

router.get('/id/:id', ReservationController.getReservationById);

router.get('/date/:date', ReservationController.getReservationsOnDate);
router.get('/user/:id', ReservationController.getReservationsForCustomer);

router.get('/delete/:id', ReservationController.deleteReservation); 

router.put('/:id', ReservationController.updateReservation);

router.post('/service/add', ReservationController.addService);

module.exports = router;