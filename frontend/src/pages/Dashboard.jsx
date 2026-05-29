import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../services/api';
import MapView from '../components/MapView';

const TABS = {
  CUADRA: 'cuadra',
  COBRAR: 'cobrar',
  HISTORIAL: 'historial',
  MAPA: 'mapa',
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(TABS.CUADRA);
  const [user] = useState(() => {
    const storedUser = localStorage.getItem('parkipay_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('parkipay_token');
    localStorage.removeItem('parkipay_user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-white font-sans">
      <header className="bg-[#0C1017] border-b border-gray-800 px-4 py-3 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">SEM Salta</h1>
              <p className="text-xs text-gray-500">Permisionario</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user.nombre}</p>
                <p className="text-xs text-gray-500">Legajo {user.legajo}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {activeTab === TABS.MAPA ? (
        <div className="fixed inset-0 top-[60px] bottom-16">
          <MapView />
        </div>
      ) : (
        <main className="max-w-7xl mx-auto p-4" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}>
          {activeTab === TABS.CUADRA && <MiCuadra onCobrar={() => setActiveTab(TABS.COBRAR)} />}
          {activeTab === TABS.COBRAR && <Cobrar onVolver={() => setActiveTab(TABS.CUADRA)} />}
          {activeTab === TABS.HISTORIAL && <Historial />}
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#0C1017] border-t border-gray-800 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="max-w-7xl mx-auto flex">
          <button
            onClick={() => setActiveTab(TABS.CUADRA)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === TABS.CUADRA ? 'text-brand' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-semibold">Mi Cuadra</span>
          </button>
          <button
            onClick={() => setActiveTab(TABS.COBRAR)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === TABS.COBRAR ? 'text-brand' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-semibold">Cobrar</span>
          </button>
          <button
            onClick={() => setActiveTab(TABS.HISTORIAL)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === TABS.HISTORIAL ? 'text-brand' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs font-semibold">Historial</span>
          </button>
          <button
            onClick={() => setActiveTab(TABS.MAPA)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-colors ${
              activeTab === TABS.MAPA ? 'text-brand' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-xs font-semibold">Mapa</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function MiCuadra({ onCobrar }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const mountedRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const result = await api.getCuadra();
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      loadData();
    }
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={loadData} className="mt-3 text-sm text-brand hover:underline">
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#0d1117] to-[#0C1017] border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Zona Asignada</p>
            <h2 className="text-2xl font-bold">{data.zona.nombre}</h2>
            <p className="text-sm text-gray-400 mt-1">{data.zona.cuadras}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#111622] rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Recaudación Hoy</p>
            <p className="text-2xl font-bold text-green-500">${data.recaudacion_hoy.toLocaleString('es-AR')}</p>
          </div>
          <div className="bg-[#111622] rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Tickets Hoy</p>
            <p className="text-2xl font-bold">{data.tickets_hoy}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0C1017] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Vehículos Activos</h3>
          <span className="px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-sm font-semibold text-brand">
            {data.total_activos} activos
          </span>
        </div>
        {data.vehiculos_activos.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500">No hay vehículos activos en tu zona</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.vehiculos_activos.map((v) => (
              <div key={v.id} className="bg-[#111622] border border-gray-800 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    v.tipo_vehiculo === 'auto' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-gray-500/10 border border-brand/20'
                  }`}>
                    <svg className={`w-5 h-5 ${v.tipo_vehiculo === 'auto' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {v.tipo_vehiculo === 'auto' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v4m-4-4h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{v.patente}</p>
                    <p className="text-xs text-gray-500 capitalize">{v.tipo_vehiculo}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${v.minutos_restantes <= 10 ? 'text-red-500' : 'text-gray-300'}`}>
                    {v.minutos_restantes} min
                  </p>
                  <p className="text-xs text-gray-500">restantes</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onCobrar}
        className="fixed bottom-24 right-4 w-16 h-16 bg-gradient-to-br from-brand to-brand-dark rounded-full shadow-lg shadow-brand/30 flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>
  );
}

function Cobrar({ onVolver }) {
  const [step, setStep] = useState(1);
  const [patente, setPatente] = useState('');
  const [tipoVehiculo, setTipoVehiculo] = useState('');
  const [horas, setHoras] = useState(1);
  const [metodoPago, setMetodoPago] = useState('');
  const [subMetodoDigital, setSubMetodoDigital] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState(null);
  const [pagoData, setPagoData] = useState(null);
  const [ultimos4, setUltimos4] = useState('');
  const [polling, setPolling] = useState(false);
  const pollingRef = useRef(null);

  const TARIFAS = { auto: 700, moto: 300 };
  const DESCUENTO_DIGITAL = 0.20;

  const validarPatente = (p) => {
    const limpia = p.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return /^[A-Z]{2,3}[0-9]{3}$|^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(limpia);
  };

  const calcularTotal = () => {
    if (!tipoVehiculo) return 0;
    return TARIFAS[tipoVehiculo] * horas;
  };

  const calcularTotalConDescuento = () => {
    const total = calcularTotal();
    if (metodoPago === 'digital') {
      return Math.round(total * (1 - DESCUENTO_DIGITAL));
    }
    return total;
  };

  const handlePatenteChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    setPatente(value);
    setError('');
  };

  const handleSiguiente = () => {
    if (step === 1) {
      if (!validarPatente(patente)) {
        setError('Formato de patente inválido (AAA123 o AA123AA)');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!tipoVehiculo) {
        setError('Selecciona el tipo de vehículo');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      if (!metodoPago) {
        setError('Selecciona el método de pago');
        return;
      }
      if (metodoPago === 'efectivo') {
        handleEmitirEfectivo();
      } else {
        setStep(5);
      }
    } else if (step === 5) {
      if (!subMetodoDigital) {
        setError('Selecciona una opción de pago digital');
        return;
      }
      handleEmitirDigital();
    } else if (step === 6 && subMetodoDigital === 'transferencia') {
      if (!/^\d{4}$/.test(ultimos4)) {
        setError('Ingresa los últimos 4 dígitos del comprobante');
        return;
      }
      handleValidarTransferencia();
    }
  };

  const handleEmitirEfectivo = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await api.emitirTicket({
        patente,
        tipo_vehiculo: tipoVehiculo,
        horas,
        metodo_pago: 'efectivo',
      });
      setTicket(result.ticket);
      setStep(8);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmitirDigital = async () => {
    setLoading(true);
    setError('');
    try {
      const ticketResult = await api.emitirTicket({
        patente,
        tipo_vehiculo: tipoVehiculo,
        horas,
        metodo_pago: 'digital',
      });
      setTicket(ticketResult.ticket);

      let pagoResult;
      if (subMetodoDigital === 'mercadopago') {
        // TODO: Descomentar cuando el backend tenga MP_ACCESS_TOKEN configurado
        // pagoResult = await api.generarPreferenciaMP(ticketResult.ticket.id);
        pagoResult = {
          pago: {
            id: 1,
            tipo_pago: 'mercadopago',
            estado: 'pendiente',
            qr_data: 'https://www.salta.gob.ar/estacionamiento-medido-prueba',
            init_point: 'https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=1234',
            monto: calcularTotalConDescuento(),
          }
        };
      } else if (subMetodoDigital === 'transferencia') {
        pagoResult = await api.generarDatosTransferencia(ticketResult.ticket.id);
      } else if (subMetodoDigital === 'qr_interoperable') {
        // TODO: Descomentar cuando el backend esté listo
        // pagoResult = await api.generarQRInteroperable(ticketResult.ticket.id);
        pagoResult = {
          pago: {
            id: 2,
            tipo_pago: 'qr_interoperable',
            estado: 'pendiente',
            qr_data: 'https://www.salta.gob.ar/estacionamiento-medido-prueba',
            monto: calcularTotalConDescuento(),
          }
        };
      }

      setPagoData(pagoResult.pago);

      if (subMetodoDigital === 'transferencia') {
        setStep(6);
      } else {
        setStep(7);
        startPolling(ticketResult.ticket.id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidarTransferencia = async () => {
    setLoading(true);
    setError('');
    try {
      await api.validarTransferencia(ticket.id, ultimos4);
      setStep(8);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPolling = (ticketId) => {
    setPolling(true);
    pollingRef.current = setInterval(async () => {
      try {
        const result = await api.verificarEstadoPago(ticketId);
        if (result.aprobado) {
          clearInterval(pollingRef.current);
          setPolling(false);
          setTicket((prev) => ({
            ...prev,
            hora_inicio: result.hora_inicio,
            hora_fin: result.hora_fin,
            estado: 'activo',
          }));
          setStep(8);
        }
      } catch {
        // ignore polling errors
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  if (step === 8 && ticket) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-green-500/10 to-[#0C1017] border border-green-500/20 rounded-xl p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Ticket Emitido</h2>
          <p className="text-sm text-gray-400 mb-6">{ticket.codigo}</p>

          <div className="bg-[#111622] rounded-lg p-4 space-y-3 text-left mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Patente</span>
              <span className="font-bold">{ticket.patente}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vehículo</span>
              <span className="capitalize">{ticket.tipo_vehiculo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Horas</span>
              <span>{ticket.horas}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tarifa</span>
              <span>${ticket.tarifa_hora}/h</span>
            </div>
            {ticket.descuento > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="line-through text-gray-600">${ticket.monto_original?.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-500">Descuento 20%</span>
                  <span className="text-green-500">-${ticket.descuento.toLocaleString('es-AR')}</span>
                </div>
              </>
            )}
            <div className="border-t border-gray-800 pt-3 flex justify-between">
              <span className="text-gray-500 font-semibold">Total</span>
              <span className="text-xl font-bold text-green-500">${ticket.monto_total.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pago</span>
              <span className="capitalize">
                {ticket.metodo_pago === 'digital' && subMetodoDigital
                  ? `Digital (${subMetodoDigital === 'mercadopago' ? 'Mercado Pago' : subMetodoDigital === 'transferencia' ? 'Transferencia' : 'QR'})`
                  : ticket.metodo_pago}
              </span>
            </div>
            {ticket.hora_fin && (
              <div className="flex justify-between">
                <span className="text-gray-500">Válido hasta</span>
                <span className="font-semibold">
                  {new Date(ticket.hora_fin).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onVolver}
            className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] text-white font-bold py-3 rounded-lg"
          >
            Volver a Mi Cuadra
          </button>
        </div>
      </div>
    );
  }

  const maxSteps = metodoPago === 'digital' ? 7 : 4;
  const currentStep = step;

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <button onClick={onVolver} className="text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Volver
        </button>
        <h2 className="text-2xl font-bold">Cobrar Estacionamiento</h2>
        <p className="text-sm text-gray-400 mt-1">Paso {currentStep} de {maxSteps}</p>
      </div>

      <div className="flex gap-1 mb-6">
        {Array.from({ length: maxSteps }, (_, i) => i + 1).map((s) => (
          <div key={s} className={`h-1 flex-1 rounded ${s <= currentStep ? 'bg-brand' : 'bg-gray-800'}`} />
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-[#0C1017] border border-gray-800 rounded-xl p-6 space-y-6">
        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Patente del Vehículo</label>
            <input
              type="text"
              value={patente}
              onChange={handlePatenteChange}
              placeholder="ABC123 o AB123CD"
              className="w-full bg-[#111622] border border-gray-800 rounded-lg px-4 py-4 text-2xl font-bold text-center tracking-widest text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand"
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-2">Formato: AAA123 (viejo) o AA123AA (nuevo)</p>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Tipo de Vehículo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTipoVehiculo('auto')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  tipoVehiculo === 'auto'
                    ? 'border-brand bg-brand/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <svg className="w-12 h-12 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 4h8m-4 4v4m-4-4h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
                <p className="font-bold">Auto</p>
                <p className="text-sm text-gray-500">$700/h</p>
              </button>
              <button
                onClick={() => setTipoVehiculo('moto')}
                className={`p-6 rounded-lg border-2 transition-all ${
                  tipoVehiculo === 'moto'
                    ? 'border-brand bg-brand/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="font-bold">Moto</p>
                <p className="text-sm text-gray-500">$300/h</p>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Cantidad de Horas</label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setHoras(Math.max(1, horas - 1))}
                className="w-12 h-12 rounded-lg bg-[#111622] border border-gray-800 flex items-center justify-center hover:border-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <div className="text-center">
                <p className="text-5xl font-bold">{horas}</p>
                <p className="text-sm text-gray-500">horas</p>
              </div>
              <button
                onClick={() => setHoras(Math.min(24, horas + 1))}
                className="w-12 h-12 rounded-lg bg-[#111622] border border-gray-800 flex items-center justify-center hover:border-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="mt-6 bg-[#111622] rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-3xl font-bold text-green-500">
                  ${calcularTotal().toLocaleString('es-AR')}
                </span>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Método de Pago</label>
            <div className="space-y-3">
              <button
                onClick={() => setMetodoPago('efectivo')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  metodoPago === 'efectivo'
                    ? 'border-brand bg-brand/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold">Efectivo</p>
                  <p className="text-sm text-gray-500">El conductor paga en mano</p>
                </div>
                <span className="ml-auto text-xl font-bold text-green-500 flex-shrink-0">
                  ${calcularTotal().toLocaleString('es-AR')}
                </span>
              </button>
              <button
                onClick={() => setMetodoPago('digital')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  metodoPago === 'digital'
                    ? 'border-brand bg-brand/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold">Digital (Conductor Paga)</p>
                  <p className="text-sm text-gray-500">20% descuento municipal</p>
                </div>
                <div className="ml-auto text-right flex-shrink-0">
                  <p className="text-xs text-gray-600 line-through">${calcularTotal().toLocaleString('es-AR')}</p>
                  <p className="text-xl font-bold text-green-500">
                    ${calcularTotalConDescuento().toLocaleString('es-AR')}
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 5 && metodoPago === 'digital' && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Opción de Pago Digital</label>
            <p className="text-xs text-green-500 mb-3">
              Total con 20% descuento: <span className="font-bold">${calcularTotalConDescuento().toLocaleString('es-AR')}</span>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setSubMetodoDigital('mercadopago')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  subMetodoDigital === 'mercadopago'
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold">Mercado Pago</p>
                  <p className="text-sm text-gray-500">Link de pago o botón en la app</p>
                </div>
              </button>

              <button
                onClick={() => setSubMetodoDigital('transferencia')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  subMetodoDigital === 'transferencia'
                    ? 'border-yellow-500 bg-yellow-500/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold">Transferencia Bancaria</p>
                  <p className="text-sm text-gray-500">Alias/CBU de la Municipalidad</p>
                </div>
              </button>

              <button
                onClick={() => setSubMetodoDigital('qr_interoperable')}
                className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-4 ${
                  subMetodoDigital === 'qr_interoperable'
                    ? 'border-brand bg-gray-500/10'
                    : 'border-gray-800 bg-[#111622] hover:border-gray-700'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-gray-500/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="font-bold">QR Interoperable</p>
                  <p className="text-sm text-gray-500">MP, Modo, Cuenta DNI, Ualá</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {step === 6 && subMetodoDigital === 'transferencia' && pagoData && (
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Datos para Transferencia</label>
            <div className="bg-[#111622] rounded-lg p-4 space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">Titular</span>
                <span className="text-sm font-semibold">{pagoData.datos_transferencia.titular}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-sm">CUIT</span>
                <span className="text-sm font-semibold">{pagoData.datos_transferencia.cuit}</span>
              </div>
              <div className="border-t border-gray-800 pt-3">
                <p className="text-gray-500 text-sm mb-1">Alias</p>
                <p className="text-lg font-bold text-brand font-mono">{pagoData.datos_transferencia.alias}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">CBU</p>
                <p className="text-sm font-bold font-mono">{pagoData.datos_transferencia.cbu}</p>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between">
                <span className="text-gray-500 text-sm">Monto</span>
                <span className="text-lg font-bold text-green-500">${pagoData.datos_transferencia.monto.toLocaleString('es-AR')}</span>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">Concepto</p>
                <p className="text-sm font-semibold font-mono">{pagoData.datos_transferencia.concepto}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Últimos 4 dígitos del comprobante
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={ultimos4}
                onChange={(e) => { setUltimos4(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                placeholder="0000"
                className="w-full bg-[#111622] border border-gray-800 rounded-lg px-4 py-4 text-2xl font-bold text-center tracking-widest text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {step === 7 && polling && (
          <div className="text-center py-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand/70 font-bold mb-4">
              PAGO DIGITAL
            </p>

            <div className="bg-white rounded-xl p-4 sm:p-5 inline-block mx-auto mb-4 shadow-lg max-w-[220px] sm:max-w-[280px]">
              <img
                src={`https://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=${encodeURIComponent(pagoData?.qr_data || 'https://www.salta.gob.ar/estacionamiento-medido-prueba')}`}
                alt="Código QR de pago"
                className="w-full h-auto"
              />
            </div>

            <p className="text-sm text-gray-300 mb-1">
              {subMetodoDigital === 'mercadopago'
                ? 'Escaneá con Mercado Pago para completar el cobro'
                : 'Escaneá con cualquier billetera virtual para pagar'}
            </p>
            <p className="text-xs text-gray-500 mb-1 px-4">
              El conductor puede escanear con su billetera virtual para completar el pago.
            </p>

            {pagoData?.monto && (
              <p className="text-xl font-bold text-green-500 mb-4">
                ${pagoData.monto.toLocaleString('es-AR')}
              </p>
            )}

            <div className="border-t border-gray-800/60 my-4 w-2/3 mx-auto"></div>

            <h3 className="text-lg font-bold mb-2">Esperando confirmación del pago...</h3>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
              <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
              Verificando cada 3 segundos activa...
            </div>
          </div>
        )}

        {step < 7 && (
          <button
            onClick={handleSiguiente}
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] disabled:from-gray-700 disabled:to-gray-700 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : step === 4 && metodoPago === 'efectivo' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirmar Cobro Efectivo
              </>
            ) : step === 5 ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Generar Pago
              </>
            ) : step === 6 && subMetodoDigital === 'transferencia' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Validar Transferencia
              </>
            ) : (
              <>
                Siguiente
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        )}

        {step === 7 && polling && (
          <button
            onClick={() => {
              if (pollingRef.current) clearInterval(pollingRef.current);
              setPolling(false);
              setStep(5);
            }}
            className="w-full bg-[#111622] border border-gray-800 text-gray-400 font-semibold py-3 rounded-lg hover:border-gray-700 transition-all"
          >
            Cancelar espera
          </button>
        )}
      </div>
    </div>
  );
}

function Historial() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const mountedRef = useRef(false);

  const loadData = useCallback(async () => {
    try {
      const result = await api.getHistorial();
      setData(result);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      loadData();
    }
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-center">
        <p className="text-red-400">{error}</p>
        <button onClick={loadData} className="mt-3 text-sm text-brand hover:underline">
          Reintentar
        </button>
      </div>
    );
  }

  if (!data) return null;

  const ticketsFiltrados = filtro === 'todos'
    ? data.tickets
    : data.tickets.filter((t) => t.metodo_pago === filtro);

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-[#0d1117] to-[#0C1017] border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Liquidación del Día</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#111622] rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Recaudado</p>
            <p className="text-2xl font-bold text-green-500">
              ${data.liquidacion.total_recaudado.toLocaleString('es-AR')}
            </p>
          </div>
          <div className="bg-[#111622] rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Tu Ganancia</p>
            <p className="text-2xl font-bold text-brand">
              ${data.liquidacion.monto_permisionario.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
        <div className="bg-[#111622] rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Efectivo recibido</span>
            <span className="font-semibold">${data.liquidacion.efectivo_recibido.toLocaleString('es-AR')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Digital recibido</span>
            <span className="font-semibold">${data.liquidacion.digital_recibido.toLocaleString('es-AR')}</span>
          </div>
          <div className="border-t border-gray-800 pt-2 flex justify-between text-sm">
            <span className="text-gray-400">Debes entregar a municipalidad</span>
            <span className="font-bold text-red-400">
              ${data.liquidacion.debe_entregar.toLocaleString('es-AR')}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#0C1017] border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Tickets del Día</h3>
          <span className="text-sm text-gray-500">{data.resumen.total_tickets} tickets</span>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filtro === 'todos'
                ? 'bg-brand text-white'
                : 'bg-[#111622] text-gray-400 border border-gray-800 hover:border-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('efectivo')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filtro === 'efectivo'
                ? 'bg-green-500 text-white'
                : 'bg-[#111622] text-gray-400 border border-gray-800 hover:border-gray-700'
            }`}
          >
            Efectivo
          </button>
          <button
            onClick={() => setFiltro('digital')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filtro === 'digital'
                ? 'bg-blue-500 text-white'
                : 'bg-[#111622] text-gray-400 border border-gray-800 hover:border-gray-700'
            }`}
          >
            Digital
          </button>
        </div>

        {ticketsFiltrados.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No hay tickets para mostrar</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {ticketsFiltrados.map((t) => (
              <div key={t.id} className="bg-[#111622] border border-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{t.patente}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                      t.metodo_pago === 'efectivo'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      {t.metodo_pago}
                    </span>
                  </div>
                  <span className="font-bold text-green-500">${t.monto_total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{t.tipo_vehiculo} · {t.horas}h</span>
                  <span>
                    {new Date(t.hora_inicio).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
