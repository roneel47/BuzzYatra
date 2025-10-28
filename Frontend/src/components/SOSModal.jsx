import React, { useState, useEffect } from 'react';

const SOSModal = ({ isOpen, onClose, userId }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [contacts, setContacts] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [sosStatus, setSosStatus] = useState('');
  const [sosResults, setSosResults] = useState(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
      getCurrentLocation();
    }
  }, [isOpen, userId]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/emergency-contacts/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');
    
    if (!('geolocation' in navigator)) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({
          latitude,
          longitude,
          mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location access.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const sendSOS = async () => {
    if (!currentLocation) {
      setSosStatus('❌ Location not available. Please get location first.');
      return;
    }

    if (contacts.length === 0) {
      setSosStatus('❌ No emergency contacts found. Please add contacts first.');
      return;
    }

    setIsSendingSOS(true);
    setSosStatus('📤 Sending SOS alert to your emergency contacts...');
    setSosResults(null);

    try {
      const response = await fetch(`${apiBaseUrl}/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          customMessage: customMessage.trim() || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSosResults(data.results);
        setSosStatus(`✅ ${data.message}`);
        
        // Auto-close modal after 5 seconds on success
        setTimeout(() => {
          onClose();
        }, 5000);
      } else {
        setSosStatus(`❌ ${data.error || 'Failed to send SOS alert'}`);
      }
    } catch (error) {
      console.error('SOS Error:', error);
      setSosStatus('❌ Network error. Please check your connection and try again.');
    } finally {
      setIsSendingSOS(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
              🚨 Emergency SOS
            </h2>
            <button
              onClick={onClose}
              disabled={isSendingSOS}
              className="text-gray-500 hover:text-gray-700 text-2xl disabled:opacity-50"
            >
              ×
            </button>
          </div>

          {/* Status Messages */}
          {sosStatus && (
            <div className={`mb-4 p-3 rounded-lg ${
              sosStatus.includes('✅') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : sosStatus.includes('❌')
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-blue-100 text-blue-800 border border-blue-300'
            }`}>
              {sosStatus}
            </div>
          )}

          {/* Emergency Contacts Preview */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Will alert {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''}:
            </h3>
            {contacts.length === 0 ? (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700">
                ⚠️ No emergency contacts configured. You need to add contacts first.
              </div>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {contacts.map((contact, index) => (
                  <div key={contact._id} className="flex items-center gap-2 text-sm">
                    <span className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-gray-500">({contact.relationship})</span>
                    <span className="text-gray-400">{contact.phoneNumber}</span>
                    {contact.isPrimary && (
                      <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                        PRIMARY
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Status */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Current Location:</h3>
            {isLoadingLocation ? (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-blue-700">
                📡 Getting your location...
              </div>
            ) : locationError ? (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <div className="text-red-700 mb-2">❌ {locationError}</div>
                <button
                  onClick={getCurrentLocation}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            ) : currentLocation ? (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg text-green-800">
                <div className="mb-2">✅ Location acquired</div>
                <div className="text-sm text-gray-600">
                  <div>Lat: {currentLocation.latitude.toFixed(6)}</div>
                  <div>Lng: {currentLocation.longitude.toFixed(6)}</div>
                  <a
                    href={currentLocation.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    🗺️ View on Google Maps
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block font-semibold text-gray-800 mb-2">
              Custom Message (optional):
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              disabled={isSendingSOS}
              placeholder="Add additional details about your emergency..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              rows={3}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1">
              {customMessage.length}/500 characters
            </div>
          </div>

          {/* SOS Results */}
          {sosResults && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Alert Results:</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {sosResults.map((result, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      result.success 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    <div className="font-medium">
                      {result.success ? '✅' : '❌'} {result.contact}
                    </div>
                    <div className="text-xs opacity-75">
                      {result.phoneNumber}
                      {!result.success && result.error && ` - ${result.error}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={sendSOS}
              disabled={
                !currentLocation || 
                contacts.length === 0 || 
                isSendingSOS || 
                isLoadingLocation
              }
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
            >
              {isSendingSOS ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                '🚨 Send Emergency Alert'
              )}
            </button>
            
            <button
              onClick={onClose}
              disabled={isSendingSOS}
              className="px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition duration-200"
            >
              Cancel
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <div className="font-semibold mb-1">Emergency Alert will include:</div>
            <ul className="space-y-0.5">
              <li>• Your current GPS location</li>
              <li>• Timestamp of the alert</li>
              <li>• Google Maps link to your location</li>
              <li>• Your custom message (if provided)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOSModal;