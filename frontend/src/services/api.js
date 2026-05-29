import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('parkipay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('parkipay_token');
      localStorage.removeItem('parkipay_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    const message = error.response?.data?.error || error.message || 'Error de conexion';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  checkLegajo(numero_legajo) {
    return apiClient.post('/permisionario/check-legajo', { numero_legajo });
  },

  login(numero_legajo, pin) {
    return apiClient.post('/permisionario/login', { numero_legajo, pin });
  },

  register(numero_legajo, pin, dni_ultimos3) {
    return apiClient.post('/permisionario/register', { numero_legajo, pin, dni_ultimos3 });
  },

  getCuadra() {
    return apiClient.get('/permisionario/cuadra');
  },

  emitirTicket(data) {
    return apiClient.post('/permisionario/ticket/emitir', data);
  },

  getHistorial() {
    return apiClient.get('/permisionario/historial');
  },

  generarPreferenciaMP(ticket_id) {
    return apiClient.post('/pagos/generar-preferencia', { ticket_id });
  },

  generarDatosTransferencia(ticket_id) {
    return apiClient.post('/pagos/generar-transferencia', { ticket_id });
  },

  generarQRInteroperable(ticket_id) {
    return apiClient.post('/pagos/generar-qr', { ticket_id });
  },

  validarTransferencia(ticket_id, ultimos4) {
    return apiClient.post('/pagos/validar-transferencia', { ticket_id, ultimos4 });
  },

  verificarEstadoPago(ticket_id) {
    return apiClient.get('/pagos/verificar-estado', { params: { ticket_id } });
  },
};

export default apiClient;
