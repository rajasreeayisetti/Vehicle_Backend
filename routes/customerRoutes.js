const express = require('express');
const router = express.Router();
const { registerCustomer, authCustomer, getCustomerProfile, getCustomerBookings } = require('../controllers/customerController');

router.post('/', registerCustomer);
router.post('/login', authCustomer);
router.get('/:id', getCustomerProfile);
router.get('/:id/bookings', getCustomerBookings);

module.exports = router;
