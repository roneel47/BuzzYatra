const mongoose = require('mongoose');
const fs = require('fs');

// Read .env file manually
const envContent = fs.readFileSync('.env', 'utf8');
const mongoUri = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='))?.split('=')[1]?.trim();

if (!mongoUri) {
  console.error('MONGODB_URI not found in .env file');
  process.exit(1);
}

async function fixIndexes() {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('timetables');

    // List current indexes
    const indexes = await collection.indexes();
    console.log('\nCurrent indexes:');
    indexes.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });

    // Drop the incorrect semester_1 index if it exists
    try {
      await collection.dropIndex('semester_1');
      console.log('\n✓ Successfully dropped the "semester_1" index');
    } catch (err) {
      if (err.code === 27) {
        console.log('\nℹ Index "semester_1" does not exist (already removed)');
      } else {
        console.error('\n✗ Error dropping index:', err.message);
      }
    }

    // List indexes after drop
    const indexesAfter = await collection.indexes();
    console.log('\nIndexes after fix:');
    indexesAfter.forEach((index, i) => {
      console.log(`${i + 1}. ${index.name}:`, index.key);
    });

    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixIndexes();
