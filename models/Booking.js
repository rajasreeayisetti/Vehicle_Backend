const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    invoiceUrl: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
