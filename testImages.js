const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Vehicle = require('./models/Vehicle');
const https = require('https');
const http = require('http');
function testUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
            res.destroy();
        });
        req.on('error', () => resolve({ url, status: 0, ok: false }));
        req.setTimeout(5000, () => { req.destroy(); resolve({ url, status: 0, ok: false }); });
    });
}
(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const vehicles = await Vehicle.find({});
    console.log('Testing all vehicle image URLs...\n');
    for (const v of vehicles) {
        const result = await testUrl(v.imageUrl);
        const icon = result.ok ? '✅' : '❌';
        console.log(icon + ' ' + v.vehicleName + ' (status: ' + result.status + ')');
        console.log('   ' + v.imageUrl + '\n');
    }
    process.exit();
})();
