const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');
const generateInvoice = require('../utils/invoiceGenerator');
const { checkAndUpdateBookingStatuses } = require('../utils/bookingStatusHelper');
const path = require('path');
const fs = require('fs');
// @desc    Book a vehicle
// @route   POST /api/bookings
const bookVehicle = async (req, res) => {
    const { customerId, vehicleId, startDate, endDate, totalAmount } = req.body;
    try {
        // First run auto-update check on expired bookings
        await checkAndUpdateBookingStatuses();
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Start date and end date are required' });
        }
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        // Set start time to beginning of day and end time to end of day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid start or end date' });
        }
        if (start > end) {
            return res.status(400).json({ message: 'End date must be after or equal to start date' });
        }
        // Prevent duplicate / overlapping bookings for the same vehicle
        const overlappingBooking = await Booking.findOne({
            vehicleId,
            status: 'Active',
            startDate: { $lte: end },
            endDate: { $gte: start }
        });
        if (overlappingBooking) {
            return res.status(400).json({ message: 'Vehicle is already booked for the selected date range.' });
        }
        // Calculate Days & Total Amount consistently
        const diffTime = Math.abs(end - start);
        const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        let finalTotalAmount = days * vehicle.pricePerDay;
        if (days >= 7) {
            finalTotalAmount *= 0.9; // 10% discount for 7+ days
        }
        // Round to 2 decimals if needed, or use client totalAmount if provided and matching
        if (totalAmount && Math.abs(totalAmount - finalTotalAmount) < 1) {
            finalTotalAmount = Number(totalAmount);
        } else {
            finalTotalAmount = Math.round(finalTotalAmount);
        }
        const now = new Date();
        // Determine if booking is active right now
        const isActiveNow = (start <= now && end >= now) || (start.toDateString() === now.toDateString());

        const booking = await Booking.create({
            customerId,
            vehicleId,
            startDate: start,
            endDate: end,
            totalAmount: finalTotalAmount,
            paymentStatus: 'Paid',
            status: 'Active'
        });
        // Update vehicle availability if booking is active currently
        if (isActiveNow) {
            vehicle.availability = false;
            await vehicle.save();
        }
        // Ensure vehicle regNumber exists
        if (!vehicle.regNumber) {
            vehicle.regNumber = `DE-` + String(vehicle._id).slice(-6).toUpperCase();
            await vehicle.save();
        }
        // Generate Invoice PDF
        const invoiceDir = path.join(__dirname, '../invoices');
        if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir);
        const invoicePath = path.join(invoiceDir, `invoice_${booking._id}.pdf`);
        generateInvoice(booking, vehicle, customer, invoicePath);
        booking.invoiceUrl = `/invoices/invoice_${booking._id}.pdf`;
        await booking.save();
        // Populate customer and vehicle before returning JSON response
        const populatedBooking = await Booking.findById(booking._id)
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'vehicleName vehicleType pricePerDay regNumber imageUrl');
        res.status(201).json(populatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Get all bookings
// @route   GET /api/bookings
const getBookings = async (req, res) => {
    try {
        await checkAndUpdateBookingStatuses();
        const bookings = await Booking.find({})
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'vehicleName vehicleType regNumber pricePerDay imageUrl')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
    try {
        await checkAndUpdateBookingStatuses();
        const booking = await Booking.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('vehicleId', 'vehicleName vehicleType regNumber pricePerDay imageUrl');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { bookVehicle, getBookings, getBookingById };
