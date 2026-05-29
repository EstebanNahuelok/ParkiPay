import { useState, useCallback } from "react";
import { api } from "../services/api";
import PinInput from "../components/PinInput";
import { ButtonRegresar } from "../components/buttonRegresar";

const STEPS = {
  LEGAJO: "legajo",
  LOGIN: "login",
  REGISTER: "register",
};

export default function Auth() {
  const [step, setStep] = useState(STEPS.LEGAJO);
  const [legajo, setLegajo] = useState("");
  const [legajoInfo, setLegajoInfo] = useState(null);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [confirmPin, setConfirmPin] = useState(["", "", "", ""]);
  const [dniUltimos3, setDniUltimos3] = useState(["", "", ""]);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = useCallback(() => {
    setStep(STEPS.LEGAJO);
    setLegajo("");
    setLegajoInfo(null);
    setPin(["", "", "", ""]);
    setConfirmPin(["", "", "", ""]);
    setDniUltimos3(["", "", ""]);
    setShowPin(false);
    setError("");
    setSuccess("");
  }, []);

  const handleCheckLegajo = async (e) => {
    e.preventDefault();
    if (!legajo.trim()) {
      setError("Ingresa tu numero de legajo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.checkLegajo(legajo.trim());
      setLegajoInfo(data);
      setStep(data.isRegistered ? STEPS.LOGIN : STEPS.REGISTER);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const pinStr = pin.join("");
    if (pinStr.length < 4) {
      setError("Ingresa tu PIN completo");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.login(legajo, pinStr);
      localStorage.setItem("parkipay_token", data.token);
      localStorage.setItem("parkipay_user", JSON.stringify(data.usuario));
      setSuccess(`Bienvenido, ${data.usuario.nombre}`);
    } catch (err) {
      setError(err.message);
      setPin(["", "", "", ""]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const dniStr = dniUltimos3.join("");
    const pinStr = pin.join("");
    const confirmStr = confirmPin.join("");

    if (dniStr.length < 3) {
      setError("Ingresa los ultimos 3 digitos de tu DNI");
      return;
    }
    if (pinStr.length < 4) {
      setError("Crea un PIN de al menos 4 digitos");
      return;
    }
    if (pinStr !== confirmStr) {
      setError("Los PIN no coinciden");
      setConfirmPin(["", "", "", ""]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.register(legajo, pinStr, dniStr);
      localStorage.setItem("parkipay_token", data.token);
      localStorage.setItem("parkipay_user", JSON.stringify(data.usuario));
      setSuccess(`Cuenta creada exitosamente. Bienvenido, ${data.usuario.nombre}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-white font-sans flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-[#0C1017] rounded-2xl overflow-hidden border border-gray-800/80 flex flex-col lg:flex-row shadow-[0_0_80px_rgba(0,0,0,0.6)]">

        <div className="w-full lg:w-[45%] relative bg-gradient-to-br from-[#0d1117] via-[#0d1117] to-[#080B11] p-8 lg:p-14 flex flex-col justify-between min-h-[280px] lg:min-h-[700px] border-b lg:border-b-0 lg:border-r border-gray-800/80">
      <ButtonRegresar/>
          <div className="absolute top-0 right-16 bottom-0 w-40 opacity-30 flex justify-between pointer-events-none">
            <div className="w-[2px] bg-gradient-to-b from-transparent via-brand to-transparent shadow-[0_0_15px_rgba(29,158,117,0.7)]" />
            <div className="w-[1px] bg-gradient-to-b from-transparent via-pink-500 to-transparent shadow-[0_0_10px_rgba(29,158,117,0.5)]" />
            <div className="w-[3px] bg-gradient-to-b from-transparent via-brand to-transparent shadow-[0_0_20px_rgba(29,158,117,0.8)]" />
          </div>

          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gray-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shadow-lg shadow-brand/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <span className="text-2xl lg:text-3xl font-bold tracking-tight">SEM Salta</span>
              <p className="text-[10px] uppercase tracking-[0.15em] text-gray-500">Municipalidad de Salta</p>
            </div>
          </div>

          <div className="relative z-10 mt-8 lg:mt-0">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 leading-tight">
              Acceso Permisionario
            </h2>
            <p className="text-sm lg:text-base text-gray-400 leading-relaxed max-w-sm">
              Estacionamiento medido. Ingresa con tu legajo municipal y PIN de acceso rapido.
            </p>

            <div className="mt-8 space-y-3 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Acceso rapido con Legajo + PIN</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Proteccion anti fuerza bruta</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm text-gray-300">Sesion segura con token JWT</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex gap-2 mt-8 lg:mt-0">
            <span className="w-8 h-1.5 bg-brand rounded-full" />
            <span className="w-3 h-1.5 bg-gray-700 rounded-full" />
            <span className="w-3 h-1.5 bg-gray-700 rounded-full" />
          </div>
        </div>

        <div className="w-full lg:w-[55%] p-6 sm:p-8 lg:p-14 flex flex-col justify-center">
          {success ? (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Acceso concedido</h2>
                <p className="text-sm text-gray-400">{success}</p>
              </div>
              <button
                onClick={() => window.location.href = "/dashboard"}
                className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30 flex items-center justify-center gap-2"
              >
                Ir al Panel
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === STEPS.LEGAJO ? "bg-brand text-white" : "bg-brand/20 text-brand"}`}>
                  {step !== STEPS.LEGAJO ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : "1"}
                </div>
                <div className={`h-0.5 w-8 rounded ${step !== STEPS.LEGAJO ? "bg-brand" : "bg-gray-700"}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step !== STEPS.LEGAJO ? "bg-brand text-white" : "bg-[#111622] text-gray-500 border border-gray-800"}`}>
                  2
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-100">
                  {step === STEPS.LEGAJO && "Ingresar Legajo"}
                  {step === STEPS.LOGIN && "Iniciar Sesion"}
                  {step === STEPS.REGISTER && "Crear tu cuenta"}
                </h1>
                {step !== STEPS.LEGAJO && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Volver
                  </button>
                )}
              </div>

              <p className="text-sm text-gray-400 mb-8">
                {step === STEPS.LEGAJO && "Ingresa tu numero de legajo para continuar."}
                {step === STEPS.LOGIN && "Ingresa tu PIN para acceder al sistema."}
                {step === STEPS.REGISTER && "Primera vez? Verifica tu identidad y crea tu PIN de acceso."}
              </p>

              {error && (
                <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {step === STEPS.LEGAJO && (
                <form onSubmit={handleCheckLegajo} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Numero de Legajo Municipal
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={legajo}
                        onChange={(e) => { setLegajo(e.target.value.replace(/\D/g, "")); setError(""); }}
                        placeholder="Ej: 10001"
                        className="w-full bg-[#111622] border border-gray-800 rounded-lg pl-12 pr-4 py-3.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/30 transition-all"
                        autoFocus
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !legajo.trim()}
                    className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30 disabled:shadow-none flex items-center justify-center gap-2"
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
                    Continuar
                  </button>
                </form>
              )}

              {step === STEPS.LOGIN && (
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="bg-[#111622] border border-gray-800 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">
                        {legajoInfo?.nombre} {legajoInfo?.apellido}
                      </p>
                      <p className="text-xs text-gray-500">
                        Legajo {legajo} · {legajoInfo?.sector}
                      </p>
                    </div>
                  </div>

                  <PinInput
                    value={pin}
                    onChange={setPin}
                    showPin={showPin}
                    label="Ingresa tu PIN"
                    showToggle
                    onToggle={() => setShowPin(!showPin)}
                  />

                  <button
                    type="submit"
                    disabled={loading || pin.join("").length < 4}
                    className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    )}
                    Iniciar Sesion
                  </button>
                </form>
              )}

              {step === STEPS.REGISTER && (
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="bg-[#111622] border border-gray-800 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">
                        {legajoInfo?.nombre} {legajoInfo?.apellido}
                      </p>
                      <p className="text-xs text-gray-500">
                        Legajo {legajo} · {legajoInfo?.sector} · Primer ingreso
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Ultimos 3 digitos de tu DNI
                    </label>
                    <PinInput
                      value={dniUltimos3}
                      onChange={setDniUltimos3}
                      length={3}
                      showPin={false}
                      label=""
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Verificacion de identidad. Los ultimos 3 digitos del DNI registrado en RRHH.
                    </p>
                  </div>

                  <PinInput
                    value={pin}
                    onChange={setPin}
                    showPin={showPin}
                    label="Crear PIN (4 digitos)"
                    showToggle
                    onToggle={() => setShowPin(!showPin)}
                  />

                  <PinInput
                    value={confirmPin}
                    onChange={setConfirmPin}
                    showPin={showPin}
                    label="Confirmar PIN"
                  />

                  <button
                    type="submit"
                    disabled={loading || pin.join("").length < 4 || confirmPin.join("").length < 4 || dniUltimos3.join("").length < 3}
                    className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] hover:from-[#22c55e] hover:to-[#1D9E75] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-sm py-3.5 rounded-lg transition-all shadow-lg shadow-brand/20 hover:shadow-brand/30 disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    Crear Cuenta
                  </button>
                </form>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}
