const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Vehicle = require('./models/Vehicle');
// These are verified working Unsplash photo IDs for cars
const fixes = {
    'Honda CR-V': 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
    'Ford Mustang': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&auto=format&fit=crop&q=80',
    'Hyundai Creta': 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&auto=format&fit=crop&q=80',
    'Toyota Innova Crysta': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
};
(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    for (const [name, url] of Object.entries(fixes)) {
        await Vehicle.updateOne({ vehicleName: name }, { imageUrl: url });
        console.log('Fixed: ' + name);
    }
    console.log('\nDone! All broken images fixed.');
    process.exit();
})();
