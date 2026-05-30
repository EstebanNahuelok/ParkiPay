import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import BottomNav from '../components/BottomNav'
import API_URL from '../api/index.js'

const SALTA_CENTER = [-24.7859, -65.4116]

const TIPO_COLOR = {
  GRATUITO: '#1D9E75',
  AUTO: '#3b82f6',
  MOTO: '#f97316',
}

const SAMPLE_MARKERS = [
  { id: 1, lat: -24.782, lng: -65.41, tipo: 'GRATUITO', nombre: 'Zona Centro' },
  { id: 2, lat: -24.787, lng: -65.415, tipo: 'AUTO', nombre: 'Zona Alberdi' },
  { id: 3, lat: -24.792, lng: -65.408, tipo: 'MOTO', nombre: 'Zona Belgrano' },
]

function makeIcon(color) {
  return new L.DivIcon({
    html: `<div style="
      width:30px;height:30px;
      background:${color};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.45);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`,
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

export default function MapaZonas() {
  const navigate = useNavigate()
  const [zonas, setZonas] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/api/zonas`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setZonas(Array.isArray(data) && data.length > 0 ? data : SAMPLE_MARKERS))
      .catch(() => setZonas(SAMPLE_MARKERS))
  }, [])

  const legend = [
    { color: '#1D9E75', label: 'Gratuito' },
    { color: '#3b82f6', label: 'Auto' },
    { color: '#f97316', label: 'Moto' },
  ]

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117' }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0d1117',
          borderBottom: '1px solid #2a3040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          zIndex: 1001,
          position: 'relative',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span style={{ color: '#1D9E75', fontWeight: '600', fontSize: 17 }}>SEM Salta</span>
        <div style={{ width: 30 }} />
      </div>

      {/* Map area */}
      <div style={{ flex: 1, position: 'relative', minHeight: 300 }}>
        <MapContainer
          center={SALTA_CENTER}
          zoom={14}
          zoomControl={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          {zonas.map((zona) => (
            <Marker
              key={zona.id}
              position={[zona.lat, zona.lng]}
              icon={makeIcon(TIPO_COLOR[zona.tipo] || '#1D9E75')}
            >
              <Popup>{zona.nombre || zona.tipo}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(13,17,23,0.92)',
            borderRadius: 12,
            padding: '10px 20px',
            display: 'flex',
            gap: 18,
            zIndex: 1000,
            border: '1px solid #2a3040',
            whiteSpace: 'nowrap',
          }}
        >
          {legend.map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
              <span style={{ color: '#fff', fontSize: 13 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Scan button */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 20,
            right: 20,
            zIndex: 1000,
          }}
        >
          <button
            onClick={() => navigate('/escanear')}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: '#1D9E75',
              color: '#fff',
              fontSize: 15,
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="6" height="6" rx="1" />
              <rect x="15" y="3" width="6" height="6" rx="1" />
              <rect x="3" y="15" width="6" height="6" rx="1" />
              <rect x="15" y="15" width="3" height="3" rx="0.5" />
            </svg>
            Escanear QR aquí
          </button>
        </div>
      </div>

      <BottomNav active="mapa" />
    </div>
  )
}
