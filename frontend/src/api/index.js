const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export async function crearSesionEstacionamiento(datos) {
  const res = await fetch(`${API_URL}/api/estacionamiento-sesion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(datos),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(err || `Error ${res.status}`)
  }
  return res.json()
}

export const crearPreferenciaMercadoPago = async ({ sesionId, amount, patente }) => {
  const res = await fetch(`${API_URL}/api/pagos/preference`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sesionId, amount, patente }),
  })
  if (!res.ok) throw new Error('Error al crear preferencia')
  return res.json()
}

export default API_URL
