import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export default function SpaceInstruction() {
  const mode = useStore(state => state.mode)
  const spaceProgress = useStore(state => state.spaceProgress)

  // Visible only in SPACE mode and NOT near the footer
  const isVisible = mode === 'SPACE' && spaceProgress < 0.85

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            position: 'fixed',
            bottom: '4rem', // Above bottom edge
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 10,
            textAlign: 'center',
            width: '100%'
          }}
        >
          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{
              fontFamily: "'SF Mono', monospace",
              fontSize: '0.7rem',
              color: '#ffffff',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(136, 204, 255, 0.4)',
              margin: 0
            }}
          >
            Click Planet to Enter
          </motion.p>
          
          {/* Decorative small line under text */}
          <motion.div
            animate={{ width: ['0px', '40px', '0px'], opacity: [0, 0.5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            style={{
                height: '1px',
                background: 'rgba(136, 204, 255, 0.3)',
                margin: '0.5rem auto 0'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
