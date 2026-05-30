import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { useParking } from '../context/ParkingContext'
import { ButtonRegresar } from '../components/ButtonRegresar'

export default function Vehiculos() {
  const navigate = useNavigate()
  const { updateParkingData } = useParking()
  const [vehiculos, setVehiculos] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('sem_vehiculos')
    if (saved) {
      try {
        setVehiculos(JSON.parse(saved))
      } catch {
        setVehiculos([])
      }
    }
  }, [])

  const limpiarHistorial = () => {
    localStorage.removeItem('sem_vehiculos')
    setVehiculos([])
  }

  const usar = (v) => {
    updateParkingData({ patente: v.patente })
    navigate('/confirmar')
  }

  const formatFecha = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#0d1117' }}>
      <ButtonRegresar to="/inicio" />
      {/* Header */}
      <div
        style={{
          backgroundColor: '#0d1117',
          borderBottom: '1px solid #2a3040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
        }}
      >
        <div style={{ width: 40 }} />
        <span style={{ color: '#1D9E75', fontWeight: '600', fontSize: 17 }}>SEM Salta</span>
        <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: '700', margin: '0 0 4px' }}>
          Mis Vehículos
        </h2>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 20px' }}>
          Seleccioná un vehículo para iniciar estacionamiento.
        </p>

        {vehiculos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 0', color: '#6b7280' }}>
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              style={{ marginBottom: 14, opacity: 0.5 }}
            >
              <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
              <circle cx="7.5" cy="17.5" r="1.5" />
              <circle cx="16.5" cy="17.5" r="1.5" />
              <path d="M5 12h14" />
            </svg>
            <p style={{ fontSize: 14 }}>Todavía no tenés vehículos guardados.</p>
            <p style={{ fontSize: 12, marginTop: 6, color: '#4b5563' }}>
              Tus vehículos aparecerán automáticamente cuando pagás un estacionamiento.
            </p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {vehiculos.map((v, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#1a1f2e',
                    borderRadius: 14,
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: '#1a2535',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
                      <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
                      <circle cx="7.5" cy="17.5" r="1.5" />
                      <circle cx="16.5" cy="17.5" r="1.5" />
                      <path d="M5 12h14" />
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: '0 0 5px',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: 15,
                        fontFamily: 'monospace',
                        letterSpacing: 2,
                      }}
                    >
                      {v.patente}
                    </p>
                    {v.zona && (
                      <p
                        style={{
                          margin: '0 0 3px',
                          color: '#9ca3af',
                          fontSize: 12,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {v.zona}
                      </p>
                    )}
                    <p
                      style={{
                        margin: 0,
                        color: '#6b7280',
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {formatFecha(v.fecha)}
                    </p>
                  </div>
                  <button
                    onClick={() => usar(v)}
                    style={{
                      padding: '9px 20px',
                      borderRadius: 10,
                      border: 'none',
                      backgroundColor: '#1D9E75',
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: '700',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  >
                    Usar
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={limpiarHistorial}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '14px',
                borderRadius: 14,
                border: '1px solid #2a3040',
                backgroundColor: 'transparent',
                color: '#9ca3af',
                fontSize: 14,
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
              Limpiar historial
            </button>

            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: 12, marginTop: 12 }}>
              Tus vehículos aparecerán automáticamente cuando pagás un estacionamiento.
            </p>
          </>
        )}
      </div>

      <BottomNav active="vehiculos" />
    </div>
  )
}
