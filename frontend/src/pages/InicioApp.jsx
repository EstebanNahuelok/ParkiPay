import { useNavigate } from 'react-router-dom'

export  function InicioApp() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0d1117',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#131820',
          borderBottom: '1px solid #1e2535',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 20px',
        }}
      >
        <span style={{ color: '#1D9E75', fontWeight: '700', fontSize: 18, letterSpacing: 0.5 }}>
          SEM Salta
        </span>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          background: 'radial-gradient(ellipse at 50% 30%, #1a2535 0%, #0a0e14 70%)',
        }}
      >
        {/* Logo / Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: '#131820',
            border: '1px solid #1e2535',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            boxShadow: '0 0 40px rgba(29,158,117,0.15)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.6">
            <rect x="2" y="4" width="20" height="16" rx="3" />
            <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M8 17h8" />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            color: '#ffffff',
            fontSize: 26,
            fontWeight: '700',
            margin: '0 0 8px',
            textAlign: 'center',
          }}
        >
          Sistema de Estacionamiento
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.45)',
            fontSize: 14,
            margin: '0 0 48px',
            textAlign: 'center',
            letterSpacing: 0.3,
          }}
        >
          Municipalidad de Salta · SEM
        </p>

        {/* Divider label */}
        <p
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: 12,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Acceder como
        </p>

        {/* Buttons */}
        <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Conductor */}
          <button
            onClick={() => navigate('/escanear')}
            style={{
              width: '100%',
              padding: '18px 20px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: '#1D9E75',
              color: '#fff',
              fontSize: 16,
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8">
                <path d="M5 17H3v-5l2-5h14l2 5v5h-2" />
                <circle cx="7.5" cy="17.5" r="1.5" />
                <circle cx="16.5" cy="17.5" r="1.5" />
                <path d="M5 12h14" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: '700' }}>Conductor</div>
              <div style={{ fontSize: 12, fontWeight: '400', opacity: 0.8, marginTop: 2 }}>
                Escanear QR · Pagar estacionamiento
              </div>
            </div>
            <svg
              style={{ marginLeft: 'auto', opacity: 0.7 }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Permisionario */}
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '100%',
              padding: '18px 20px',
              borderRadius: 14,
              border: '1px solid #1e2535',
              backgroundColor: '#131820',
              color: '#fff',
              fontSize: 16,
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#1D9E75')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e2535')}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#1a2535',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1D9E75" strokeWidth="1.8">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                <path d="M16 11l1.5 1.5L20 10" />
              </svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 16, fontWeight: '700' }}>Permisionario</div>
              <div style={{ fontSize: 12, fontWeight: '400', color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>
                Inspector · Gestión de zonas
              </div>
            </div>
            <svg
              style={{ marginLeft: 'auto', opacity: 0.4 }}
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px 28px',
          textAlign: 'center',
          borderTop: '1px solid #1e2535',
        }}
      >
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
          © {new Date().getFullYear()} Municipalidad de Salta
        </p>
      </div>
    </div>
  )
}