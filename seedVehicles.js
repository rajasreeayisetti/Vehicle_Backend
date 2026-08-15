const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Vehicle = require('./models/Vehicle');
const imageUpdates = {
    'Maruti Suzuki Swift': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop&q=80',
    'Hyundai Creta': 'https://images.unsplash.com/photo-1625231334168-29488a31ea72?w=800&auto=format&fit=crop&q=80',
    'Tata Nexon': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&auto=format&fit=crop&q=80',
    'Mahindra Thar': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&auto=format&fit=crop&q=80',
    'Mercedes-Benz E-Class': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&auto=format&fit=crop&q=80',
    'Kia Seltos': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&auto=format&fit=crop&q=80',
    'Toyota Innova Crysta': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0afa?w=800&auto=format&fit=crop&q=80',
    'Royal Enfield Classic 350': 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80',
};
(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    for (const [name, url] of Object.entries(imageUpdates)) {
        const result = await Vehicle.findOneAndUpdate(
            { vehicleName: name },
            { imageUrl: url },
            { new: true }
        );
        if (result) {
            console.log('Updated image for: ' + name);
        } else {
            console.log('NOT FOUND: ' + name);
        }
    }
    console.log('\nAll images updated successfully!');
    process.exit();
})();
