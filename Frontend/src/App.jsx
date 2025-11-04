import React, { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import sound from './assets/sound.mp3'
import FloatingSOSButton from './components/FloatingSOSButton'
import SOSModal from './components/SOSModal'
import EmergencyContactsConfig from './components/EmergencyContactsConfig'
import SOSProvider from './components/SOSProvider'

const apiBaseUrl = "http://localhost:4000/api";

// Simple user ID generation - in production, use proper authentication
const getUserId = () => {
  let userId = localStorage.getItem('buzzyatra_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('buzzyatra_user_id', userId);
  }
  return userId;
};

// Uses Leaflet loaded from CDN in index.html (global L)
function playAudio() {
  try {
    const audio = new Audio(sound)
    audio.play()
  } catch (e) {
    // ignore autoplay errors - silent fail for production
  }
}

/* -------------------------
   RouteTracker component
   ------------------------- */
function RouteTracker({ onLocationUpdate }) {
  // form state
  const [stations, setStations] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [alertDistance, setAlertDistance] = useState('')

  // display state
  const [distance, setDistance] = useState('--')
  const [duration, setDuration] = useState('--')
  const [alertDisp, setAlertDisp] = useState('--')
  const [geoStatus, setGeoStatus] = useState('idle')

  // map refs
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const layersRef = useRef({ route: null, from: null, to: null, user: null, circle: null })

  // refs for dynamic location updates
  const destinationRef = useRef(null) // { lat, lng }
  const watchIdRef = useRef(null)
  const lastUpdateRef = useRef(0)
  const alertTriggeredRef = useRef(false)
  const lastAlertTimeRef = useRef(0) // Add cooldown for alerts
  const UPDATE_SECONDS = 1
  const ANIMATION_MS = 600
  const ALERT_COOLDOWN_MS = 5000 // 5 second cooldown between alerts
  const pollSecondsRef = useRef(UPDATE_SECONDS)
  const fallbackTimerRef = useRef(null)
  const lastCoordRef = useRef(null) // {lat, lng}
  const animFrameRef = useRef(null)

  // lazy getter for global L
  const L = useMemo(() => (typeof window !== 'undefined' ? window.L : undefined), [])

  // init map once
  useEffect(() => {
    if (!L || !mapContainerRef.current || mapRef.current) return
    const m = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(m)
    mapRef.current = m
    return () => {
      if (m) {
        m.remove()
        mapRef.current = null
      }
    }
  }, [L])

  // cleanup watcher on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current)
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  // keep ref in sync with constant
  useEffect(() => { pollSecondsRef.current = UPDATE_SECONDS }, [UPDATE_SECONDS])

  // fetch stations on mount
  useEffect(() => {
    async function run() {
      try {
        const res = await fetch('http://localhost:4000/api/getStation')
        const data = await res.json()
        setStations(Array.isArray(data) ? data : [])
        if (Array.isArray(data) && data.length > 0) {
          setFrom(data[0].name || '')
          setTo(data[0].name || '')
        }
      } catch (e) {
        console.error('Error fetching stations:', e)
      }
    }
    run()
  }, [])

  function clearLayers() {
    const { route, from, to, user, circle } = layersRef.current
    const map = mapRef.current
    if (!map) return
    if (route) { map.removeLayer(route); layersRef.current.route = null }
    if (from) { map.removeLayer(from); layersRef.current.from = null }
    if (to) { map.removeLayer(to); layersRef.current.to = null }
    if (user) { map.removeLayer(user); layersRef.current.user = null }
    if (circle) { map.removeLayer(circle); layersRef.current.circle = null }
  }

  // simple haversine (meters)
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371e3
    const toRad = (d) => d * Math.PI / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function stopWatching() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }
    setGeoStatus('stopped')
  }

  function applyPositionUpdate(latitude, longitude, alertNum) {
    const map = mapRef.current
    if (map) {
      if (layersRef.current.user) {
        const marker = layersRef.current.user
        const from = lastCoordRef.current
        const to = { lat: latitude, lng: longitude }
        lastCoordRef.current = to
        if (!from) {
          marker.setLatLng([latitude, longitude])
        } else {
          if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
          const start = performance.now()
          const latDiff = to.lat - from.lat
          const lngDiff = to.lng - from.lng
          const step = (now) => {
            const t = Math.min(1, (now - start) / ANIMATION_MS)
            const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
            const curLat = from.lat + latDiff * ease
            const curLng = from.lng + lngDiff * ease
            marker.setLatLng([curLat, curLng])
            if (t < 1) {
              animFrameRef.current = requestAnimationFrame(step)
            }
          }
          animFrameRef.current = requestAnimationFrame(step)
        }
      } else if (window.L) {
        const userM = window.L.circleMarker([latitude, longitude], {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.9
        }).addTo(map).bindPopup('Your location')
        layersRef.current.user = userM
        lastCoordRef.current = { lat: latitude, lng: longitude }
      }

      // Update parent component with current location
      if (onLocationUpdate) {
        onLocationUpdate({ latitude, longitude });
      }

      // gentle auto-pan if user near edge
      if (!map.getBounds().pad(-0.25).contains([latitude, longitude])) {
        map.panTo([latitude, longitude])
      }
    }

    const dest = destinationRef.current
    if (!dest) return
    if (Number.isFinite(alertNum)) {
      const distance = haversine(latitude, longitude, dest.lat, dest.lng)
      const distanceFormatted = `${Math.round(distance)} m`
      const currentTime = Date.now()
      
      if (distance <= alertNum) {
        if (!alertTriggeredRef.current) {
          // Check cooldown period before playing audio
          const timeSinceLastAlert = currentTime - lastAlertTimeRef.current
          if (timeSinceLastAlert >= ALERT_COOLDOWN_MS) {
            setAlertDisp(`Alert: ${distanceFormatted}`)
            playAudio()
            lastAlertTimeRef.current = currentTime
          } else {
            setAlertDisp(`Alert: ${distanceFormatted}`)
          }
          alertTriggeredRef.current = true
        } else {
          setAlertDisp(`Alert: ${distanceFormatted}`)
        }
      } else {
        setAlertDisp(`No alert: ${distanceFormatted}`)
        // Only reset alert trigger if we're significantly outside the alert zone
        // This prevents rapid toggling due to GPS fluctuations
        if (distance > alertNum + 10) { // 10 meter buffer
          alertTriggeredRef.current = false
        }
      }
    }
  }

  // watchPosition (low latency) + polling fallback for reliability
  function startWatching(alertNum) {
    stopWatching()
    if (!destinationRef.current) return
    if (!navigator.geolocation) {
      setGeoStatus('geolocation not supported')
      return
    }
    setGeoStatus('starting')
    alertTriggeredRef.current = false

    watchIdRef.current = navigator.geolocation.watchPosition(pos => {
      const { latitude, longitude } = pos.coords
      lastUpdateRef.current = Date.now()
      applyPositionUpdate(latitude, longitude, alertNum)
      setGeoStatus('watch')
    }, err => {
      console.warn('[Geo watch] error', err)
      setGeoStatus('watch error: ' + (err && err.code ? err.code : 'unknown'))
    }, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 })

    // Polling fallback
    const poll = () => navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords
      // Skip if last watch update very recent (< UPDATE_SECONDS * 500ms)
      if (Date.now() - lastUpdateRef.current < UPDATE_SECONDS * 500) return
      lastUpdateRef.current = Date.now()
      applyPositionUpdate(latitude, longitude, alertNum)
      setGeoStatus('poll')
    }, () => { }, { enableHighAccuracy: true, maximumAge: 0, timeout: 8000 })
    poll()
    fallbackTimerRef.current = setInterval(poll, pollSecondsRef.current * 1000)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (!from || !to) return
    const alertNum = Number(alertDistance)
    setAlertDisp(Number.isFinite(alertNum) ? `${alertNum} m` : '--')
    
    // Reset alert state for new route
    alertTriggeredRef.current = false
    lastAlertTimeRef.current = 0

    // get user location first
    const getPosition = () => new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation not supported'))
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
    })

    try {
      const pos = await getPosition()
      const userlat = pos.coords.latitude
      const userlong = pos.coords.longitude

      const res = await fetch('http://localhost:4000/api/getRoute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to, userlat, userlong, alertDistance: Number.isFinite(alertNum) ? alertNum : undefined })
      })
      const result = await res.json()
      const { distanceMetersFormatted, durationSecondsFormatted, alertdis, routeCoordinates } = result || {}

      setDistance(distanceMetersFormatted || '--')
      setDuration(durationSecondsFormatted || '--')
      setAlertDisp(alertdis || (Number.isFinite(alertNum) ? `${alertNum} m` : '--'))

      // Play sound only when backend indicates a positive alert
      if (typeof alertdis === 'string' && alertdis.toLowerCase().startsWith('alert')) {
        playAudio()
      }

      if (L && mapRef.current && Array.isArray(routeCoordinates) && routeCoordinates.length > 0) {
        const map = mapRef.current
        clearLayers()
        // route polyline
        const route = L.polyline(routeCoordinates, { color: '#22c55e', weight: 5, opacity: 0.9 }).addTo(map)
        const fromM = L.marker(routeCoordinates[0]).addTo(map).bindPopup(`From: ${from}`)
        const toM = L.marker(routeCoordinates[routeCoordinates.length - 1]).addTo(map).bindPopup(`To: ${to}`)
        const userM = L.circleMarker([userlat, userlong], {
          radius: 8,
          color: '#ffffff',
          weight: 2,
          fillColor: '#ef4444',
          fillOpacity: 0.9
        }).addTo(map).bindPopup('Your location')

        layersRef.current = { route, from: fromM, to: toM, user: userM, circle: null }
        // store destination for live tracking
        const destLatLng = routeCoordinates[routeCoordinates.length - 1]
        destinationRef.current = { lat: destLatLng[0], lng: destLatLng[1] }

        const bounds = L.latLngBounds(routeCoordinates.concat([[userlat, userlong]]))
        map.fitBounds(bounds, { padding: [20, 20] })

        if (Number.isFinite(alertNum) && alertNum > 0) {
          const circle = L.circle(routeCoordinates[routeCoordinates.length - 1], {
            radius: alertNum,
            color: '#f59e0b',
            fillColor: '#f59e0b',
            fillOpacity: 0.15
          }).addTo(map)
          layersRef.current.circle = circle
        }
        // start dynamic updates
        if (Number.isFinite(alertNum) && alertNum > 0) {
          startWatching(alertNum)
        } else {
          stopWatching()
        }
      }
    } catch (err) {
      console.error('Route request failed:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8 flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
        {/* Left Card */}
        <div className="md:w-1/2 bg-gray-800 bg-opacity-50 rounded-2xl p-6 md:p-8 backdrop-filter backdrop-blur-lg border border-gray-700">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Welcome to BuzzYatra!</h1>
            <form className="space-y-6" onSubmit={onSubmit}>
              <div>
                <label className="block text-left text-white mb-2" htmlFor="fromSelect">From:</label>
                <select id="fromSelect" name="from" value={from} onChange={(e) => setFrom(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400">
                  {stations.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-left text-white mb-2" htmlFor="toSelect">To:</label>
                <select id="toSelect" name="to" value={to} onChange={(e) => setTo(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400">
                  {stations.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-left text-white mb-2" htmlFor="alertme">Alert Metre:</label>
                <input id="alertme" name="alertme" placeholder="Enter the distance in metres"
                  value={alertDistance} onChange={(e) => setAlertDistance(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400" />
              </div>
              <button type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300">
                Submit
              </button>
            </form>
          </div>
        </div>

        {/* Right Card */}
        <div className="md:w-1/2 bg-gray-800 bg-opacity-50 rounded-2xl p-6 md:p-8 backdrop-filter backdrop-blur-lg border border-gray-700 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Route Details</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">From:</span>
              <div className="w-1/2 bg-gray-700 rounded-lg p-3">
                <span className="text-gray-300">{from || '--'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">To:</span>
              <div className="w-1/2 bg-gray-700 rounded-lg p-3">
                <span className="text-gray-300">{to || '--'}</span>
              </div>
            </div>
            <div className="border-t border-gray-700 my-4" style={{ textAlign: 'left' }}></div>
            <p><span className="font-medium">Distance:</span> <span>{distance}</span></p>
            <p><span className="font-medium">Duration:</span> <span>{duration}</span></p>
            <p><span className="font-medium">Alert:</span> <span className="text-yellow-400">{alertDisp}</span></p>
          </div>
          <div ref={mapContainerRef} className="mt-6 rounded-lg overflow-hidden border border-gray-700" style={{ height: 340 }}></div>
        </div>
      </div>
    </div>
  )
}

/* -------------------------
   Old SOS component removed - now using FloatingSOSButton
   ------------------------- */

/* -------------------------
   Enhanced App with SOS Integration
   ------------------------- */
function AppContent() {
  const [showContactsConfig, setShowContactsConfig] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const userId = getUserId();

  return (
    <div className="min-h-screen relative">
      {/* Main Content */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <RouteTracker onLocationUpdate={setCurrentLocation} />
        </div>
      </div>

      {/* Emergency Contacts Configuration Button */}
      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => setShowContactsConfig(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-200 text-sm"
        >
          ⚙️ Emergency Contacts
        </button>
        {/* Test button removed for production */}
      </div>

      {/* Floating SOS Button - Direct Action */}
      <FloatingSOSButton 
        userId={userId}
        isVisible={true}
        currentLocation={currentLocation}
      />

      {/* Emergency Contacts Configuration Modal */}
      {showContactsConfig && (
        <EmergencyContactsConfig
          userId={userId}
          onClose={() => setShowContactsConfig(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  const userId = getUserId();
  
  return (
    <SOSProvider userId={userId}>
      <AppContent />
    </SOSProvider>
  );
}
