import React, { useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

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

export const MapaEnVivoAdmin = () => {
  const mapRef = useRef()

  const irAZona = (coords) => {
    if (mapRef.current) {
      mapRef.current.setView(coords, 15, {
        animate: true
      })
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        height: '100vh',
        background: '#051424'
      }}
    >

      {/* MAPA */}

      <div style={{ position: 'relative' }}>
        <MapContainer
          center={[-24.7821, -65.4232]}
          zoom={14}
          style={{
            height: '100%',
            width: '100%'
          }}
          whenCreated={(map) => {
            mapRef.current = map
          }}
        >
          <TileLayer
            attribution="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {zonas.map((zona) => (
            <CircleMarker
              key={zona.id}
              center={zona.coords}
              radius={Math.max(10, zona.ocupacion / 6)}
              pathOptions={{
                color: zona.color,
                fillColor: zona.color,
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Popup>
                <strong>{zona.nombre}</strong>

                <p>Autos: {zona.autos}</p>

                <p>Permisionarios: {zona.permisionarios}</p>

                <p>Ocupación: {zona.ocupacion}%</p>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* PANEL DERECHO */}

      <aside
        style={{
          background: '#122131',
          borderLeft: '1px solid rgba(255,255,255,.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >

        <div
          style={{
            padding: 24,
            borderBottom: '1px solid rgba(255,255,255,.08)'
          }}
        >
          <h2
            style={{
              margin: 0,
              color: '#d4e4fa'
            }}
          >
            Zonas activas
          </h2>

          <span
            style={{
              color: '#bccac1',
              fontSize: 14
            }}
          >
            Monitoreo en tiempo real
          </span>
        </div>

        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: 16
          }}
        >

          {zonas.map((zona) => (
            <div
              key={zona.id}
              onClick={() => irAZona(zona.coords)}
              style={{
                cursor: 'pointer',
                background: '#1c2b3c',
                padding: 16,
                borderRadius: 12,
                marginBottom: 14,
                border: '1px solid rgba(255,255,255,.05)'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <strong style={{ color: '#d4e4fa' }}>
                  {zona.nombre}
                </strong>

                <span
                  style={{
                    color: zona.color,
                    fontWeight: 700
                  }}
                >
                  {zona.ocupacion}%
                </span>
              </div>

              <div
                style={{
                  color: '#bccac1',
                  marginTop: 10,
                  fontSize: 14
                }}
              >
                🚗 {zona.autos} autos
              </div>

              <div
                style={{
                  color: '#bccac1',
                  marginTop: 4,
                  fontSize: 14
                }}
              >
                👤 {zona.permisionarios} permisionarios
              </div>

              <div
                style={{
                  marginTop: 14,
                  height: 6,
                  background: '#0b1828',
                  borderRadius: 20,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${zona.ocupacion}%`,
                    height: '100%',
                    background: zona.color
                  }}
                />
              </div>

            </div>
          ))}

        </div>

      </aside>

    </div>
  )
}