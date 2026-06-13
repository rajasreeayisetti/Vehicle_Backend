const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Customer = require('./models/Customer');

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const customer = await Customer.findOne({ email: 'demo@example.com' });
        if (!customer) {
            console.log('User not found');
            process.exit(1);
        }
        console.log('Checking match for password123...');
        const isMatch = await bcrypt.compare('password123', customer.password);
        console.log('Match result:', isMatch);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

test();
