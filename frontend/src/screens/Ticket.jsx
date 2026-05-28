import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useParking } from '../context/ParkingContext'

function getValidoHasta(horas) {
  const now = new Date()
  now.setHours(now.getHours() + horas)
  return now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) + ' hs'
}

export default function Ticket() {
  const navigate = useNavigate()
  const { parkingData, getTotalConDescuento } = useParking()
  const { patente, vehiculo, horas, cuadra } = parkingData

  const validoHasta = getValidoHasta(horas)
  const monto = getTotalConDescuento()

  const qrData = JSON.stringify({
    patente,
    vehiculo,
    horas,
    cuadra,
    monto,
    validoHasta,
    timestamp: Date.now(),
  })

  const handleShare = async () => {
    const text = `🅿️ SEM Salta — Ticket de estacionamiento\nPatente: ${patente}\nCuadra: ${cuadra}\nVálido hasta: ${validoHasta}\nMonto: $${monto}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Ticket SEM Salta', text })
      } catch {}
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <div
      className="flex flex-col items-center"
      style={{ minHeight: '100vh', backgroundColor: '#0d1117', padding: '40px 20px 32px' }}
    >
      {/* Checkmark */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          backgroundColor: '#1a3a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      </div>

      <h1 style={{ color: '#fff', fontSize: 26, fontWeight: '700', margin: '0 0 6px', textAlign: 'center' }}>
        ¡Pagaste!
      </h1>
      <p style={{ color: '#9ca3af', fontSize: 15, margin: '0 0 28px', textAlign: 'center' }}>
        Tu estacionamiento está activo
      </p>

      {/* Ticket card */}
      <div
        style={{
          width: '100%',
          maxWidth: 390,
          backgroundColor: '#1a1f2e',
          borderRadius: 20,
          padding: '24px 20px 20px',
          marginBottom: 28,
        }}
      >
        {/* QR Code */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: 12,
              borderRadius: 10,
            }}
          >
            <QRCodeSVG
              value={qrData}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>
        </div>

        {/* Info rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <InfoRow
            icon={<LocationIcon />}
            label="Cuadra"
            value={cuadra}
            isLast={false}
          />
          <InfoRow
            icon={<ClockIcon />}
            label="Válido hasta"
            value={validoHasta}
            valueColor="#1D9E75"
            isLast={false}
          />
          <InfoRow
            icon={<CarIcon />}
            label="Patente"
            value={patente}
            valueTag
            isLast
          />
        </div>
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', maxWidth: 390, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 14,
            border: 'none',
            backgroundColor: '#1D9E75',
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 11l19-9-9 19-2-8-8-2z" />
          </svg>
          Volver al mapa
        </button>
        <button
          onClick={handleShare}
          style={{
            width: '100%',
            padding: '15px',
            borderRadius: 14,
            border: '1px solid #2a3040',
            backgroundColor: 'transparent',
            color: '#1D9E75',
            fontSize: 16,
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Compartir ticket
        </button>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, valueColor, valueTag, isLast }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: isLast ? 'none' : '1px solid #2a3040',
        gap: 12,
      }}
    >
      <span style={{ color: '#9ca3af', flexShrink: 0 }}>{icon}</span>
      <span style={{ color: '#9ca3af', fontSize: 14, flex: 1 }}>{label}</span>
      {valueTag ? (
        <span
          style={{
            backgroundColor: '#0d1117',
            color: '#fff',
            fontSize: 14,
            fontWeight: '700',
            fontFamily: 'monospace',
            padding: '6px 12px',
            borderRadius: 8,
            letterSpacing: 2,
          }}
        >
          {value}
        </span>
      ) : (
        <span style={{ color: valueColor || '#fff', fontSize: 14, fontWeight: '600' }}>{value}</span>
      )}
    </div>
  )
}

function LocationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  )
}
