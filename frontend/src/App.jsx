import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ParkingProvider } from './context/ParkingContext'
import Escanear from './screens/Escanear'
import Confirmar from './screens/Confirmar'
import Pagar from './screens/Pagar'
import Ticket from './screens/Ticket'

export default function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Escanear />} />
            <Route path="/confirmar" element={<Confirmar />} />
            <Route path="/pagar" element={<Pagar />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ParkingProvider>
  )
}
