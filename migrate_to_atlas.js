const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const LOCAL_URI = 'mongodb://localhost:27017/vehicle-rental';
const ATLAS_URI = process.env.MONGO_URI || 'mongodb+srv://vehicleadmin:raji0706@cluster0.gaco4iq.mongodb.net/vehicle-rental?appName=Cluster0';

async function migrate() {
  console.log('=== STARTING MONGODB MIGRATION TO ATLAS ===\n');
  console.log('Source (Local DB):', LOCAL_URI);
  // Hide password in console output
  const sanitizedAtlasUri = ATLAS_URI.replace(/:([^:@]+)@/, ':****@');
  console.log('Target (Atlas DB):', sanitizedAtlasUri);
  console.log('\n------------------------------------------');

  let localConn, atlasConn;

  try {
    // Connect to local DB
    console.log('Connecting to local MongoDB...');
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to Local MongoDB successfully.');

    // Connect to Atlas DB
    console.log('Connecting to Atlas MongoDB...');
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to Atlas MongoDB successfully.');

    const localDb = localConn.db;
    const atlasDb = atlasConn.db;

    // Get list of collections from local database
    const collections = await localDb.listCollections().toArray();
    console.log(`\nFound ${collections.length} collection(s) in local database:`, collections.map(c => c.name).join(', '));

    for (const colInfo of collections) {
      const colName = colInfo.name;
      console.log(`\nProcessing collection: "${colName}"...`);

      const localCol = localDb.collection(colName);
      const atlasCol = atlasDb.collection(colName);

      const docs = await localCol.find({}).toArray();
      console.log(`- Local documents count: ${docs.length}`);

      if (docs.length === 0) {
        console.log(`- Collection "${colName}" is empty. Skipping document insertion.`);
        continue;
      }

      // Upsert documents by _id to preserve _id and avoid duplicates
      const bulkOps = docs.map(doc => ({
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: doc },
          upsert: true
        }
      }));

      const result = await atlasCol.bulkWrite(bulkOps);
      console.log(`- Bulk write finished for "${colName}":`);
      console.log(`  * Inserted (upserted): ${result.upsertedCount}`);
      console.log(`  * Matched / Updated: ${result.matchedCount}`);

      // Copy indexes (excluding default _id_ index)
      try {
        const localIndexes = await localCol.indexes();
        for (const index of localIndexes) {
          if (index.name !== '_id_') {
            const { v, ns, ...indexOpts } = index;
            await atlasCol.createIndex(indexOpts.key, indexOpts);
            console.log(`  * Created index "${index.name}" on Atlas`);
          }
        }
      } catch (idxErr) {
        console.warn(`  ! Could not copy indexes for "${colName}":`, idxErr.message);
      }
    }

    console.log('\n==========================================');
    console.log('=== MIGRATION COMPLETED SUCCESSFULLY! ===');
    console.log('==========================================\n');

    // Final verification summary
    console.log('--- ATLAS VERIFICATION SUMMARY ---');
    const atlasCollections = await atlasDb.listCollections().toArray();
    for (const col of atlasCollections) {
      const count = await atlasDb.collection(col.name).countDocuments();
      console.log(`Atlas collection [${col.name}]: ${count} documents`);
    }

  } catch (error) {
    console.error('\n❌ Migration failed with error:', error);
  } finally {
    if (localConn) await localConn.close();
    if (atlasConn) await atlasConn.close();
    process.exit(0);
  }
}

migrate();
