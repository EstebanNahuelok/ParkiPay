import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import { useParking } from '../context/ParkingContext'
import {ButtonRegresar} from '../components/ButtonRegresar'
import BottomNav from '../components/BottomNav'

export default function Escanear() {
  const navigate = useNavigate()
  const { updateParkingData } = useParking()
  const scannerRef = useRef(null)
  const scannerStartedRef = useRef(false)
  const [showModal, setShowModal] = useState(false)
  const [patenteInput, setPatenteInput] = useState('')
  const [patenteError, setPatenteError] = useState(false)
  const [scanError, setScanError] = useState(false)
  const [qrError, setQrError] = useState(null)

  const formatZona = (z) =>
    z.toLowerCase().split('-').map((w, i) => (w === 'y' && i > 0) ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  useEffect(() => {
    const qr = new Html5Qrcode('qr-reader')
    scannerRef.current = qr

    const startScanner = async () => {
      try {
        await qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (decodedText.startsWith('SEM-SALTA')) {
              const parts = decodedText.split('|')
              const zona = parts[1].split(':')[1].toLowerCase()
              const zonaId = parts[2].split(':')[1].toLowerCase()
              const cuadra = formatZona(zona)
              scannerStartedRef.current = false
              qr.stop().catch(() => {})
              updateParkingData({ zona, zonaId, cuadra, patente: '' })
              navigate('/confirmar')
            } else {
              setQrError('QR inválido. Escaneá el código de la cuadra.')
            }
          },
          () => {}
        )
        scannerStartedRef.current = true
      } catch {
        setScanError(true)
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && scannerStartedRef.current) {
        scannerStartedRef.current = false
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleManualSubmit = () => {
    if (!patenteInput.trim()) {
      setPatenteError(true)
      return
    }
    setPatenteError(false)
    if (scannerRef.current && scannerStartedRef.current) {
      scannerStartedRef.current = false
      scannerRef.current.stop().catch(() => {})
    }
    updateParkingData({ patente: patenteInput.trim().toUpperCase(), cuadra: 'Alberdi y Mitre' })
    navigate('/confirmar')
  }

  return (
    <>
    <div className="bg-salta" />
    <div className="bg-salta-overlay" />
    <div className="flex flex-col" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      {/* Header */}
      <ButtonRegresar />
      <div
        style={{ backgroundColor: '#0d1117', borderBottom: '1px solid #2a3040' }}
        className="flex items-center justify-between px-4 py-3"
      >
        <div style={{ width: 40 }} />
        <span style={{ color: '#1D9E75', fontWeight: '600', fontSize: 17 }}>SEM Salta</span>
        <button style={{ color: '#9ca3af' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
      </div>

      {/* Scanner area — full remaining height */}
      <div className="flex-1 flex flex-col items-center justify-center relative" style={{ backgroundColor: '#0d1117' }}>
        {/* Blurred background overlay to mimic camera blur */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, #1a2535 0%, #0a0e14 100%)' }} />

        {/* QR scanner title */}
        <p
          className="relative z-10 mb-6"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, letterSpacing: 1 }}
        >
          Escanear QR
        </p>

        {/* Scanner frame */}
        <div className="relative z-10" style={{ position: 'relative' }}>
          {/* Actual scanner div — hidden visually, functional */}
          <div
            id="qr-reader"
            style={{
              width: 240,
              height: 240,
              overflow: 'hidden',
              borderRadius: 14,
              opacity: scanError ? 0 : 1,
            }}
          />

          {/* Green corner frame overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ borderRadius: 12 }}
          >
            {/* Top-left corner */}
            <div className="absolute top-0 left-0" style={{ width: 40, height: 40 }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 3, backgroundColor: '#1D9E75', borderRadius: '3px 0 0 0' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: 40, backgroundColor: '#1D9E75', borderRadius: '3px 0 0 0' }} />
            </div>
            {/* Top-right corner */}
            <div className="absolute top-0 right-0" style={{ width: 40, height: 40 }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 40, height: 3, backgroundColor: '#1D9E75', borderRadius: '0 3px 0 0' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: 3, height: 40, backgroundColor: '#1D9E75', borderRadius: '0 3px 0 0' }} />
            </div>
            {/* Bottom-left corner */}
            <div className="absolute bottom-0 left-0" style={{ width: 40, height: 40 }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 40, height: 3, backgroundColor: '#1D9E75', borderRadius: '0 0 0 3px' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: 3, height: 40, backgroundColor: '#1D9E75', borderRadius: '0 0 0 3px' }} />
            </div>
            {/* Bottom-right corner */}
            <div className="absolute bottom-0 right-0" style={{ width: 40, height: 40 }}>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 40, height: 3, backgroundColor: '#1D9E75', borderRadius: '0 0 3px 0' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 3, height: 40, backgroundColor: '#1D9E75', borderRadius: '0 0 3px 0' }} />
            </div>
          </div>
        </div>

        <p
          className="relative z-10 mt-6 text-center px-8"
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}
        >
          Apuntá la cámara al QR de la cuadra
        </p>
        {qrError && (
          <p
            className="relative z-10 mt-3 text-center px-8"
            style={{ color: '#ef4444', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {qrError}
          </p>
        )}
      </div>

      {/* Bottom sheet with manual entry button */}
      <div
        style={{
          backgroundColor: '#0d1117',
          borderTop: '1px solid #2a3040',
          padding: '12px 20px calc(28px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center mb-3">
          <div style={{ width: 40, height: 4, backgroundColor: '#2a3040', borderRadius: 99 }} />
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 14,
            border: '1px solid #1D9E75',
            backgroundColor: 'transparent',
            color: '#1D9E75',
            fontSize: 15,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M8 17h8" />
          </svg>
          Ingresar patente manualmente
        </button>
        <button
          onClick={() => navigate('/mapa')}
          style={{
            width: '100%',
            marginTop: 10,
            padding: '14px',
            borderRadius: 14,
            border: '1px solid #2a3040',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            fontSize: 15,
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
          Ver mapa de zonas
        </button>
      </div>

      <BottomNav active="escanear" />

      {/* Manual entry modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-end justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 50 }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 430,
              backgroundColor: '#1a1f2e',
              borderRadius: '20px 20px 0 0',
              padding: '24px 20px calc(40px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: '700', color: '#fff' }}>
                Ingresar patente
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <input
              type="text"
              value={patenteInput}
              onChange={(e) => {
                setPatenteInput(e.target.value.toUpperCase())
                if (patenteError) setPatenteError(false)
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder="Ej: AB123CD"
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: 10,
                border: patenteError ? '1px solid #ef4444' : '1px solid #2a3040',
                backgroundColor: '#0d1117',
                color: '#fff',
                fontSize: 18,
                fontFamily: 'monospace',
                fontWeight: '700',
                letterSpacing: 3,
                outline: 'none',
                marginBottom: patenteError ? 6 : 16,
                transition: 'border-color 0.15s',
              }}
            />
            {patenteError && (
              <p style={{ color: '#ef4444', fontSize: 13, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                Ingresá la patente para continuar
              </p>
            )}
            <button
              onClick={handleManualSubmit}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 14,
                border: 'none',
                backgroundColor: '#1D9E75',
                color: '#fff',
                fontSize: 16,
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}

