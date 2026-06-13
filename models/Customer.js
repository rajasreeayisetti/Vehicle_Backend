const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    password: { type: String, required: true }, // Added for logic
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
