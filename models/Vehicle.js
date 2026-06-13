const mongoose = require('mongoose');

const vehicleSchema = mongoose.Schema({
    vehicleName: { type: String, required: true },
    vehicleType: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    availability: { type: Boolean, default: true },
    maintenanceStatus: { type: String, default: 'Available' },
    gpsEnabled: { type: Boolean, default: false },
    imageUrl: { type: String }, // For frontend display
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
