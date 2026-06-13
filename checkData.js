const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/Customer');

dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const customers = await Customer.find({});
        console.log('Customers found:', customers.length);
        customers.forEach(c => {
            console.log(`- Email: ${c.email}`);
        });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

test();
