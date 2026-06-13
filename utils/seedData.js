const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

dotenv.config();

const vehicles = [
    {
        vehicleName: 'Tesla Model 3',
        vehicleType: 'Electric Sedan',
        pricePerDay: 120,
        availability: true,
        maintenanceStatus: 'Excellent',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'BMW X5',
        vehicleType: 'Luxury SUV',
        pricePerDay: 150,
        availability: true,
        maintenanceStatus: 'Maintenance Required',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'Ford Mustang',
        vehicleType: 'Sports Car',
        pricePerDay: 180,
        availability: true,
        maintenanceStatus: 'Good',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1584345604481-03bd1a480f7e?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'Toyota Camry',
        vehicleType: 'Economy Sedan',
        pricePerDay: 60,
        availability: true,
        maintenanceStatus: 'Excellent',
        gpsEnabled: false,
        imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'Mercedes-Benz G-Class',
        vehicleType: 'Off-Road Luxury',
        pricePerDay: 350,
        availability: true,
        maintenanceStatus: 'Excellent',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1520031441872-46c4ee97b8c0?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'Porsche 911',
        vehicleType: 'Premium Sports',
        pricePerDay: 400,
        availability: true,
        maintenanceStatus: 'Excellent',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'Audi A8',
        vehicleType: 'Executive Sedan',
        pricePerDay: 220,
        availability: true,
        maintenanceStatus: 'Good',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=800'
    },
    {
        vehicleName: 'Land Rover Defender',
        vehicleType: 'Adventure SUV',
        pricePerDay: 190,
        availability: true,
        maintenanceStatus: 'Excellent',
        gpsEnabled: true,
        imageUrl: 'https://images.unsplash.com/photo-1603386090075-8404a3774641?auto=format&fit=crop&q=80&w=800'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Seed Vehicles
        await Vehicle.deleteMany();
        await Vehicle.insertMany(vehicles);

        // Seed Demo User
        await Customer.deleteMany();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        await Customer.create({
            name: 'Demo User',
            email: 'demo@example.com',
            phone: '1234567890',
            address: '123 Tech Lane',
            password: hashedPassword
        });

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data', error);
        process.exit(1);
    }
};

seedData();
