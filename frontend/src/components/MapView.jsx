import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const SALTA_CENTER = [-24.7859, -65.4117];
const SALTA_BOUNDS = [
  [-24.795, -65.425],
  [-24.775, -65.400],
];

const createCarIcon = () => L.divIcon({
  html: `<div style="
    background: #22c55e;
    width: 36px;
    height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  ">
    <svg style="transform: rotate(45deg); width: 18px; height: 18px; color: white;" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
    </svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
  className: 'car-marker-icon',
});

const createLocationIcon = () => L.divIcon({
  html: `<div style="
    background: #3b82f6;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: 'location-marker-icon',
});

const STORAGE_KEY = 'parkipay_parked_cars';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatTimeArgentina(date) {
  return date.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Salta',
  }) + ' hs';
}

async function reverseGeocode(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`,
      { headers: { 'User-Agent': 'ParkiPay/1.0' } }
    );
    const data = await response.json();
    if (data.address) {
      const addr = data.address;
      const street = addr.road || addr.street || addr.pedestrian || addr.footway || '';
      const number = addr.house_number || '';
      const city = addr.city || addr.town || addr.village || 'Salta';
      const suburb = addr.suburb || addr.neighbourhood || '';
      
      let address = '';
      if (street && number) address = `${street} ${number}`;
      else if (street) address = street;
      else if (suburb) address = suburb;
      else address = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      
      const parts = [address];
      if (city && city !== 'Salta') parts.push(city);
      parts.push('Salta');
      return parts.join(', ');
    }
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

function MapClickHandler({ onMapClick, enabled }) {
  useMapEvents({
    click: (e) => {
      if (enabled) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

function ParkedCarMarker({ car, onRemove, onCenter }) {
  const icon = useRef(createCarIcon());
  
  return (
    <Marker
      position={[car.lat, car.lng]}
      icon={icon.current}
      eventHandlers={{
        click: () => {},
      }}
    >
      <Popup className="custom-popup">
        <div className="bg-[#0C1017] text-white p-3 rounded-lg min-w-[200px]">
          <p className="font-bold text-sm mb-1">{car.address}</p>
          <p className="text-xs text-gray-400 mb-2">
            Estacionado a las {formatTimeArgentina(new Date(car.timestamp))}
          </p>
          {car.note && (
            <p className="text-xs bg-[#111622] p-2 rounded mb-2 italic">"{car.note}"</p>
          )}
          {car.photo && (
            <img 
              src={car.photo} 
              alt="Auto estacionado" 
              className="w-full h-24 object-cover rounded mb-2"
            />
          )}
          <button
            onClick={() => onRemove(car.id)}
            className="w-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold py-2 rounded hover:bg-red-500/30 transition-colors"
          >
            Retirar Auto
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

function Sidebar({ cars, onCenterMap, onRemoveCar }) {
  return (
    <div className="absolute top-4 left-4 bottom-4 w-72 bg-[#0C1017]/95 backdrop-blur-sm border border-gray-800 rounded-xl z-[1000] flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Autos Estacionados
        </h2>
        <p className="text-sm text-gray-500 mt-1">{cars.length} vehículo{cars.length !== 1 ? 's' : ''} registrado{cars.length !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {cars.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 text-sm">No hay autos estacionados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-[#111622] border border-gray-800 rounded-lg p-3 hover:border-brand/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{car.address}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimeArgentina(new Date(car.timestamp))}
                    </p>
                    {car.note && (
                      <p className="text-xs text-gray-400 mt-1 italic truncate">"{car.note}"</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onCenterMap(car.lat, car.lng)}
                      className="p-1.5 bg-brand/10 border border-brand/20 rounded hover:bg-brand/20 transition-colors"
                      title="Centrar en mapa"
                    >
                      <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemoveCar(car.id)}
                      className="p-1.5 bg-red-500/10 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                      title="Retirar auto"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={() => onCenterMap(SALTA_CENTER[0], SALTA_CENTER[1])}
          className="w-full bg-[#111622] border border-gray-800 text-gray-400 text-sm font-semibold py-2 rounded-lg hover:border-brand/50 hover:text-brand transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Plaza 9 de Julio
        </button>
      </div>
    </div>
  );
}

function AddCarModal({ isOpen, onClose, onSave, selectedLocation, onLocationSelect }) {
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [address, setAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (selectedLocation && isOpen) {
      setLoadingAddress(true);
      reverseGeocode(selectedLocation.lat, selectedLocation.lng).then((addr) => {
        setAddress(addr);
        setLoadingAddress(false);
      });
    }
  }, [selectedLocation, isOpen]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedLocation) return;
    onSave({
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
      address,
      note,
      photo: photoPreview,
    });
    setNote('');
    setPhoto(null);
    setPhotoPreview(null);
    onClose();
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocationSelect({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        alert('No se pudo obtener tu ubicación. Verifica los permisos de geolocalización.');
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div className="bg-[#0C1017] border border-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-bold">Registrar Auto</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <button
            onClick={handleUseGPS}
            className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold py-3 rounded-lg hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Usar mi ubicación GPS
          </button>
          
          <div className="text-center text-gray-500 text-sm">o</div>
          
          <div className="bg-[#111622] border border-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-400 mb-2">
              {selectedLocation 
                ? `Ubicación seleccionada: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`
                : 'Hacé click en el mapa para marcar donde dejaste el auto'}
            </p>
            {loadingAddress && (
              <p className="text-sm text-brand">Obteniendo dirección...</p>
            )}
            {address && !loadingAddress && (
              <p className="text-sm font-semibold text-green-400 mt-2">{address}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nota (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Frente al Mercado San Miguel"
              className="w-full bg-[#111622] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand"
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Foto (opcional)</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-[#111622] border border-gray-800 rounded-lg py-3 flex items-center justify-center gap-2 hover:border-brand/50 transition-colors"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
              ) : (
                <>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-500">Tomar foto</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleSave}
            disabled={!selectedLocation}
            className="w-full bg-gradient-to-r from-[#1D9E75] to-[#15803d] text-white font-bold py-3 rounded-lg hover:from-[#22c55e] hover:to-[#1D9E75] disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Guardar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MapView() {
  const [cars, setCars] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCars(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const saveCars = useCallback((newCars) => {
    setCars(newCars);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newCars));
  }, []);

  const handleMapClick = useCallback((latlng) => {
    if (isAddingMode) {
      setClickedLocation(latlng);
      setShowAddModal(true);
      setIsAddingMode(false);
    }
  }, [isAddingMode]);

  const handleAddCar = (carData) => {
    const newCar = {
      id: generateId(),
      lat: carData.lat,
      lng: carData.lng,
      address: carData.address,
      note: carData.note || '',
      photo: carData.photo || null,
      timestamp: new Date().toISOString(),
    };
    saveCars([...cars, newCar]);
    setClickedLocation(null);
  };

  const handleRemoveCar = (id) => {
    if (confirm('¿Retirar este auto del mapa?')) {
      saveCars(cars.filter((c) => c.id !== id));
    }
  };

  const handleCenterMap = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 17, { animate: true });
    }
  };

  const handleStartAddMode = () => {
    setIsAddingMode(true);
    setClickedLocation(null);
    setShowAddModal(false);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setIsAddingMode(false);
    setClickedLocation(null);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={SALTA_CENTER}
        zoom={16}
        className="w-full h-full z-0"
        bounds={SALTA_BOUNDS}
        maxBounds={SALTA_BOUNDS}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          language="es"
        />
        
        <MapClickHandler onMapClick={handleMapClick} enabled={isAddingMode} />
        
        {cars.map((car) => (
          <ParkedCarMarker
            key={car.id}
            car={car}
            onRemove={handleRemoveCar}
            onCenter={handleCenterMap}
          />
        ))}
        
        {clickedLocation && !showAddModal && (
          <Marker
            position={[clickedLocation.lat, clickedLocation.lng]}
            icon={createLocationIcon()}
          />
        )}
      </MapContainer>

      <Sidebar
        cars={cars}
        onCenterMap={handleCenterMap}
        onRemoveCar={handleRemoveCar}
      />

      {isAddingMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          Hacé click en el mapa para marcar
        </div>
      )}

      <button
        onClick={handleStartAddMode}
        className="absolute bottom-24 right-4 w-16 h-16 bg-gradient-to-br from-[#1D9E75] to-[#15803d] rounded-full shadow-lg shadow-brand/30 flex items-center justify-center hover:scale-110 transition-transform z-[1000]"
        title="Registrar Auto"
      >
        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      </button>

      {isAddingMode && (
        <button
          onClick={() => setIsAddingMode(false)}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-800/90 border border-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors z-[1000]"
          title="Cancelar"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <AddCarModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onSave={handleAddCar}
        selectedLocation={clickedLocation}
        onLocationSelect={setClickedLocation}
      />

      <style>{`
        .leaflet-container {
          background: #080B11;
        }
        .car-marker-icon {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
        .leaflet-control-attribution {
          background: rgba(12, 16, 23, 0.8) !important;
          color: #6b7280 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a {
          color: #9ca3af !important;
        }
        .leaflet-control-zoom {
          border: none !important;
        }
        .leaflet-control-zoom a {
          background: #0C1017 !important;
          color: white !important;
          border: 1px solid #374151 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #111622 !important;
        }
      `}</style>
    </div>
  );
}
