import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParking } from '../context/ParkingContext'
import { crearSesionEstacionamiento } from '../api/index'

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
]

export default function Pagar() {
  const navigate = useNavigate()
  const { parkingData, updateParkingData, getTotalConDescuento, getTotal } = useParking()
  const { patente, vehiculo, horas, cuadra, metodoPago } = parkingData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const monto = getTotalConDescuento()
  const original = getTotal()

  const handlePagar = async () => {
    setLoading(true)
    setError(null)
    try {
      const sesion = await crearSesionEstacionamiento({
        patente: patente.toUpperCase(),
        tipoVehiculo: vehiculo.toUpperCase(),
        horas,
        monto,
        metodoPago: metodoPago.toUpperCase(),
      })
      updateParkingData({ sesionId: sesion.id ?? sesion._id ?? null })
      navigate('/ticket')
    } catch (e) {
      setError('No se pudo procesar el pago. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col" style={{ minHeight: '100vh', backgroundColor: '#0d1117' }}>
      {/* Header */}
      <div
        style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #1e2535' }}
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

      {/* Content */}
      <div className="flex-1 px-5 pt-5 pb-6">
        {/* Summary card */}
        <div
          style={{
            backgroundColor: '#1a1f2e',
            borderRadius: 16,
            padding: '20px 20px 16px',
            marginBottom: 28,
          }}
        >
          <p style={{ color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', margin: '0 0 8px' }}>
            Total a pagar
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ color: '#fff', fontSize: 38, fontWeight: '800' }}>
              ${monto.toLocaleString('es-AR')}
            </span>
            <span style={{ color: '#6b7280', fontSize: 20, fontWeight: '400', textDecoration: 'line-through' }}>
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
      <div style={{ padding: '0 20px 32px', backgroundColor: '#0d1117' }}>
        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
          </p>
        )}
        <button
          onClick={handlePagar}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: loading ? '#155e4a' : '#1D9E75',
            color: '#fff',
            fontSize: 17,
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
