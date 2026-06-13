const express = require('express');
const router = express.Router();
const { bookVehicle, getBookings } = require('../controllers/bookingController');

router.post('/', bookVehicle);
router.get('/', getBookings);

module.exports = router;
