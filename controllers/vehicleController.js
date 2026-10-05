const Vehicle = require('../models/Vehicle');
const { checkAndUpdateBookingStatuses } = require('../utils/bookingStatusHelper');
// @desc    Add a new vehicle
// @route   POST /api/vehicles
const addVehicle = async (req, res) => {
    try {
        if (!req.body.regNumber) {
            req.body.regNumber = `DE-` + Math.floor(1000 + Math.random() * 9000) + `-AX`;
        }
        const vehicle = await Vehicle.create(req.body);
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Get all vehicles
// @route   GET /api/vehicles
const getVehicles = async (req, res) => {
    try {
        await checkAndUpdateBookingStatuses();
        const vehicles = await Vehicle.find({});
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { addVehicle, getVehicles, updateVehicle, deleteVehicle };
