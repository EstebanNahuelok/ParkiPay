import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080B11] text-white font-sans">
      <header className="border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg shadow-brand/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold">SEM Salta</span>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Municipalidad de Salta</p>
            </div>
          </div>
          <Link
            to="/login"
            className="hidden sm:inline-flex bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all shadow-lg shadow-brand/20"
          >
            Iniciar Sesion
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-brand/10 border border-brand/20 rounded-full text-brand text-xs font-semibold uppercase tracking-wider mb-6">
              Estacionamiento Medido &middot; Salta
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Estacionamiento inteligente{' '}
              <span className="bg-gradient-to-r from-brand to-brand-dark bg-clip-text text-transparent">
                al alcance de tu mano
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Sistema de gestion de estacionamiento medido para permisionarios de la
              Municipalidad de Salta. Cobra con QR, gestiona tu cuadra y lleva el control
              diario de forma simple y segura.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] text-white font-bold px-8 py-4 rounded-xl text-base transition-all shadow-xl shadow-brand/25 hover:shadow-brand/40 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Acceso Permisionario
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Todo lo que necesitas</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
              Herramientas simples y efectivas para la gestion diaria del estacionamiento medido.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-[#0C1017] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Cobro Digital</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Acepta pagos con QR interoperable, Mercado Pago o transferencia. 20% de descuento municipal para el conductor.
              </p>
            </div>

            <div className="bg-[#0C1017] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Panel de Control</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Visualiza tu recaudacion en tiempo real, vehiculos activos y liquidacion diaria desde un solo lugar.
              </p>
            </div>

            <div className="bg-[#0C1017] border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-colors group sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Acceso Seguro</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Autenticacion con legajo municipal y PIN. Proteccion anti fuerza bruta y sesiones con tokens JWT.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-br from-[#0d1117] to-[#0C1017] border border-gray-800 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              &iquest;Sos permisionario?
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8 text-sm sm:text-base">
              Ingresa con tu legajo municipal y PIN de 4 digitos para acceder al panel de control.
            </p>
            <Link
              to="/login"
              className="inline-flex bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-xl shadow-brand/25 hover:shadow-brand/40 items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Ingresar al Sistema
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-xs text-gray-600">
            &copy; 2026 SEM Salta &middot; Municipalidad de Salta &middot; Sistema de Estacionamiento Medido
          </p>
        </div>
      </footer>
    </div>
  );
}
