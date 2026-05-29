import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParking } from '../context/ParkingContext'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const pinIcon = L.divIcon({
  html: `<div style="
    background:#1D9E75;width:28px;height:28px;
    border-radius:50% 50% 50% 0;transform:rotate(-45deg);
    border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  className: '',
})

function FlyTo({ lat, lng }) {
  const map = useMap()
  useEffect(() => { map.setView([lat, lng], 17) }, [lat, lng, map])
  return null
}

function LocationMap({ lat, lng }) {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', height: 180, marginBottom: 16 }}>
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        keyboard={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FlyTo lat={lat} lng={lng} />
        <Marker position={[lat, lng]} icon={pinIcon} />
      </MapContainer>
    </div>
  )
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`,
      { headers: { 'User-Agent': 'ParkiPay/1.0' } }
    )
    const data = await response.json()
    if (data.address) {
      const addr = data.address
      const street = addr.road || addr.street || addr.pedestrian || addr.footway || ''
      const number = addr.house_number || ''
      const city = addr.city || addr.town || addr.village || 'Salta'
      
      let addressStr = ''
      if (street && number) addressStr = `${street} ${number}`
      else if (street) addressStr = street
      else addressStr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      
      const parts = [addressStr]
      if (city && city !== 'Salta') parts.push(city)
      parts.push('Salta')
      return parts.join(', ')
    }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  }
}

export default function UbicarAuto() {
  const navigate = useNavigate()
  const { updateParkingData } = useParking()
  const [status, setStatus] = useState('locating')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [location, setLocation] = useState(null)

  useEffect(() => {
    requestLocation()
  }, [])

  const requestLocation = (highAccuracy = true) => {
    setStatus('locating')
    setAddress('')
    setLocation(null)
    setManualAddress('')

    if (!navigator.geolocation) {
      setStatus('error')
      setAddress('Tu navegador no soporta geolocalización.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setLocation(loc)
        setStatus('loading')

        const addr = await reverseGeocode(loc.lat, loc.lng)
        setAddress(addr)
        setStatus('ready')
      },
      (err) => {
        console.error('Geolocation error:', err.code, err.message)
        // POSITION_UNAVAILABLE con alta precisión → reintentá sin ella
        if (err.code === 2 && highAccuracy) {
          requestLocation(false)
          return
        }
        setStatus('error')
        if (err.code === 1) {
          setAddress('Permiso de ubicación denegado. Habilitalo en la configuración del navegador.')
        } else if (err.code === 2) {
          setAddress('No hay señal GPS disponible. Activá el GPS del dispositivo o intentá al aire libre.')
        } else if (err.code === 3) {
          setAddress('Tiempo de espera agotado. Intentá en un lugar con mejor señal.')
        } else {
          setAddress('No se pudo obtener la ubicación.')
        }
      },
      { timeout: highAccuracy ? 15000 : 20000, enableHighAccuracy: highAccuracy }
    )
  }

  const handleConfirmar = () => {
    if (!location) return
    updateParkingData({
      parkingSpot: {
        id: generateId(),
        lat: location.lat,
        lng: location.lng,
        address,
        note,
        timestamp: new Date().toISOString(),
      }
    })
    navigate('/pagar')
  }

  

  return (
    <div 
      className="flex flex-col" 
      style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0d1117',
      }}
    >
      {/* Header */}
      <div
        style={{ 
          backgroundColor: '#0d1117', 
          borderBottom: '1px solid #2a3040',
          padding: '12px 16px',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
        }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => navigate('/confirmar')}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 8 }}
          className="hover:text-white transition-colors rounded-lg"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={{ color: '#1D9E75', fontWeight: '600', fontSize: 18 }}>SEM Salta</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Content */}
      <div
        className="flex-1 flex flex-col items-center px-6 py-8 overflow-y-auto"
        style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}
      >
        
        {/* LOCATING / LOADING STATE */}
        {(status === 'locating' || status === 'loading') && (
          <div className="text-center w-full flex-1 flex flex-col items-center justify-center">
            {/* Radar Animation */}
            <div className="relative mb-10">
              <div 
                className="w-32 h-32 rounded-full border-2 border-brand/20 mx-auto flex items-center justify-center animate-pulse"
                style={{ backgroundColor: 'rgba(29, 158, 117, 0.05)' }}
              >
                <div 
                  className="w-24 h-24 rounded-full border-2 border-brand/30 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(29, 158, 117, 0.08)' }}
                >
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(29, 158, 117, 0.15)' }}
                  >
                    <svg width="32" height="32" fill="none" stroke="#1D9E75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: '700', margin: '0 0 8px' }}>
              {status === 'locating' ? 'Buscando señal GPS' : 'Obteniendo dirección...'}
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 15, margin: 0 }}>
              {status === 'locating' ? 'Esperando ubicación...' : 'Consultando mapa...'}
            </p>
          </div>
        )}

        {/* READY STATE */}
        {status === 'ready' && location && (
          <div className="text-center w-full">
            {/* Success */}
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ 
                backgroundColor: 'rgba(29, 158, 117, 0.1)',
                border: '2px solid rgba(29, 158, 117, 0.3)',
              }}
            >
              <svg width="40" height="40" fill="none" stroke="#1D9E75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: '700', margin: '0 0 4px' }}>
              Ubicación detectada
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 20px' }}>
              Tu vehículo está aquí
            </p>

            <LocationMap lat={location.lat} lng={location.lng} />

            {/* Address Card */}
            <div
              style={{
                backgroundColor: '#1a1f2e',
                borderRadius: 16,
                padding: 20,
                marginBottom: 20,
                textAlign: 'left',
              }}
            >
              <div 
                className="flex items-center gap-3 mb-4"
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  backgroundColor: 'rgba(29, 158, 117, 0.08)',
                  border: '1px solid rgba(29, 158, 117, 0.2)',
                }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: 'rgba(29, 158, 117, 0.2)' }}
                >
                  <svg width="20" height="20" fill="none" stroke="#1D9E75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
                    Dirección
                  </p>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: '600', margin: '2px 0 0', wordBreak: 'break-word' }}>
                    {address}
                  </p>
                </div>
              </div>

              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej: Frente al banco, junto al café"
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid #2a3040',
                  backgroundColor: '#0d1117',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
                onClick={handleConfirmar}
                disabled={status !== 'ready'}
                className="w-full py-4 rounded-xl border-none bg-brand text-white font-bold cursor-pointer transition-all hover:bg-green-600 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirmar ubicación
              </button>
          </div>
        )}

        {/* ERROR STATE */}
        {status === 'error' && (
          <div className="text-center w-full">
            <div
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <svg width="40" height="40" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h2 style={{ color: '#fff', fontSize: 24, fontWeight: '700', margin: '0 0 8px' }}>
              Sin señal GPS
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 20px' }}>
              Ingresá la dirección manualmente o reintentá.
            </p>

            {/* Manual address input */}
            <div
              style={{
                backgroundColor: '#1a1f2e',
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                textAlign: 'left',
              }}
            >
              <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 10px' }}>
                Dirección manual
              </p>
              <input
                type="text"
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                placeholder="Ej: Alvarado 567, Salta"
                maxLength={150}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  border: '1px solid #2a3040',
                  backgroundColor: '#0d1117',
                  color: '#fff',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              onClick={() => {
                if (manualAddress.trim()) {
                  updateParkingData({
                    parkingSpot: {
                      id: generateId(),
                      lat: null,
                      lng: null,
                      address: manualAddress.trim(),
                      note: '',
                      timestamp: new Date().toISOString(),
                    }
                  })
                  navigate('/pagar')
                }
              }}
              disabled={!manualAddress.trim()}
              className="w-full py-4 rounded-xl border-none bg-brand text-white font-bold cursor-pointer transition-all hover:bg-green-600 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed mb-3"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Confirmar dirección
            </button>

            <button
              onClick={() => requestLocation()}
              className="w-full py-4 rounded-xl border-2 border-blue-500 bg-blue-500/10 text-blue-400 font-semibold cursor-pointer transition-all hover:bg-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reintentar GPS
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
