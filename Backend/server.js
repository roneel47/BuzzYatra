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
  dbName: 'BuzzYatra',
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

app.get("/", (req, res) => {
  res.send("Welcome to the BuzzYatra Backend");
});

/*Haversine Formula*/
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters

  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in meters
  return d;
}


/**
 * POST /api/getRoute
 * body: { from: "StationName", to: "StationName" }
 */
app.post('/api/getRoute', async (req, res) => {
  const { from, to, userlat, userlong } = req.body;
  if (!from || !to) {
    return res.status(400).json({ error: 'Provide both from and to' });
  }
  if (!userlat || !userlong) {
    return res.status(400).json({ error: 'Provide user latitude and longitude' });
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
    const distanceMetersFormatted = "approx. " + Math.round(distanceMeters / 1000) + " km";
    // Convert to [lat, lng] for frontend consumption if needed
    const coordinatesLatLng = coordinatesLngLat.map(c => [c[1], c[0]]);
    const distance = getDistance(userlat, userlong, toStation.lat, toStation.long);
    const distanceFormatted = Math.round(distance / 1000) + " km";
    if(distance < 300){
         alertdis = "Alert " + distance + " (" + distanceFormatted + ")";
    } else {
         alertdis = "Distance is far Alert " + distance + " (" + distanceFormatted + ")";
    }

    return res.json({
      routeCoordinates: coordinatesLatLng,
      distanceMetersFormatted,
      durationSecondsFormatted,
      alertdis
    });

  } catch (err) {
    console.error('Route error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/getStation', async (req, res) => {
  try {
    // If you only need names, project only name field
    const stations = await Station.find({}, 'name');  
    // To return only names, change to: Station.find({}, 'name')
    res.json(stations);
  } catch (err) {
    console.error('Error fetching stations:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
