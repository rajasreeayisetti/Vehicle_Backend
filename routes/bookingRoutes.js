const express = require('express');
const router = express.Router();
const { bookVehicle, getBookings, getBookingById } = require('../controllers/bookingController');
router.post('/', bookVehicle);
router.get('/', getBookings);
router.get('/:id', getBookingById);
module.exports = router;
