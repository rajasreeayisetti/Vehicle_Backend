const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Customer = require('./models/Customer');

dotenv.config();

const test = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const customers = await Customer.find({});
    console.log('Customers found:', customers.length);
    customers.forEach(c => {
        console.log(`- ${c.name} (${c.email})`);
    });
    process.exit();
};

test();
