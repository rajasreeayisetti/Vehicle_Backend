const Booking = require('../models/Booking');
const Vehicle = require('../models/Vehicle');
const checkAndUpdateBookingStatuses = async () => {
    try {
        const now = new Date();
        // 1. Mark bookings whose return/end date has completed as Completed
        const expiredBookings = await Booking.find({
            status: { $ne: 'Completed' },
            endDate: { $lt: now }
        });
        for (const booking of expiredBookings) {
            booking.status = 'Completed';
            await booking.save();
        }
        // 2. Check each vehicle's current active booking state
        const vehicles = await Vehicle.find({});
        for (const vehicle of vehicles) {
            const currentActiveBooking = await Booking.findOne({
                vehicleId: vehicle._id,
                status: 'Active',
                startDate: { $lte: now },
                endDate: { $gte: now }
            });
            const shouldBeAvailable = !currentActiveBooking;
            if (vehicle.availability !== shouldBeAvailable) {
                vehicle.availability = shouldBeAvailable;
                await vehicle.save();
            }
        }
    } catch (error) {
        console.error('Error updating booking statuses:', error);
    }
};
module.exports = { checkAndUpdateBookingStatuses };
