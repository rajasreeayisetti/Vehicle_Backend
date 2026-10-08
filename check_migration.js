const mongoose = require('mongoose');

const LOCAL_URI = 'mongodb://localhost:27017/vehicle-rental';
const ATLAS_URI = 'mongodb+srv://vehicleadmin:raji0706@cluster0.gaco4iq.mongodb.net/vehicle-rental?appName=Cluster0';

async function checkDbs() {
  console.log('--- CHECKING LOCAL DB ---');
  try {
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to Local MongoDB');
    const localDb = localConn.db;
    const collections = await localDb.listCollections().toArray();
    console.log('Local collections:', collections.map(c => c.name));
    for (const col of collections) {
      const count = await localDb.collection(col.name).countDocuments();
      console.log(`- Local [${col.name}]: ${count} documents`);
    }
    await localConn.close();
  } catch (err) {
    console.error('Local DB Error:', err.message);
  }

  console.log('\n--- CHECKING ATLAS DB ---');
  try {
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to Atlas MongoDB');
    const atlasDb = atlasConn.db;
    const collections = await atlasDb.listCollections().toArray();
    console.log('Atlas collections:', collections.map(c => c.name));
    for (const col of collections) {
      const count = await atlasDb.collection(col.name).countDocuments();
      console.log(`- Atlas [${col.name}]: ${count} documents`);
    }
    await atlasConn.close();
  } catch (err) {
    console.error('Atlas DB Error:', err.message);
  }
}

checkDbs();
