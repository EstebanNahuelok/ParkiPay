import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ButtonRegresar } from '../components/ButtonRegresar'

export function AuthAdmin() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise(r => setTimeout(r, 800)) // simular request

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin_token', 'demo-token')
      navigate('/admin/dashboard')
    } else {
      setError('Usuario o contraseña incorrectos')
      setPassword('')
    }
    setLoading(false)
  }, [username, password, navigate])

  return (
    <>
      <div className="bg-salta" />
      <div className="bg-salta-overlay" />
      <div className="min-h-screen text-white font-sans flex items-center justify-center p-4 sm:p-6 relative z-[2]">
        <div className="w-full max-w-6xl bg-[#0C1017] rounded-2xl overflow-hidden border border-gray-800/80 flex flex-col lg:flex-row shadow-[0_0_80px_rgba(0,0,0,0.6)]">

          {/* Left panel */}
          <div className="w-full lg:w-[45%] relative bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#080B11] p-8 lg:p-14 flex flex-col justify-between min-h-[280px] lg:min-h-[700px] border-b lg:border-b-0 lg:border-r border-gray-800/80">

            <ButtonRegresar />
          {/* Decorative lines */}
            <div className="absolute top-0 right-16 bottom-0 w-40 opacity-30 flex justify-between pointer-events-none">
              <div className="w-[2px] bg-gradient-to-b from-transparent via-[#1D9E75] to-transparent shadow-[0_0_15px_rgba(29,158,117,0.7)]" />
              <div className="w-[1px] bg-gradient-to-b from-transparent via-pink-500 to-transparent shadow-[0_0_10px_rgba(29,158,117,0.5)]" />
              <div className="w-[3px] bg-gradient-to-b from-transparent via-[#1D9E75] to-transparent shadow-[0_0_20px_rgba(29,158,117,0.8)]" />
            </div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-gray-600/10 rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-0 w-48 h-48 bg-[#1D9E75]/10 rounded-full blur-3xl" />
            </div>

            {/* Logo */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1D9E75] to-[#15803d] flex items-center justify-center shadow-lg shadow-[#1D9E75]/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <span className="text-2xl lg:text-3xl font-bold tracking-tight">SEM Salta</span>
                <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">Municipalidad de Salta</p>
              </div>
            </div>

            {/* Description */}
            <div className="relative z-10 mt-8 lg:mt-0">
              <h2 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
                Panel Municipal
              </h2>
              <p className="text-sm lg:text-base text-gray-400 leading-relaxed max-w-sm">
                Acceso exclusivo para personal de la Municipalidad de Salta. Gestioná zonas, permisionarios y recaudación.
              </p>

              <div className="mt-8 space-y-3 hidden lg:block">
                {[
                  'Métricas de recaudación en tiempo real',
                  'Gestión de permisionarios y zonas',
                  'Mapa de ocupación en vivo',
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1D9E75]/10 border border-[#1D9E75]/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#1D9E75]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-300">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="relative z-10 flex gap-2 mt-8 lg:mt-0">
              <span className="w-8 h-1.5 bg-[#1D9E75] rounded-full" />
              <span className="w-3 h-1.5 bg-gray-700 rounded-full" />
              <span className="w-3 h-1.5 bg-gray-700 rounded-full" />
            </div>
          </div>

          {/* Right panel — form */}
          <div className="w-full lg:w-[55%] p-6 sm:p-8 lg:p-14 flex flex-col justify-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-100 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-gray-400 mb-8">
              Ingresá tus credenciales de administrador para acceder al panel.
            </p>

            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError('') }}
                    placeholder="admin"
                    required
                    autoFocus
                    autoComplete="off"
                    className="w-full bg-[#111622] border border-gray-800 rounded-lg pl-12 pr-4 py-3.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/30 transition-all"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#111622] border border-gray-800 rounded-lg pl-12 pr-4 py-3.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#1D9E75] focus:ring-1 focus:ring-[#1D9E75]/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !username.trim() || !password.trim()}
                className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all shadow-lg shadow-[#1D9E75]/20 hover:shadow-[#1D9E75]/30 disabled:shadow-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                )}
                {loading ? 'Verificando...' : 'Ingresar'}
              </button>
            </form>

            <p className="mt-8 text-xs text-gray-600 text-center flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Acceso exclusivo para personal municipal.
            </p>
          </div>

        </div>
      </div>
    </>
  )
}