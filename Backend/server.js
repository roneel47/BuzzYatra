const express = require('express');
const mongoose = require('mongoose');
const fetch = global.fetch;
const cors = require('cors');
require('dotenv').config();

const Station = require('./models/Station');

const app = express();
app.use(cors());
app.use(express.json());

// connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.get("/", (req, res) => {
  res.send("Welcome to the BuzzYatra API");
});

/**
 * POST /api/getRoute
 * body: { from: "StationName", to: "StationName" }
 */
app.post('/api/getRoute', async (req, res) => {
  const { from, to } = req.body;
  if (!from || !to) {
    return res.status(400).json({ error: 'Provide both from and to' });
  }

  try {
    // Find station docs in DB
    const fromStation = await Station.findOne({ name: from });
    const toStation = await Station.findOne({ name: to });
    if (!fromStation || !toStation) {
      return res.status(404).json({ error: 'Station not found in database' });
    }

    // Call OpenRouteService Directions
    console.log("Using coordinates: ", fromStation.lat, fromStation.long, toStation.lat, toStation.long);
    const apiKey = process.env.ORS_API_KEY;
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?profile=driving-car&api_key=${apiKey}&start=${fromStation.long},${fromStation.lat}&end=${toStation.long},${toStation.lat}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      return res.status(500).json({ error: 'No route found' });
    }

    const route = data.features[0];

    // Extract geometry + summary
    const coordinatesLngLat = route.geometry.coordinates; // [lng, lat]
    const distanceMeters = route.properties.summary.distance;
    const durationSeconds = route.properties.summary.duration;
    const durationSecondsFormatted = Math.round(durationSeconds / 60) + " min";
    const distanceMetersFormatted = (distanceMeters / 1000) + " km";
    // Convert to [lat, lng] for frontend consumption if needed
    const coordinatesLatLng = coordinatesLngLat.map(c => [c[1], c[0]]);

    return res.json({
      routeCoordinates: coordinatesLatLng,
      distanceMetersFormatted,
      durationSecondsFormatted
    });

  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
