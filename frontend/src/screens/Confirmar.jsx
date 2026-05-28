import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParking } from '../context/ParkingContext'

export default function Confirmar() {
  const navigate = useNavigate()
  const { parkingData, updateParkingData, getTotal, getTotalConDescuento, TARIFA } = useParking()
  const { patente, vehiculo, horas } = parkingData
  const [patenteError, setPatenteError] = useState(false)

  const setHoras = (h) => updateParkingData({ horas: Math.min(8, Math.max(1, h)) })

  const handleIrAPagar = () => {
    if (!patente.trim()) {
      setPatenteError(true)
      return
    }
    navigate('/pagar')
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div
        style={{ backgroundColor: '#131820', borderBottom: '1px solid #1e2535' }}
        className="flex items-center justify-between px-4 py-3"
      >
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <span style={{ color: '#1D9E75', fontWeight: '600', fontSize: 17 }}>SEM Salta</span>
        <button style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-7 pb-6" style={{ backgroundColor: '#f0f2f5' }}>
        <h1 style={{ color: '#1D9E75', fontSize: 26, fontWeight: '700', margin: '0 0 4px' }}>
          Confirmar datos
        </h1>
        <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 24px' }}>
          Verifique la información antes de iniciar.
        </p>

        {/* Main card */}
        <div style={{ backgroundColor: '#c5cad4', borderRadius: 16, padding: 16 }}>
          {/* Patente */}
          <label style={{ color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
            Patente
          </label>
          <input
            type="text"
            value={patente}
            onChange={(e) => {
              updateParkingData({ patente: e.target.value.toUpperCase() })
              if (patenteError) setPatenteError(false)
            }}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 6,
              marginBottom: patenteError ? 4 : 20,
              padding: '13px 16px',
              borderRadius: 10,
              border: patenteError ? '2px solid #ef4444' : '2px solid transparent',
              backgroundColor: '#0d1117',
              color: '#fff',
              fontSize: 18,
              fontFamily: 'monospace',
              fontWeight: '700',
              letterSpacing: 3,
              outline: 'none',
            }}
          />
          {patenteError && (
            <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Ingresá la patente para continuar
            </p>
          )}

          {/* Vehículo */}
          <label style={{ color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
            Vehículo
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8, marginBottom: 20 }}>
            {[
              { key: 'auto', label: 'Auto', tarifa: TARIFA.auto, Icon: CarSvg },
              { key: 'moto', label: 'Moto', tarifa: TARIFA.moto, Icon: MotoSvg },
            ].map(({ key, label, tarifa, Icon }) => (
              <button
                key={key}
                onClick={() => updateParkingData({ vehiculo: key })}
                style={{
                  padding: '16px 8px 12px',
                  borderRadius: 12,
                  border: vehiculo === key ? '2px solid #1D9E75' : '2px solid transparent',
                  backgroundColor: vehiculo === key ? '#0d1925' : '#131c29',
                  color: vehiculo === key ? '#1D9E75' : '#9ca3af',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.15s',
                }}
              >
                <Icon color={vehiculo === key ? '#1D9E75' : '#9ca3af'} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: 15 }}>{label}</div>
                  <div style={{ fontSize: 13, opacity: 0.85 }}>${tarifa}/h</div>
                </div>
              </button>
            ))}
          </div>

          {/* Tiempo estimado */}
          <label style={{ color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' }}>
            Tiempo estimado
          </label>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
              padding: '12px 20px',
              borderRadius: 10,
              backgroundColor: '#0d1117',
            }}
          >
            <button
              onClick={() => setHoras(horas - 1)}
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                fontSize: 28, lineHeight: 1, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              −
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 1 }}>{horas}</div>
              <div style={{ color: '#9ca3af', fontSize: 12, marginTop: 2 }}>Horas</div>
            </div>
            <button
              onClick={() => setHoras(horas + 1)}
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
                fontSize: 28, lineHeight: 1, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Price summary card */}
        <div
          style={{
            marginTop: 16,
            borderRadius: 16,
            backgroundColor: '#c5cad4',
            border: '2px solid #1D9E75',
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ color: '#374151', fontSize: 14 }}>Total a pagar</span>
            <span style={{ color: '#1a1f2e', fontSize: 18, fontWeight: '700' }}>
              ${getTotal().toLocaleString('es-AR')}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span style={{ color: '#1D9E75', fontSize: 14, fontWeight: '600' }}>
                Con pago digital: ${getTotalConDescuento().toLocaleString('es-AR')}
              </span>
            </div>
            <span style={{ color: '#1D9E75', fontSize: 13, fontWeight: '600', backgroundColor: 'rgba(29,158,117,0.15)', padding: '2px 8px', borderRadius: 99 }}>
              -20%
            </span>
          </div>

          <button
            onClick={handleIrAPagar}
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: 12,
              border: 'none',
              backgroundColor: '#1D9E75',
              color: '#fff',
              fontSize: 16,
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            Ir a pagar
          </button>
        </div>
      </div>
    </div>
  )
}

function CarSvg({ color }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 12h14" />
    </svg>
  )
}

function MotoSvg({ color }) {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
      <circle cx="5.5" cy="17" r="2.5" />
      <circle cx="18.5" cy="17" r="2.5" />
      <path d="M8 17h7" />
      <path d="M14 17V9l-4-2H8" />
      <path d="M14 9h4l1 3" />
      <path d="M6 10l3-3" />
    </svg>
  )
}
