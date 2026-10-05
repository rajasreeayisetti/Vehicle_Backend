const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { checkAndUpdateBookingStatuses } = require('./utils/bookingStatusHelper');
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
// Serve Frontend
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Initial status check & set periodic check every 60s
    try {
        await checkAndUpdateBookingStatuses();
        setInterval(checkAndUpdateBookingStatuses, 60000);
    } catch (e) {
        console.error('Error starting status checker loop:', e);
    }
});
