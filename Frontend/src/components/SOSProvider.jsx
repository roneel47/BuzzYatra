import React, { createContext, useContext, useState, useEffect } from 'react';

const SOSContext = createContext();

export const useSOSSystem = () => {
  const context = useContext(SOSContext);
  if (!context) {
    throw new Error('useSOSSystem must be used within a SOSProvider');
  }
  return context;
};

export const SOSProvider = ({ children, userId }) => {
  const [contacts, setContacts] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastLocationUpdate, setLastLocationUpdate] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  
  const apiBaseUrl = "http://localhost:4000/api";

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch emergency contacts
  const fetchContacts = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/emergency-contacts/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch emergency contacts:', error);
    }
    return [];
  };

  // Get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(),
            mapsUrl: `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`
          };
          setCurrentLocation(location);
          setLastLocationUpdate(new Date());
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  // Send SOS alert
  const sendSOSAlert = async (customMessage = '', skipLocationCheck = false) => {
    try {
      // Get contacts if not already loaded
      let emergencyContacts = contacts;
      if (emergencyContacts.length === 0) {
        emergencyContacts = await fetchContacts();
      }

      if (emergencyContacts.length === 0) {
        throw new Error('No emergency contacts configured. Please add emergency contacts first.');
      }

      // Get location if not available or expired (older than 5 minutes)
      let location = currentLocation;
      if (!skipLocationCheck && (!location || (new Date() - location.timestamp > 5 * 60 * 1000))) {
        location = await getCurrentLocation();
      }

      if (!location) {
        throw new Error('Unable to get current location. SOS alert cannot be sent without location.');
      }

      // Send SOS request
      const response = await fetch(`${apiBaseUrl}/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          latitude: location.latitude,
          longitude: location.longitude,
          customMessage: customMessage.trim() || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send SOS alert');
      }

      return {
        success: true,
        message: data.message,
        results: data.results,
        location: data.location
      };

    } catch (error) {
      console.error('SOS Alert Error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  };

  // Quick SOS (for floating button)
  const quickSOS = async () => {
    return await sendSOSAlert('🚨 EMERGENCY! I need immediate help!');
  };

  const value = {
    contacts,
    setContacts,
    isOnline,
    currentLocation,
    lastLocationUpdate,
    fetchContacts,
    getCurrentLocation,
    sendSOSAlert,
    quickSOS,
    userId
  };

  return (
    <SOSContext.Provider value={value}>
      {children}
    </SOSContext.Provider>
  );
};

export default SOSProvider;