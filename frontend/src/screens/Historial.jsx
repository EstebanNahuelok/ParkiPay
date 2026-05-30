import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { ButtonRegresar } from '../components/ButtonRegresar'

export default function Historial() {
  const navigate = useNavigate()
  const [historial, setHistorial] = useState([])
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => {
    const saved = localStorage.getItem('sem_vehiculos')
    if (saved) {
      try {
        setHistorial(JSON.parse(saved))
      } catch {
        setHistorial([])
      }
    }
  }, [])

  const ahora = new Date()
  const filtrados = historial.filter((item) => {
    const fecha = new Date(item.fecha)
    if (filtro === 'semana') {
      const diff = (ahora - fecha) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }
    if (filtro === 'mes') {
      return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear()
    }
    return true
  })

  const formatFecha = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) +
      ' · ' +
      d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  }

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'mes', label: 'Este mes' },
    { key: 'semana', label: 'Esta semana' },
  ]

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
        <h2 style={{ color: '#fff', fontSize: 20, fontWeight: '700', margin: '0 0 4px' }}>Historial</h2>
        <p style={{ color: '#9ca3af', fontSize: 13, margin: '0 0 18px' }}>
          Tus últimos estacionamientos.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filtros.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFiltro(key)}
              style={{
                padding: '7px 14px',
                borderRadius: 20,
                border: `1px solid ${filtro === key ? '#1D9E75' : '#2a3040'}`,
                backgroundColor: filtro === key ? 'rgba(29,158,117,0.15)' : 'transparent',
                color: filtro === key ? '#1D9E75' : '#9ca3af',
                fontSize: 13,
                fontWeight: filtro === key ? '600' : '400',
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {filtrados.length === 0 ? (
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
              <path d="M3 3v5h5" />
              <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
              <path d="M12 7v5l4 2" />
            </svg>
            <p style={{ fontSize: 14 }}>No hay estacionamientos en este período.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtrados.map((item, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#1a1f2e',
                  borderRadius: 14,
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <p style={{ margin: '0 0 3px', color: '#1D9E75', fontWeight: '600', fontSize: 14 }}>
                      {item.zona || 'Zona desconocida'}
                    </p>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: 12 }}>{formatFecha(item.fecha)}</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid #2a3040', paddingTop: 10 }}>
                  <p style={{ margin: 0, color: '#9ca3af', fontSize: 13 }}>
                    Vehículo{' '}
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: '700',
                        color: '#fff',
                        letterSpacing: 2,
                        fontSize: 13,
                      }}
                    >
                      {item.patente}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="historial" />
    </div>
  )
}
