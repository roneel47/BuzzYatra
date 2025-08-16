const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  lat: Number,
  long: Number
});

module.exports = mongoose.model('Station', StationSchema);
