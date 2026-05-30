import { createContext, useContext, useState } from 'react'

const ParkingContext = createContext(null)

export function ParkingProvider({ children }) {
  const [parkingData, setParkingData] = useState({
    patente: '',
    vehiculo: 'auto',
    horas: 1,
    cuadra: '',
    zona: null,
    zonaId: null,
    metodoPago: 'transferencia',
    sesionId: null,
    parkingSpot: null,
  })

  const updateParkingData = (updates) => {
    setParkingData(prev => ({ ...prev, ...updates }))
  }

  const TARIFA = { auto: 1, moto: 300 }
  const DESCUENTO = 0.20

  const getTotal = () => {
    const base = TARIFA[parkingData.vehiculo] * parkingData.horas
    return base
  }

  const getTotalConDescuento = () => {
    return Math.round(getTotal() * (1 - DESCUENTO))
  }

  return (
    <ParkingContext.Provider value={{
      parkingData,
      updateParkingData,
      getTotal,
      getTotalConDescuento,
      TARIFA,
      DESCUENTO,
    }}>
      {children}
    </ParkingContext.Provider>
  )
}

export function useParking() {
  const ctx = useContext(ParkingContext)
  if (!ctx) throw new Error('useParking must be used within ParkingProvider')
  return ctx
}
