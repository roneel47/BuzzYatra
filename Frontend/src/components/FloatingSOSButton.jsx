import React, { useState, useEffect } from 'react';

const FloatingSOSButton = ({ userId, isVisible = true, currentLocation }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [clickEffect, setClickEffect] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

  // Component mount logging removed for production

  const resetButtonState = () => {
    setClickEffect(false);
    setIsPressed(false);
    setIsProcessing(false);
    setStatusMessage('');
  };

  // Safety timeout: Reset button if it's been processing for too long
  useEffect(() => {
    if (isProcessing) {
      const timeout = setTimeout(() => {
        resetButtonState();
      }, 30000); // 30 seconds safety timeout

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isProcessing]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          let errorMessage = 'Location error';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timeout';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const sendSOSToContacts = async (location) => {
    const sosPayload = {
      userId,
      latitude: location.latitude,
      longitude: location.longitude,
      customMessage: '🚨 EMERGENCY! I need immediate help!'
    };
    
    try {
      const response = await fetch(`${apiBaseUrl}/sos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sosPayload),
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Backend not responding - is server running on port 4000?');
        } else if (response.status === 500) {
          throw new Error('Server error - check backend logs');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'SOS sending failed');
      }

      return data;
      
    } catch (fetchError) {
      if (fetchError.name === 'TypeError') {
        throw new Error('Cannot connect to backend - is server running on port 4000?');
      }
      throw fetchError;
    }
  };

  const handleSOSClick = async () => {
    // Prevent multiple clicks
    if (isProcessing) {
      return;
    }
    
    // Create blue ripple effect
    setClickEffect(true);
    setIsPressed(true);
    setIsProcessing(true);
    setStatusMessage('🚨 Activating SOS...');
    
    try {
      let location;
      
      // Step 1: Use current location if available, otherwise get fresh location
      if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
        setStatusMessage('📍 Using tracked location...');
        location = currentLocation;
        // Small delay to show the message
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        setStatusMessage('📍 Getting fresh location...');
        location = await getCurrentLocation();
      }
      
      // Step 2: Send SOS to all configured emergency contacts
      setStatusMessage('📤 Sending emergency alerts...');
      const result = await sendSOSToContacts(location);
      
      setStatusMessage('✅ Emergency alerts sent!');
      
      // Reset after success
      setTimeout(() => {
        resetButtonState();
      }, 2000);
      
    } catch (error) {
      setStatusMessage(`❌ ${error.message}`);
      
      // Reset after error
      setTimeout(() => {
        resetButtonState();
      }, 3000);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Debug buttons removed for production */}

      {/* Blue ripple effect */}
      {clickEffect && (
        <div className="absolute inset-0 w-16 h-16 flex items-center justify-center">
          <div className="w-full h-full bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          <div className="absolute w-3/4 h-3/4 bg-blue-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.1s' }}></div>
        </div>
      )}
      
      {/* Blue glow effect during press */}
      {isPressed && (
        <div className="absolute inset-0 w-16 h-16">
          <div className="w-full h-full bg-blue-500 rounded-full opacity-20 blur-sm scale-125"></div>
        </div>
      )}
      
      {/* SOS Button */}
      <button
        onClick={handleSOSClick}
        disabled={isProcessing}
        className={`
          w-16 h-16 bg-red-600 text-white rounded-full shadow-lg
          flex items-center justify-center font-bold text-sm
          transition-all duration-200 ease-out
          hover:bg-red-700 hover:shadow-xl
          active:scale-95
          ${isPressed ? 'bg-red-700 scale-105 shadow-2xl' : ''}
          ${clickEffect ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
          ${isProcessing ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
          select-none touch-manipulation
        `}
        style={{
          boxShadow: clickEffect 
            ? '0 0 25px rgba(59, 130, 246, 0.8), 0 8px 32px rgba(0, 0, 0, 0.3)' 
            : isPressed 
            ? '0 0 20px rgba(239, 68, 68, 0.6), 0 8px 32px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        {isProcessing ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <span className={`transition-all duration-200 ${isPressed ? 'scale-110' : ''}`}>
            SOS
          </span>
        )}
      </button>
      
      {/* Status feedback */}
      {statusMessage && (
        <div className={`absolute bottom-full right-0 mb-2 max-w-48 text-white text-xs rounded-lg p-2 text-center whitespace-nowrap ${
          statusMessage.includes('✅') 
            ? 'bg-green-600' 
            : statusMessage.includes('❌')
            ? 'bg-red-600'
            : 'bg-blue-600'
        }`}>
          {statusMessage}
          <div className={`absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            statusMessage.includes('✅') 
              ? 'border-t-green-600' 
              : statusMessage.includes('❌')
              ? 'border-t-red-600'
              : 'border-t-blue-600'
          }`}></div>
        </div>
      )}
    </div>
  );
};

export default FloatingSOSButton;