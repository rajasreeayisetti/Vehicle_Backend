const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');
const generateInvoice = require('../utils/invoiceGenerator');
const path = require('path');
const fs = require('fs');

// @desc    Book a vehicle
// @route   POST /api/bookings
const bookVehicle = async (req, res) => {
    const { customerId, vehicleId, startDate, endDate, totalAmount } = req.body;
    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle || !vehicle.availability) {
            return res.status(400).json({ message: 'Vehicle is not available' });
        }

        const customer = await Customer.findById(customerId);
        const booking = await Booking.create({
            customerId,
            vehicleId,
            startDate,
            endDate,
            totalAmount,
            paymentStatus: 'Paid' // Simulating payment success for now
        });

        // Update vehicle availability
        vehicle.availability = false;
        await vehicle.save();

        // Generate Invoice
        const invoiceDir = path.join(__dirname, '../invoices');
        if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
        const invoicePath = path.join(invoiceDir, `invoice_${booking._id}.pdf`);
        generateInvoice(booking, vehicle, customer, invoicePath);

        booking.invoiceUrl = `/invoices/invoice_${booking._id}.pdf`;
        await booking.save();

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('customerId', 'name email').populate('vehicleId', 'vehicleName vehicleType');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { bookVehicle, getBookings };
