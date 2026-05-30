import { useNavigate } from 'react-router-dom'

export default function BottomNav({ active }) {
  const navigate = useNavigate()

  const items = [
    { key: 'inicio', label: 'Inicio', path: '/inicio', icon: HomeIcon },
    { key: 'escanear', label: 'Escanear', path: '/escanear', icon: ScanIcon },
    { key: 'mapa', label: 'Mapa', path: '/mapa', icon: MapIcon },
    { key: 'vehiculos', label: 'Vehículos', path: '/vehiculos', icon: CarIcon },
    { key: 'historial', label: 'Historial', path: '/historial', icon: HistoryIcon },
  ]

  return (
    <div
      style={{
        backgroundColor: '#0d1117',
        borderTop: '1px solid #2a3040',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        padding: '8px 0 calc(16px + env(safe-area-inset-bottom, 0px))',
        flexShrink: 0,
      }}
    >
      {items.map(({ key, label, path, icon: Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: 'none',
              color: isActive ? '#1D9E75' : '#6b7280',
              cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            <Icon isActive={isActive} />
            <span style={{ fontSize: 10, fontWeight: isActive ? '600' : '400' }}>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12L12 3l9 9" />
      <path d="M9 21V12h6v9" />
      <path d="M3 12v9h18V12" />
    </svg>
  )
}

function ScanIcon({ isActive }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="3" width="6" height="6" rx="1" />
      <rect x="3" y="15" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="3" height="3" rx="0.5" fill={isActive ? 'currentColor' : 'none'} stroke="currentColor" />
      <rect x="20" y="15" width="1" height="1" fill="currentColor" />
      <rect x="15" y="20" width="1" height="1" fill="currentColor" />
      <rect x="20" y="20" width="1" height="1" fill="currentColor" />
    </svg>
  )
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
      <path d="M5 12h14" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}
