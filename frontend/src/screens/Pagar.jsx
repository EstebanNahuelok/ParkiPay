import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParking } from '../context/ParkingContext'
import { crearSesionEstacionamiento, crearPreferenciaMercadoPago } from '../api/index'

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

const METODOS = [
  {
    key: 'transferencia',
    label: 'Transferencia',
    Icon: BankIcon,
  },
  {
    key: 'debito',
    label: 'Tarjeta de Débito',
    Icon: DebitIcon,
  },
  {
    key: 'credito',
    label: 'Tarjeta de Crédito',
    Icon: CreditIcon,
  },
  {
    key: "mercadopago",
    label: "Mercado Pago",
    Icon: CreditIcon
  }
]

export default function Pagar() {
  const navigate = useNavigate()
  const { parkingData, updateParkingData, getTotalConDescuento, getTotal } = useParking()
  const { patente, vehiculo, horas, cuadra, metodoPago, parkingSpot } = parkingData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationStatus, setLocationStatus] = useState(parkingSpot ? 'verified' : 'none')
  const [currentAddress, setCurrentAddress] = useState(parkingSpot?.address || '')
  const [currentLocation, setCurrentLocation] = useState(parkingSpot || null)

  useEffect(() => {
    if (parkingSpot) {
      setCurrentLocation(parkingSpot)
      setCurrentAddress(parkingSpot.address || '')
      // Si vino por dirección manual (lat/lng null), no hay nada que reverificar
      if (parkingSpot.lat != null && parkingSpot.lng != null) {
        verifyLocation(parkingSpot.lat, parkingSpot.lng)
      } else {
        setLocationStatus('verified')
      }
    } else {
      setLocationStatus('none')
    }
  }, [])

  const verifyLocation = async (lat, lng) => {
    setLocationStatus('verifying')
    try {
      const addr = await reverseGeocode(lat, lng)
      setCurrentAddress(addr)
      setLocationStatus('verified')
    } catch {
      setLocationStatus('error')
    }
  }

  const requestNewLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      return
    }

    setLocationStatus('locating')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setCurrentLocation(loc)
        await verifyLocation(loc.lat, loc.lng)
        
        updateParkingData({
          parkingSpot: {
            id: generateId(),
            lat: loc.lat,
            lng: loc.lng,
            address: currentAddress,
            timestamp: new Date().toISOString(),
          }
        })
      },
      () => {
        setLocationStatus('error')
      },
      { timeout: 15000, enableHighAccuracy: true }
    )
  }

  

  const monto = getTotalConDescuento()
  const original = getTotal()

  const handlePagar = async () => {
    setLoading(true)
    setError(null)
    try {
      if (metodoPago === 'mercadopago') {
        // 1. Crear la sesión primero
        const sesion = await crearSesionEstacionamiento({
          patente: patente.toUpperCase(),
          tipoVehiculo: vehiculo.toUpperCase(),
          horas,
          monto,
          metodoPago: 'MERCADO_PAGO',
        })
        sessionStorage.setItem('parkingData', JSON.stringify({
          ...parkingData,
          sesionId: sesion.id ?? sesion._id,
          monto,
        }))


        // 2. Pedir la preferencia de MP con el sesionId
        const { init_point } = await crearPreferenciaMercadoPago({
          sesionId: sesion.id ?? sesion._id,
          amount: monto,
          patente: patente.toUpperCase(),
        })

        // 3. Redirigir a MercadoPago
        window.location.href = init_point

      } else {
        // Flujo normal para otros métodos
        const sesion = await crearSesionEstacionamiento({
          patente: patente.toUpperCase(),
          tipoVehiculo: vehiculo.toUpperCase(),
          horas,
          monto,
          metodoPago: metodoPago.toUpperCase(),
        })
        updateParkingData({ sesionId: sesion.id ?? sesion._id ?? null })
        navigate('/ticket')
      }
    } catch (e) {
      setError('No se pudo procesar el pago. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="bg-salta" />
    <div className="bg-salta-overlay" />
    <div className="flex flex-col" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Header */}
      <div
        style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #2a3040' }}
        className="flex items-center px-4 py-3"
      >
        <button
          onClick={() => navigate('/confirmar')}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4, marginRight: 12 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={{ color: '#1D9E75', fontWeight: '600', fontSize: 17, flex: 1, textAlign: 'center', marginRight: 38 }}>
          Checkout
        </span>
      </div>

      {/* Location Verification */}
      {(locationStatus === 'verifying' || locationStatus === 'locating') && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse" style={{ backgroundColor: 'rgba(29, 158, 117, 0.1)', border: '2px solid rgba(29, 158, 117, 0.3)' }}>
              <svg width="36" height="36" fill="none" stroke="#1D9E75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 style={{ color: '#fff', fontSize: 22, fontWeight: '700', margin: '0 0 8px' }}>
              Verificando ubicación...
            </h2>
            <p style={{ color: '#9ca3af', fontSize: 14, margin: 0 }}>
              {locationStatus === 'locating' ? 'Obteniendo GPS...' : 'Consultando mapa...'}
            </p>
          </div>
        </div>
      )}

      {locationStatus === 'verified' && currentLocation && (
        <div className="px-5 pt-4 pb-0">
          <div 
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(29, 158, 117, 0.1)', border: '1px solid rgba(29, 158, 117, 0.2)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(29, 158, 117, 0.2)' }}>
              <svg width="20" height="20" fill="none" stroke="#1D9E75" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', margin: 0 }}>
                Ubicación verificada
              </p>
              <p style={{ color: '#fff', fontSize: 13, fontWeight: '600', margin: '2px 0 0', wordBreak: 'break-word' }}>
                {currentAddress}
              </p>
            </div>
            <button
              onClick={requestNewLocation}
              className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 cursor-pointer transition-all"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}
            >
              Cambiar
            </button>
          </div>
        </div>
      )}

      {locationStatus === 'error' && (
        <div className="px-5 pt-4 pb-0">
          <div 
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)' }}>
              <svg width="20" height="20" fill="none" stroke="#ef4444" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#ef4444', fontSize: 13, fontWeight: '600', margin: 0 }}>
                Sin ubicación
              </p>
              <p style={{ color: '#9ca3af', fontSize: 12, margin: '2px 0 0' }}>
                No se pudo verificar tu ubicación
              </p>
            </div>
            <button
              onClick={requestNewLocation}
              className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 cursor-pointer transition-all"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {locationStatus === 'none' && (
        <div className="px-5 pt-4 pb-0">
          <div 
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ backgroundColor: '#1a1f2e', border: '1px solid #2a3040' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(107, 114, 128, 0.2)' }}>
              <svg width="20" height="20" fill="none" stroke="#9ca3af" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: '#9ca3af', fontSize: 13, fontWeight: '600', margin: 0 }}>
                Sin ubicación
              </p>
              <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>
                No se marcó ubicación
              </p>
            </div>
            <button
              onClick={requestNewLocation}
              className="px-3 py-2 rounded-lg text-xs font-semibold flex-shrink-0 cursor-pointer transition-all"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa' }}
            >
              Agregar GPS
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 px-5 pt-5 pb-6 w-full max-w-2xl mx-auto">
        {/* Summary card */}
        <div
          style={{
            backgroundColor: '#1a1f2e',
            borderRadius: 20,
            padding: '24px 20px 20px',
            marginBottom: 28,
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>
            Total a pagar
          </p>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12, rowGap: 8, marginBottom: 16 }}>
            <span style={{ color: '#fff', fontSize: 'clamp(26px, 9vw, 38px)', fontWeight: '800' }}>
              ${monto.toLocaleString('es-AR')}
            </span>
            <span style={{ color: '#6b7280', fontSize: 'clamp(16px, 5vw, 20px)', fontWeight: '400', textDecoration: 'line-through' }}>
              ${original.toLocaleString('es-AR')}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                backgroundColor: 'rgba(29,158,117,0.15)',
                border: '1px solid rgba(29,158,117,0.4)',
                color: '#1D9E75',
                fontSize: 13,
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: 99,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
              -20% Dto
            </span>
          </div>

          <div style={{ borderTop: '1px solid #2a3040', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#9ca3af', fontSize: 14 }}>Estacionamiento - Zona A</span>
            <span style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
              {horas} {horas === 1 ? 'hora' : 'horas'}
            </span>
          </div>
        </div>

        {/* Payment methods */}
        <p style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 14 }}>
          Método de Pago
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {METODOS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => updateParkingData({ metodoPago: key })}
              style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: 14,
                border: metodoPago === key ? '2px solid #1D9E75' : '2px solid #2a3040',
                backgroundColor: '#1a1f2e',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'border-color 0.15s',
              }}
            >
              {/* Radio circle */}
              <div
                style={{
                  width: 22, height: 22,
                  borderRadius: '50%',
                  border: metodoPago === key ? '2px solid #1D9E75' : '2px solid #4b5563',
                  backgroundColor: 'transparent',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {metodoPago === key && (
                  <div style={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: '#1D9E75' }} />
                )}
              </div>
              <Icon />
              <span style={{ fontWeight: '600', fontSize: 16 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding: '0 20px calc(32px + env(safe-area-inset-bottom, 0px))', backgroundColor: '#0d1117' }}>
        <div className="w-full max-w-2xl mx-auto">
        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </p>
        )}
        <button
          onClick={handlePagar}
          disabled={loading}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: loading ? '#155e4a' : '#1D9E75',
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 12,
            opacity: loading ? 0.8 : 1,
            transition: 'background-color 0.15s, opacity 0.15s',
          }}
        >
          {loading ? 'Procesando...' : `Pagar $${monto.toLocaleString('es-AR')}`}
          {!loading && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          )}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#6b7280', fontSize: 13 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Pago seguro y encriptado
        </div>
        </div>
      </div>
    </div>
    </>
  )
}

function BankIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
      <rect x="3" y="9" width="18" height="12" rx="1" />
      <path d="M3 9l9-6 9 6" />
      <line x1="12" y1="9" x2="12" y2="21" />
      <line x1="7" y1="9" x2="7" y2="21" />
      <line x1="17" y1="9" x2="17" y2="21" />
    </svg>
  )
}

function DebitIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}

function CreditIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <circle cx="8" cy="15" r="2" />
      <circle cx="14" cy="15" r="2" />
    </svg>
  )
}
