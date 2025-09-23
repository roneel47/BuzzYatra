import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import sound from './assets/sound.mp3'

// Uses Leaflet loaded from CDN in index.html (global L)
function playAudio() {
  const audio = new Audio(sound)
  audio.play()
}

function App() {
  // form state
  const [stations, setStations] = useState([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [alertDistance, setAlertDistance] = useState('')

  // display state
  const [distance, setDistance] = useState('--')
  const [duration, setDuration] = useState('--')
  const [alertDisp, setAlertDisp] = useState('--')

  // map refs
  const mapRef = useRef(null)
  const mapContainerRef = useRef(null)
  const layersRef = useRef({ route: null, from: null, to: null, user: null, circle: null })

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
  }, [L])

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

  async function onSubmit(e) {
    e.preventDefault()
    if (!from || !to) return
    const alertNum = Number(alertDistance)
    setAlertDisp(Number.isFinite(alertNum) ? `${alertNum} m` : '--')

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
                <input id="alertme" name="alertme" required placeholder="Enter the distance in metres"
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
            <div className="border-t border-gray-700 my-4 text-align=left"></div>
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

export default App
