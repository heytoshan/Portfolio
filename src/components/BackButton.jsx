import React from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'

const BackButton = () => {
  const exitPlanet = useStore(state => state.exitPlanet)
  
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      onClick={(e) => {
        e.stopPropagation()
        exitPlanet()
      }}
      whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 50,
        outline: 'none',
        pointerEvents: 'auto' // ensure it captures clicks
      }}
      aria-label="Back to Orbit"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </motion.button>
  )
}

export default BackButton
