import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { ButtonRegresar } from '../components/ButtonRegresar'

export default function Inicio() {
  const navigate = useNavigate()

  const steps = [
    { num: 1, title: 'Escaneá el QR de la cuadra', desc: 'Buscá los carteles indicadores.' },
    { num: 2, title: 'Ingresá tu patente y elegí las horas', desc: 'Gestión 100% digital.' },
    { num: 3, title: 'Pagá y recibí tu ticket digital', desc: 'Múltiples medios de pago.' },
  ]

  return (
    <>
      <div className="bg-salta" />
      <div className="bg-salta-overlay" />
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <ButtonRegresar to="/" />
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
        <div style={{ flex: 1, padding: '32px 20px 24px', display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ color: '#fff', fontSize: 26, fontWeight: '700', margin: '0 0 6px' }}>
            ¡Hola de nuevo!
          </h1>
          <p style={{ color: '#9ca3af', fontSize: 14, margin: '0 0 28px' }}>
            Estacioná rápido y seguro en la ciudad.
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
            {steps.map(({ num, title, desc }) => (
              <div
                key={num}
                style={{
                  backgroundColor: '#1a1f2e',
                  borderRadius: 14,
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: '#1D9E75',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: 15,
                  }}
                >
                  {num}
                </div>
                <div>
                  <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: '600', fontSize: 15 }}>{title}</p>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: 13 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => navigate('/escanear')}
              style={{
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
              Escanear QR
            </button>
            <button
              onClick={() => navigate('/mapa')}
              style={{
                padding: '15px',
                borderRadius: 14,
                border: '1px solid #2a3040',
                backgroundColor: 'transparent',
                color: '#1D9E75',
                fontSize: 15,
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
              Ver mapa de zonas
            </button>
          </div>
        </div>

        <BottomNav active="inicio" />
      </div>
    </>
  )
}
