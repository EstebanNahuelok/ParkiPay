import { useNavigate } from 'react-router-dom'

export function ButtonRegresar() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        borderRadius: 10,
        border: '1px solid #1e2535',
        backgroundColor: '#131820',
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = '#1D9E75')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e2535')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="2">
        <path d="M15 18l-6-6 6-6" />
      </svg>
      Regresar
    </button>
  )
}