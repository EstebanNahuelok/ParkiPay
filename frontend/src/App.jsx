import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ParkingProvider } from './context/ParkingContext'
import Escanear from './screens/Escanear'
import Confirmar from './screens/Confirmar'
import Pagar from './screens/Pagar'
import Ticket from './screens/Ticket'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <Routes>
          {/* Flujo conductor */}
          <Route path="/" element={<div className="app-container"><Escanear /></div>} />
          <Route path="/confirmar" element={<div className="app-container"><Confirmar /></div>} />
          <Route path="/pagar" element={<div className="app-container"><Pagar /></div>} />
          <Route path="/ticket" element={<div className="app-container"><Ticket /></div>} />

          {/* Flujo permisionario */}
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ParkingProvider>
  )
}
