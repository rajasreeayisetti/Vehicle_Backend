const Customer = require('../models/Customer');
const Booking = require('../models/Booking');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new customer
// @route   POST /api/customers
const registerCustomer = async (req, res) => {
    const { name, email, phone, address, password } = req.body;
    try {
        const customerExists = await Customer.findOne({ email });
        if (customerExists) return res.status(400).json({ message: 'Customer already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const customer = await Customer.create({
            name, email, phone, address, password: hashedPassword
        });

        const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get customer profile
// @route   GET /api/customers/:id
const getCustomerProfile = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('-password');
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get customer booking history
// @route   GET /api/customers/:id/bookings
const getCustomerBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customerId: req.params.id }).populate('vehicleId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth customer & get token
// @route   POST /api/customers/login
const authCustomer = async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);
    try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
            console.log('Customer not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, customer.password);
        console.log(`Password match: ${isMatch}`);

        if (isMatch) {
            const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                _id: customer._id,
                name: customer.name,
                email: customer.email,
                token
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerCustomer, authCustomer, getCustomerProfile, getCustomerBookings };
