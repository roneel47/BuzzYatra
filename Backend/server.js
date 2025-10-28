const express = require('express');
const mongoose = require('mongoose');
const fetch = global.fetch;
const cors = require('cors');
require('dotenv').config();

const Station = require('./models/Station');
const EmergencyContact = require('./models/EmergencyContact');
// twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, process.env.LANDING_URL].filter(Boolean)
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
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
  const { from, to, userlat, userlong, alertDistance } = req.body;
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
    // Using coordinates for route calculation
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
    let alertdis;
    if (Number.isFinite(alertDistance) && distance < alertDistance) {
      alertdis = "Alert " + distance + " (" + distanceFormatted + ")";
    } else {
      alertdis = "No alert: " + distance + " (" + distanceFormatted + ")";
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

// Emergency Contacts CRUD operations
app.get('/api/emergency-contacts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const contacts = await EmergencyContact.find({ userId, isActive: true }).sort({ isPrimary: -1, createdAt: 1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    res.status(500).json({ error: 'Failed to fetch emergency contacts' });
  }
});

app.post('/api/emergency-contacts', async (req, res) => {
  try {
    const { userId, name, phoneNumber, relationship, isPrimary } = req.body;

    if (!userId || !name || !phoneNumber || !relationship) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const contact = new EmergencyContact({
      userId,
      name,
      phoneNumber,
      relationship,
      isPrimary: isPrimary || false
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating emergency contact:', error);
    res.status(500).json({ error: 'Failed to create emergency contact' });
  }
});

app.put('/api/emergency-contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const contact = await EmergencyContact.findByIdAndUpdate(id, updates, { new: true });
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    res.status(500).json({ error: 'Failed to update emergency contact' });
  }
});

app.delete('/api/emergency-contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await EmergencyContact.findByIdAndUpdate(id, { isActive: false });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    res.status(500).json({ error: 'Failed to delete emergency contact' });
  }
});

// Enhanced SOS endpoint
app.post('/api/sos', async (req, res) => {
  try {
    const { userId, latitude, longitude, customMessage } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ error: 'Missing userId, latitude, or longitude' });
    }

    // Get all active emergency contacts for the user
    const contacts = await EmergencyContact.find({ userId, isActive: true });

    if (contacts.length === 0) {
      return res.status(400).json({ error: 'No emergency contacts found. Please add emergency contacts first.' });
    }

    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    // Short message for trial account compatibility
    const messageBody = `🚨 EMERGENCY! Help needed!\nLocation: ${mapsUrl}`;

    const results = [];
    
    // Send SMS to all emergency contacts
    for (const contact of contacts) {
      try {
        const message = await client.messages.create({
          body: `${messageBody}\n\nContact: ${contact.name} (${contact.relationship})`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: contact.phoneNumber
        });
        
        results.push({
          contact: contact.name,
          phoneNumber: contact.phoneNumber,
          success: true,
          sid: message.sid
        });
      } catch (error) {
        console.error(`Failed to send SMS to ${contact.name}:`, error.message);
        results.push({
          contact: contact.name,
          phoneNumber: contact.phoneNumber,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    const response = { 
      success: successCount > 0,
      message: `SOS sent to ${successCount} out of ${totalCount} contacts`,
      results,
      location: { latitude, longitude, mapsUrl }
    };

    res.json(response);

  } catch (error) {
    console.error('SOS Endpoint Error:', error);
    res.status(500).json({ error: 'Failed to send SOS alerts' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
