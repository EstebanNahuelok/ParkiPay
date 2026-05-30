import { useNavigate } from 'react-router-dom'

const permisionarios = [
  { legajo: '#P-8472', iniciales: 'CG', color: '#68dbae', nombre: 'Carlos Gómez', zona: 'Zona Centro - Cuadra 12', activo: true, recaudacion: '$ 14.500,00' },
  { legajo: '#P-3921', iniciales: 'MR', color: '#bbc5eb', nombre: 'María Rodríguez', zona: 'Monumento Güemes - Sur', activo: true, recaudacion: '$ 8.200,00' },
  { legajo: '#P-5510', iniciales: 'JL', color: '#ffb4ab', nombre: 'Jorge López', zona: 'Paseo Balcarce', activo: false, recaudacion: '$ 0,00' },
  { legajo: '#P-1104', iniciales: 'AM', color: '#c6c4df', nombre: 'Ana Martínez', zona: 'Plaza 9 de Julio - Norte', activo: true, recaudacion: '$ 21.350,00' },
  { legajo: '#P-6233', iniciales: 'RS', color: '#68dbae', nombre: 'Roberto Silva', zona: 'Av. San Martín - Cuadra 5', activo: true, recaudacion: '$ 11.900,00' },
  { legajo: '#P-9012', iniciales: 'LT', color: '#bbc5eb', nombre: 'Lucía Torres', zona: 'Parque San Martín - Este', activo: true, recaudacion: '$ 5.600,00' },
]

export  function PermisionariosAdmin() {
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: '#051424', minHeight: '100vh', color: '#d4e4fa', fontFamily: 'Manrope, sans-serif', display: 'flex' }}>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Manrope:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        * { box-sizing: border-box; }
        tr:hover td { background-color: rgba(255,255,255,0.02); }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        backgroundColor: '#1c2b3c', width: 256, position: 'fixed',
        left: 0, top: 0, height: '100vh',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '0 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: 'rgba(104,219,174,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-symbols-outlined fill-icon" style={{ color: '#68dbae', fontSize: 24 }}>local_parking</span>
          </div>
          <div>
            <div style={{ color: '#68dbae', fontWeight: 700, fontSize: 24 }}>SEM Salta</div>
            <div style={{ color: '#bccac1', fontSize: 12 }}>Gestión Municipal</div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 24px', marginBottom: 32 }}>
          <button style={{
            width: '100%', backgroundColor: '#68dbae', color: '#003827',
            padding: '12px', borderRadius: 8, border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 14, fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', fontWeight: 500,
          }}>
            <span className="material-symbols-outlined">add_alert</span>
            Nueva Alerta
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { icon: 'dashboard', label: 'Dashboard', active: false, onClick: () => navigate('/admin/dashboard') },
            { icon: 'map', label: 'Mapa en vivo', active: false },
            { icon: 'badge', label: 'Permisionarios', active: true },
            { icon: 'analytics', label: 'Reportes', active: false },
          ].map(({ icon, label, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 8, border: 'none',
                backgroundColor: active ? 'rgba(104,219,174,0.1)' : 'transparent',
                color: active ? '#68dbae' : '#bccac1',
                borderRight: active ? '4px solid #68dbae' : '4px solid transparent',
                cursor: 'pointer', width: '100%', textAlign: 'left',
                fontSize: 14, fontFamily: 'JetBrains Mono, monospace', fontWeight: active ? 700 : 400,
              }}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#bccac1', cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', textAlign: 'left', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
            Ajustes
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', color: '#ffb4ab', cursor: 'pointer', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', textAlign: 'left', width: '100%' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Topbar */}
        <header style={{
          backgroundColor: 'rgba(5,20,36,0.8)', backdropFilter: 'blur(12px)',
          position: 'fixed', top: 0, right: 0, left: 256, height: 64,
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0 32px', zIndex: 40,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, backgroundColor: 'rgba(18,33,49,0.5)', borderRadius: 8, padding: '6px 12px', width: 256, border: '1px solid rgba(255,255,255,0.05)', color: '#bccac1' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>search</span>
            <input placeholder="Buscar global..." style={{ backgroundColor: 'transparent', border: 'none', outline: 'none', fontSize: 16, color: '#d4e4fa', width: '100%' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <button style={{ background: 'none', border: 'none', color: '#bccac1', cursor: 'pointer', position: 'relative' }}>
                <span className="material-symbols-outlined">notifications</span>
                <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: '#ffb4ab', borderRadius: '50%' }} />
              </button>
              <button style={{ background: 'none', border: 'none', color: '#bccac1', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">help_outline</span>
              </button>
            </div>
            <div style={{ width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.1)' }} />
            <button style={{ color: '#68dbae', fontSize: 14, fontFamily: 'JetBrains Mono, monospace', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
              Descargar Reporte
            </button>
            <img alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACHv_YNMMAIUPFir7CBozThPNBrtww_m6RJzoO4O8CRp_26-UAbbJWOJlyf6mTnz092Ho8G1xgr30pW4rmoVWVuhu5CfKL9tKygVP5DTwUtFqILOhsScxyotCleOIF-nDttxtbqG6018rSvABpazlFEF2MDCBpTbE8bpBsI5bIu13QMB2Z3cKHkopy8teQOTUMnpKw07hMhJeDniflxXoS_MGvxmOT6jWAZNUms41iaYqOTITSSBLn8ybYbtv6bRR93uSzCWQF1Fb5"
              style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(104,219,174,0.3)', objectFit: 'cover' }}
            />
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, marginTop: 64, padding: 40, overflowY: 'auto' }}>
          {/* Page Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', color: '#d4e4fa' }}>Permisionarios</h2>
              <p style={{ color: '#bccac1', fontSize: 16, margin: 0, maxWidth: 512 }}>
                Administre el padrón de permisionarios activos en el ejido municipal de Salta.
              </p>
            </div>
            <button style={{
              backgroundColor: '#68dbae', color: '#003827', padding: '10px 24px',
              borderRadius: 8, border: 'none', display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 14, fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', fontWeight: 500,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person_add</span>
              Agregar permisionario
            </button>
          </div>

          {/* Controls */}
          <div style={{ backgroundColor: '#122131', borderRadius: 12, padding: 16, marginBottom: 24, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth: 300, maxWidth: 400, flex: 1 }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, color: '#bccac1' }}>search</span>
              <input
                placeholder="Buscar por nombre o legajo..."
                style={{
                  width: '100%', backgroundColor: '#010f1f', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, padding: '8px 16px 8px 40px', fontSize: 16, color: '#d4e4fa', outline: 'none',
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {['filter_list:Filtros', 'sort:Ordenar'].map(item => {
                const [icon, label] = item.split(':')
                return (
                  <button key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
                    borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'transparent', color: '#bccac1', cursor: 'pointer',
                    fontSize: 14, fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Table */}
          <div style={{ backgroundColor: '#122131', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#273647', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Legajo', 'Nombre', 'Zona Asignada', 'Estado', 'Recaudación Hoy', 'Acciones'].map((h, i) => (
                      <th key={h} style={{ padding: '16px 24px', fontSize: 12, color: '#bccac1', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'JetBrains Mono, monospace', textAlign: i >= 4 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permisionarios.map(({ legajo, iniciales, color, nombre, zona, activo, recaudacion }) => (
                    <tr key={legajo} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}>
                      <td style={{ padding: '16px 24px', fontSize: 14, fontFamily: 'JetBrains Mono, monospace', color: '#d4e4fa' }}>{legajo}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: `${color}33`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
                            {iniciales}
                          </div>
                          <span style={{ fontSize: 16, color: activo ? '#d4e4fa' : 'rgba(212,228,250,0.5)' }}>{nombre}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: 16, color: activo ? '#bccac1' : 'rgba(188,202,193,0.5)' }}>{zona}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '4px 10px', borderRadius: 99, fontSize: 12,
                          backgroundColor: activo ? 'rgba(104,219,174,0.1)' : 'rgba(255,180,171,0.1)',
                          color: activo ? '#68dbae' : '#ffb4ab',
                          border: `1px solid ${activo ? 'rgba(104,219,174,0.2)' : 'rgba(255,180,171,0.2)'}`,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: activo ? '#68dbae' : '#ffb4ab' }} />
                          {activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: 16, color: activo ? '#d4e4fa' : 'rgba(212,228,250,0.5)', textAlign: 'right', fontWeight: 500 }}>{recaudacion}</td>
                      <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          {[{ icon: 'visibility', color: '#68dbae' }, { icon: 'edit', color: '#c6c4df' }].map(({ icon, color: c }) => (
                            <button key={icon} style={{ padding: 6, borderRadius: 6, border: 'none', backgroundColor: 'transparent', color: '#bccac1', cursor: 'pointer' }}
                              onMouseEnter={e => (e.currentTarget.style.color = c)}
                              onMouseLeave={e => (e.currentTarget.style.color = '#bccac1')}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ backgroundColor: '#273647', padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#bccac1', fontFamily: 'JetBrains Mono, monospace' }}>
                Mostrando 1 a 6 de 142 permisionarios
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button style={{ padding: 4, borderRadius: 4, border: 'none', backgroundColor: 'transparent', color: '#bccac1', cursor: 'pointer', opacity: 0.5 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
                </button>
                {[1, 2, 3, '...', 24].map((p, i) => (
                  <button key={i} style={{
                    width: 32, height: 32, borderRadius: 4, border: 'none', cursor: 'pointer',
                    backgroundColor: p === 1 ? '#68dbae' : 'transparent',
                    color: p === 1 ? '#003827' : '#bccac1',
                    fontSize: 12, fontFamily: 'JetBrains Mono, monospace',
                  }}>{p}</button>
                ))}
                <button style={{ padding: 4, borderRadius: 4, border: 'none', backgroundColor: 'transparent', color: '#bccac1', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}