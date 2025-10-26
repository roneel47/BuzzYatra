# BuzzYatra SOS Emergency System

## Overview
This enhanced SOS system allows users to configure emergency contacts and send instant emergency alerts with location information at the touch of a button.

## Features

### 🚨 Floating SOS Button
- Always visible floating action button
- Hold for 3 seconds to activate (prevents accidental activation)
- Visual progress indicator during hold
- Instantly sends alerts to all configured emergency contacts

### 👥 Emergency Contacts Management
- Add multiple emergency contacts
- Configure primary contact (gets alerted first)
- Store contact name, phone number, and relationship
- Easy-to-use configuration interface

### 📍 Location Tracking
- Automatic GPS location acquisition
- Shares precise coordinates via Google Maps link
- Works even when app is in background

### 📱 Smart Messaging
- Sends SMS to all emergency contacts simultaneously
- Includes timestamp, location, and custom message
- Automatic retry for failed messages

## How to Use

### 1. Initial Setup
1. Click the "⚙️ Emergency Contacts" button (top-right corner)
2. Add at least one emergency contact with:
   - Name
   - Phone number (include country code, e.g., +1234567890)
   - Relationship
   - Mark as primary if desired
3. Save the contact

### 2. Sending Emergency Alert
**Method 1: Floating Button (Quick SOS)**
1. Hold the red SOS button for 3 seconds
2. Location is automatically acquired and sent

**Method 2: SOS Modal (Detailed)**
1. Tap the SOS button once to open modal
2. Review your emergency contacts
3. Add custom message if needed
4. Click "Send Emergency Alert"

### 3. What Gets Sent
Each emergency contact receives an SMS with:
```
🚨 EMERGENCY SOS ALERT! 🚨

I need immediate help!

Time: [timestamp]
Location: https://maps.google.com/?q=[lat],[lng]

This is an automated emergency alert from BuzzYatra.
```

## Technical Implementation

### Backend API Endpoints
- `GET /api/emergency-contacts/:userId` - Fetch user's emergency contacts
- `POST /api/emergency-contacts` - Add new emergency contact
- `PUT /api/emergency-contacts/:id` - Update emergency contact
- `DELETE /api/emergency-contacts/:id` - Delete emergency contact
- `POST /api/sos` - Send emergency alerts

### Frontend Components
- `FloatingSOSButton.jsx` - The floating action button
- `SOSModal.jsx` - Detailed SOS interface
- `EmergencyContactsConfig.jsx` - Contact management
- `SOSProvider.jsx` - Context provider for SOS functionality

### Database Schema
```javascript
EmergencyContact {
  userId: String,
  name: String,
  phoneNumber: String,
  relationship: String,
  isPrimary: Boolean,
  isActive: Boolean,
  timestamps: true
}
```

## Integration Guide

### Adding to Any Page
1. Wrap your app with `SOSProvider`:
```jsx
import SOSProvider from './components/SOSProvider';

function App() {
  const userId = getUserId(); // Your user identification logic
  
  return (
    <SOSProvider userId={userId}>
      <YourAppContent />
    </SOSProvider>
  );
}
```

2. Add the floating button:
```jsx
import FloatingSOSButton from './components/FloatingSOSButton';
import SOSModal from './components/SOSModal';

function YourPage() {
  const [showSOSModal, setShowSOSModal] = useState(false);
  
  return (
    <div>
      {/* Your page content */}
      
      <FloatingSOSButton onClick={() => setShowSOSModal(true)} />
      <SOSModal 
        isOpen={showSOSModal} 
        onClose={() => setShowSOSModal(false)}
        userId={userId}
      />
    </div>
  );
}
```

## Security Features
- Hold-to-activate prevents accidental triggers
- Location permission required
- Contacts stored securely with user ID isolation
- Network connectivity checks

## Requirements
- Modern browser with geolocation support
- Internet connection for sending alerts
- Twilio account configured for SMS sending
- MongoDB for storing emergency contacts

## Testing
1. Add test emergency contacts (your own phone numbers)
2. Test location acquisition
3. Send test emergency alert
4. Verify SMS delivery

## Troubleshooting

### Location Issues
- Ensure location permissions are granted
- Use HTTPS for production (required for geolocation)
- Check if location services are enabled on device

### SMS Issues
- Verify Twilio credentials in backend
- Check phone number format (include country code)
- Ensure Twilio account has sufficient balance

### Contact Issues
- Refresh the page if contacts don't load
- Check browser console for network errors
- Verify backend server is running

## Production Considerations
- Replace simple user ID system with proper authentication
- Add rate limiting for SOS endpoint
- Implement offline mode with queued messages
- Add push notifications as backup to SMS
- Log emergency alerts for audit trail
- Add admin dashboard for monitoring

## Demo
The system is ready to use! Just:
1. Start your backend server: `npm start` in Backend folder
2. Start your frontend: `npm run dev` in Frontend folder
3. Configure your emergency contacts
4. Test the SOS system

**Important**: Always inform your emergency contacts that they may receive test messages during setup.