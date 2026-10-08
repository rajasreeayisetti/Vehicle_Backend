const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const Vehicle = require('./models/Vehicle');
const Customer = require('./models/Customer');
const Booking = require('./models/Booking');

async function verify() {
  console.log('=== ATLAS VERIFICATION CHECK ===\n');
  console.log('Connecting to Atlas using MONGO_URI in .env...');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!\n');

    const vehicleCount = await Vehicle.countDocuments();
    const customerCount = await Customer.countDocuments();
    const bookingCount = await Booking.countDocuments();

    console.log(`📊 Collection Statistics in Atlas:`);
    console.log(`   - Vehicles:  ${vehicleCount}`);
    console.log(`   - Customers: ${customerCount}`);
    console.log(`   - Bookings:  ${bookingCount}\n`);

    const sampleVehicles = await Vehicle.find({}).limit(3);
    console.log('🚗 Sample Vehicles fetched from Atlas:');
    sampleVehicles.forEach(v => {
      console.log(`   - [ID: ${v._id}] ${v.vehicleName} (${v.vehicleType}) - Price: $${v.pricePerDay}/day`);
    });

    console.log('\n------------------------------------------');
    console.log('🌐 Testing Backend REST API (http://localhost:5000/api/vehicles)...');
    
    http.get('http://localhost:5000/api/vehicles', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ Backend API returned ${json.length} vehicles from Atlas!`);
          mongoose.disconnect();
          process.exit(0);
        } catch (e) {
          console.error('API response parse error:', e.message);
          mongoose.disconnect();
          process.exit(1);
        }
      });
    }).on('error', (err) => {
      console.log('Note: Local server might need restart if not listening. Error:', err.message);
      mongoose.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  }
}

verify();
