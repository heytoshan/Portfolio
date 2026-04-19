import React, { useState, useEffect, useMemo } from 'react'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'

const DATA_LOGS = [
  "BTL.INIT.v4.0.2",
  "HYPER_DRIVE_SYNC: OK",
  "CORE_TEMP: 32.4K",
  "DATA_PULSE: ACTIVE",
  "NEUTRON_STABILIZED",
  "BUFFER_FLOW: STABLE",
  "HEX_ARRAY_LOADED"
];

function DataStream({ position }) {
  const [log, setLog] = useState(DATA_LOGS[0]);
  const [hex, setHex] = useState('0x000000');

  useEffect(() => {
    const interval = setInterval(() => {
      setLog(DATA_LOGS[Math.floor(Math.random() * DATA_LOGS.length)]);
      setHex(`0x${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}`);
    }, 150 + Math.random() * 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        ...position,
        fontFamily: 'monospace',
        fontSize: '0.65rem',
        color: 'rgba(136, 204, 255, 0.4)',
        textAlign: position.right ? 'right' : 'left',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      <div style={{ color: '#88ccff', opacity: 0.8 }}>{log}</div>
      <div>{hex}</div>
    </motion.div>
  );
}

export default function Loader() {
  const { progress } = useProgress()
  const [show, setShow] = useState(true)
  const [text, setText] = useState('')
  const fullText = "INITIALIZING_SYSTEM_CORE_v2.1"

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setShow(false), 600)
    }
  }, [progress])

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1))
      i++
      if (i > fullText.length) clearInterval(interval)
    }, 40)
    return () => clearInterval(interval)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#020408',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            overflow: 'hidden'
          }}
        >
          {/* Tech Grid Background */}
          <motion.div 
            animate={{ 
              backgroundPosition: ['0px 0px', '40px 40px'],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(136, 204, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              zIndex: 1
            }}
          />

          {/* Data Streams */}
          <DataStream position={{ top: '40px', left: '40px' }} />
          <DataStream position={{ top: '40px', right: '40px' }} />
          <DataStream position={{ bottom: '40px', left: '40px' }} />
          <DataStream position={{ bottom: '40px', right: '40px' }} />

          {/* Complex Diagnostic Spinner */}
          <div style={{ position: 'relative', marginBottom: '3rem', zIndex: 10 }}>
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{
                width: '120px',
                height: '120px',
                border: '1px dashed rgba(136, 204, 255, 0.2)',
                borderTop: '2px solid rgba(136, 204, 255, 0.8)',
                borderRadius: '50%',
              }}
            />
            {/* Middle Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                width: '100px',
                height: '100px',
                border: '1px solid rgba(136, 204, 255, 0.1)',
                borderLeft: '2px solid #88ccff',
                borderRadius: '50%',
              }}
            />
            {/* Inner Core */}
            <motion.div
              animate={{ 
                scale: [0.9, 1.1, 0.9],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: 'absolute',
                top: '40px',
                left: '40px',
                width: '40px',
                height: '40px',
                background: 'radial-gradient(circle, #88ccff 0%, transparent 70%)',
                borderRadius: '50%',
                boxShadow: '0 0 20px #88ccff'
              }}
            />
          </div>

          {/* Status Content */}
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            <div style={{ 
              color: '#88ccff',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 'clamp(0.7rem, 2vw, 0.9rem)', 
              letterSpacing: '0.4em',
              marginBottom: '1.5rem',
              height: '20px',
              textShadow: '0 0 10px rgba(136, 204, 255, 0.5)'
            }}>
              {text}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >_</motion.span>
            </div>

            {/* Enhanced Progress Bar */}
            <div style={{
              width: 'min(320px, 85vw)',
              height: '4px',
              background: 'rgba(136, 204, 255, 0.05)',
              border: '1px solid rgba(136, 204, 255, 0.2)',
              borderRadius: '4px',
              position: 'relative',
              padding: '2px',
              overflow: 'hidden'
            }}>
              {/* Progress Fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #4488ff, #88ccff)',
                  borderRadius: '2px',
                  boxShadow: '0 0 15px rgba(136, 204, 255, 0.4)',
                  position: 'relative'
                }}
              >
                {/* Scanner Beam */}
                <motion.div
                  animate={{ left: ['-10%', '110%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    width: '30px',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, #fff, transparent)',
                    opacity: 0.5
                  }}
                />
              </motion.div>
            </div>

            {/* Percentage & Logs */}
            <div style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              width: 'min(320px, 85vw)',
              fontSize: '0.65rem',
              color: 'rgba(136, 204, 255, 0.6)',
              fontFamily: 'monospace',
              letterSpacing: '0.1em'
            }}>
              <span>STATUS: {progress === 100 ? 'SUCCESS' : 'UPLOADING_CORE'}</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
