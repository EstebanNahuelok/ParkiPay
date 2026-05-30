import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
const metrics = [
    {
        icon: 'account_balance_wallet',
        iconColor: '#68dbae',
        badge: '+12.5%',
        badgeColor: '#68dbae',
        label: 'Recaudación hoy',
        value: '$124.500',
    },
    {
        icon: 'receipt_long',
        iconColor: '#bbc5eb',
        badge: '+5.2%',
        badgeColor: '#68dbae',
        label: 'Tickets emitidos',
        value: '342',
    },
    {
        icon: 'group',
        iconColor: '#c6c4df',
        badge: '-2',
        badgeColor: '#ffb4ab',
        label: 'Permisionarios activos',
        value: '28',
        sub: '/ 35',
    },
    {
        icon: 'smartphone',
        iconColor: '#86f8c9',
        badge: '+8.1%',
        badgeColor: '#68dbae',
        label: 'Pagos digitales',
        value: '67%',
        progress: 67,
    },
]

const transactions = [
    { patente: 'AB 123 CD', zona: 'Zona A', monto: '$450', metodo: 'App', hora: '10:45' },
    { patente: 'XYZ 987', zona: 'Zona B', monto: '$300', metodo: 'Efectivo', hora: '10:42' },
    { patente: 'AF 456 GH', zona: 'Zona A', monto: '$900', metodo: 'App', hora: '10:38' },
    { patente: 'LMN 234', zona: 'Zona C', monto: '$150', metodo: 'Efectivo', hora: '10:30' },
    { patente: 'AG 789 KL', zona: 'Zona A', monto: '$450', metodo: 'App', hora: '10:25' },
]
const zonas = [
    {
        id: 1,
        nombre: 'Zona Centro',
        coords: [-24.7821, -65.4232],
        vehiculos: 24,
        ocupacion: 92,
        color: '#ff6b6b',
        estado: 'Alta demanda',
        recaudacion: '$18.400'
    },
    {
        id: 2,
        nombre: 'Zona Plaza 9 de Julio',
        coords: [-24.7894, -65.4108],
        vehiculos: 18,
        ocupacion: 75,
        color: '#68dbae',
        estado: 'Normal',
        recaudacion: '$11.250'
    },
    {
        id: 3,
        nombre: 'Zona Shopping',
        coords: [-24.7756, -65.4012],
        vehiculos: 31,
        ocupacion: 97,
        color: '#ffb4ab',
        estado: 'Saturada',
        recaudacion: '$24.600'
    },
    {
        id: 4,
        nombre: 'Zona Terminal',
        coords: [-24.7985, -65.4127],
        vehiculos: 14,
        ocupacion: 48,
        color: '#86f8c9',
        estado: 'Baja demanda',
        recaudacion: '$7.300'
    },
    {
        id: 5,
        nombre: 'Zona Tres Cerritos',
        coords: [-24.7598, -65.3930],
        vehiculos: 11,
        ocupacion: 36,
        color: '#5dade2',
        estado: 'Disponible',
        recaudacion: '$5.200'
    },
    {
        id: 6,
        nombre: 'Zona Legislatura',
        coords: [-24.7848, -65.4161],
        vehiculos: 22,
        ocupacion: 81,
        color: '#ffd166',
        estado: 'Alta rotación',
        recaudacion: '$15.900'
    },
    {
        id: 7,
        nombre: 'Zona Paseo Güemes',
        coords: [-24.7869, -65.4028],
        vehiculos: 27,
        ocupacion: 88,
        color: '#c6c4df',
        estado: 'Demanda elevada',
        recaudacion: '$19.700'
    },
    {
        id: 8,
        nombre: 'Zona Universidad',
        coords: [-24.7268, -65.4102],
        vehiculos: 9,
        ocupacion: 28,
        color: '#68dbae',
        estado: 'Libre',
        recaudacion: '$3.900'
    }
]

export function DashboardAdmin() {
    const navigate = useNavigate()

    return (
        <div style={{ backgroundColor: '#051424', minHeight: '100vh', color: '#d4e4fa', fontFamily: 'Manrope, sans-serif', display: 'flex' }}>
            <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&family=Manrope:wght@400;600;700&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
            <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .fill-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #051424; }
        ::-webkit-scrollbar-thumb { background: #273647; border-radius: 2px; }
      `}</style>

            {/* Sidebar */}
            <aside style={{
                backgroundColor: '#1c2b3c',
                width: 256,
                position: 'fixed',
                left: 0, top: 0,
                height: '100vh',
                borderRight: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px 0',
                zIndex: 50,
            }}>
                {/* Logo */}
                <div style={{ padding: '0 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(104,219,174,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined fill-icon" style={{ color: '#68dbae', fontSize: 24 }}>local_parking</span>
                    </div>
                    <div>
                        <div style={{ color: '#68dbae', fontWeight: 700, fontSize: 24 }}>SEM Salta</div>
                        <div style={{ color: '#bccac1', fontSize: 12 }}>Gestión Municipal</div>
                    </div>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                        { icon: 'dashboard', label: 'Dashboard', active: true },
                        { icon: 'map', label: 'Mapa en vivo', active: false },
                        { icon: 'badge', label: 'Permisionarios', active: false, onClick: () => navigate('/admin/usuarios') },
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
                                fontSize: 14, fontFamily: 'JetBrains Mono, monospace',
                            }}
                        >
                            <span className="material-symbols-outlined">{icon}</span>
                            {label}
                        </button>
                    ))}
                </nav>

                {/* Bottom */}
                <div style={{ padding: '0 16px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <button style={{
                        width: '100%', backgroundColor: '#68dbae', color: '#003827',
                        padding: '12px', borderRadius: 8, border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontSize: 14, fontFamily: 'JetBrains Mono, monospace', cursor: 'pointer', fontWeight: 500,
                    }}>
                        <span className="material-symbols-outlined">add_alert</span>
                        Nueva Alerta
                    </button>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px',
                            borderRadius: 8, border: 'none', backgroundColor: 'transparent',
                            color: '#bccac1', cursor: 'pointer', fontSize: 12,
                            fontFamily: 'JetBrains Mono, monospace', textAlign: 'left', width: '100%',
                        }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>settings</span>
                            Ajustes
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('admin_token')
                                navigate('/admin')
                            }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12, padding: '8px 16px',
                                borderRadius: 8, border: 'none', backgroundColor: 'transparent',
                                color: '#bccac1', cursor: 'pointer', fontSize: 12,
                                fontFamily: 'JetBrains Mono, monospace', textAlign: 'left', width: '100%',
                            }}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <main style={{ marginLeft: 256, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                {/* Topbar */}
                <header style={{
                    backgroundColor: 'rgba(5,20,36,0.8)', backdropFilter: 'blur(12px)',
                    position: 'fixed', top: 0, right: 0, left: 256, height: 64,
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0 32px', zIndex: 40,
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        backgroundColor: '#122131', borderRadius: 8, padding: '8px 16px',
                        width: 384, border: '1px solid rgba(255,255,255,0.1)',
                    }}>
                        <span className="material-symbols-outlined" style={{ color: '#bccac1' }}>search</span>
                        <input placeholder="Buscar patente o zona..." style={{
                            backgroundColor: 'transparent', border: 'none', outline: 'none',
                            fontSize: 16, color: '#d4e4fa', width: '100%',
                        }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <button style={{ color: '#68dbae', fontSize: 14, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'JetBrains Mono, monospace' }}>
                            Descargar Reporte
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#bccac1' }}>
                            <button style={{ background: 'none', border: 'none', color: '#bccac1', cursor: 'pointer', position: 'relative' }}>
                                <span className="material-symbols-outlined">notifications</span>
                                <span style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, backgroundColor: '#ffb4ab', borderRadius: '50%' }} />
                            </button>
                        </div>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                            <img alt="Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASQgIGiybguDqZ214yAC2gUH75fwYtOjbTjlB9jXW5lsRoBTBYVhy_OcyRsTgZ7diroMWCnBJ9RPqPs8x5w7cBJv9LvrD2NGkDrqpzyPn5A_aDv1_lCgyBQZKMTRhtl3PgLdvhNfeeLnqG2srelclt9YDZZXOaJQJfhRDeckZpAFRoPbni8wJ7O8MyUMWgCh67v_70cXZlAnQoQrhCGTFfSmELZY1-QoX7n8GnXNVAaCnsc2a0q5qPlsRCE-ssmQP_ZXWBNUiZI-qV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div style={{ marginTop: 64, padding: 40, display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {/* Page header */}
                    <div>
                        <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', color: '#d4e4fa' }}>Buenos días, Admin</h2>
                        <p style={{ color: '#bccac1', fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>calendar_today</span>
                            Jueves, 24 de Octubre de 2023
                        </p>
                    </div>

                    {/* Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                        {metrics.map(({ icon, iconColor, badge, badgeColor, label, value, sub, progress }) => (
                            <div key={label} style={{
                                backgroundColor: '#122131', borderRadius: 12,
                                padding: 16, border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: '#1c2b3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <span className="material-symbols-outlined" style={{ color: iconColor }}>{icon}</span>
                                    </div>
                                    <span style={{ color: badgeColor, fontSize: 12, backgroundColor: `${badgeColor}1a`, padding: '4px 8px', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace' }}>{badge}</span>
                                </div>
                                <div style={{ color: '#bccac1', fontSize: 14, marginBottom: 4, fontFamily: 'JetBrains Mono, monospace' }}>{label}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 24, fontWeight: 600, color: '#d4e4fa' }}>{value}</span>
                                    {sub && <span style={{ color: '#bccac1', fontSize: 16 }}>{sub}</span>}
                                    {progress && (
                                        <div style={{ flex: 1, height: 4, backgroundColor: '#1c2b3c', borderRadius: 99, overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${progress}%`, backgroundColor: '#68dbae', borderRadius: 99 }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Map + Table */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                        {/* Map */}
                        <div
                            style={{
                                backgroundColor: '#122131',
                                borderRadius: 12,
                                border: '1px solid rgba(255,255,255,0.1)',
                                overflow: 'hidden',
                                height: 500,
                            }}
                        >
                            <div
                                style={{
                                    padding: '16px',
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    backgroundColor: '#1c2b3c',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }}
                            >
                                <span className="material-symbols-outlined">map</span>
                                <h3 style={{ margin: 0 }}>Mapa en vivo</h3>
                            </div>

                            <MapContainer
                                center={[-24.7821, -65.4232]} // Salta Capital
                                zoom={14}
                                style={{
                                    height: 'calc(100% - 65px)',
                                    width: '100%',
                                }}
                            >
                                <TileLayer
                                    attribution='&copy; OpenStreetMap'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                {/* Ejemplo marcadores */}
                                {zonas.map((zona) => (
                                    <CircleMarker
                                        key={zona.nombre}
                                        center={zona.coords}
                                        radius={10}
                                        pathOptions={{
                                            color: zona.color,
                                            fillColor: zona.color,
                                            fillOpacity: 0.8,
                                        }}
                                    >
                                        <Popup>
                                            {zona.nombre}<br />
                                            {zona.vehiculos} vehículos
                                        </Popup>
                                    </CircleMarker>
                                ))}

                                <CircleMarker
                                    center={[-24.7890, -65.4180]}
                                    radius={8}
                                    pathOptions={{
                                        color: '#ffb4ab',
                                        fillColor: '#ffb4ab',
                                        fillOpacity: 0.8,
                                    }}
                                >
                                    <Popup>
                                        Zona B <br />
                                        Alta ocupación
                                    </Popup>
                                </CircleMarker>
                            </MapContainer>
                        </div>

                        {/* Transactions */}
                        <div style={{ backgroundColor: '#122131', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1c2b3c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span className="material-symbols-outlined" style={{ color: '#c6c4df' }}>history</span>
                                    Últimas transacciones
                                </h3>
                                <button style={{ color: '#68dbae', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>Ver todas</button>
                            </div>
                            <div style={{ flex: 1, overflowY: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            {['Patente', 'Monto', 'Hora'].map(h => (
                                                <th key={h} style={{ padding: '12px 16px', fontSize: 12, color: '#bccac1', fontWeight: 400, textAlign: 'left', fontFamily: 'JetBrains Mono, monospace' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map(({ patente, zona, monto, metodo, hora }) => (
                                            <tr key={patente} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ fontWeight: 700, letterSpacing: 2, color: '#86f8c9', fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}>{patente}</div>
                                                    <div style={{ color: '#bccac1', fontSize: 12 }}>{zona}</div>
                                                </td>
                                                <td style={{ padding: '12px 16px' }}>
                                                    <div style={{ fontSize: 14, color: '#d4e4fa' }}>{monto}</div>
                                                    <div style={{ color: '#bccac1', fontSize: 12 }}>{metodo}</div>
                                                </td>
                                                <td style={{ padding: '12px 16px', color: '#bccac1', fontSize: 14, fontFamily: 'JetBrains Mono, monospace' }}>{hora}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}