import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

// HUD Corner Element
const Corner = ({ top, bottom, left, right }) => (
  <div style={{
    position: 'absolute',
    top: top ? 0 : undefined,
    bottom: bottom ? 0 : undefined,
    left: left ? 0 : undefined,
    right: right ? 0 : undefined,
    width: '20px',
    height: '20px',
    borderTop: top ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    borderBottom: bottom ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    borderLeft: left ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    borderRight: right ? '2px solid rgba(136, 204, 255, 0.5)' : 'none',
    opacity: 0.8
  }} />
)

import useMobile from '../hooks/useMobile' // [NEW]

export default function AboutContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const isMobile = useMobile() // [NEW]

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'ABOUT'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: isMobile ? 'flex-end' : 'center', // [FIX] Bottom align on mobile
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
            background: isMobile 
              ? 'rgba(0,0,0,0.3)' 
              : 'radial-gradient(circle at center, rgba(136, 204, 255, 0.05) 0%, transparent 60%)'
          }}
        >
          {/* Main Content Container */}
          <motion.div
            initial={{ y: isMobile ? 100 : 0, scale: isMobile ? 1 : 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: isMobile ? 100 : 0, scale: isMobile ? 1 : 0.95, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: isMobile ? '100%' : '90%',
              maxWidth: '700px',
              height: isMobile ? 'auto' : 'auto',
              maxHeight: isMobile ? '80vh' : 'none',
              background: isMobile ? 'rgba(10, 20, 40, 0.92)' : 'transparent', // [FIX] Darker background on mobile
              backdropFilter: isMobile ? 'blur(20px)' : 'none',
              borderTop: isMobile ? '1px solid rgba(136, 204, 255, 0.2)' : 'none',
              borderRadius: isMobile ? '30px 30px 0 0' : '0',
              padding: isMobile ? '5rem 1rem 4rem' : '0',
              position: 'relative',
              textAlign: 'center',
              pointerEvents: 'auto',
              overflowY: isMobile ? 'auto' : 'visible'
            }}
          >
            {/* Mobile Handle */}
            {isMobile && (
              <div style={{
                width: '40px',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '10px',
                margin: '0 auto 2rem'
              }} />
            )}
            {/* Corners */}
            <Corner top left />
            <Corner top right />
            <Corner bottom left />
            <Corner bottom right />

            {/* Tech Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: '0.85rem',
                color: '#88ccff',
                letterSpacing: '0.3em',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                textShadow: '0 0 10px rgba(136, 204, 255, 0.5)'
              }}
            >
               <span style={{ width: '60px', height: '1px', background: 'rgba(136, 204, 255, 0.6)', boxShadow: '0 0 5px rgba(136, 204, 255, 0.5)' }} />
               IDENTITY :: TOSHAN
               <span style={{ width: '60px', height: '1px', background: 'rgba(136, 204, 255, 0.6)', boxShadow: '0 0 5px rgba(136, 204, 255, 0.5)' }} />
            </motion.div>

            {/* BIO */}
            <div style={{ padding: '0 1rem' }}>
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 200,
                  color: '#ffffff',
                  marginBottom: '1.5rem',
                  letterSpacing: '-0.02em',
                  fontFamily: "'Outfit', sans-serif"
                }}
              >
                Building future <br />
                <span style={{ 
                  background: 'linear-gradient(90deg, #88ccff, #ffffff)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 600 
                }}>
                  tech experiences
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                style={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'rgba(255, 255, 255, 0.8)',
                  maxWidth: '550px',
                  margin: '0 auto 2.5rem',
                  fontFamily: "'SF Pro Text', sans-serif"
                }}
              >
                Hi everyone! I’m <b style={{ color: '#fff' }}>TOSHAN</b>. I’m an engineering student at Chitkara University, passionate about crafting digital systems that feel alive.
              </motion.p>
            </div>

            {/* HOBBIES - Floating Modules */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              {[
                "Solving problems 🧠",
                "Design & Motion ✨",
                "Music & Code 🎧"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + (i * 0.1), duration: 0.6 }}
                  whileHover={{ scale: 1.05, borderColor: 'rgba(136, 204, 255, 0.6)', boxShadow: '0 0 20px rgba(136, 204, 255, 0.2)' }}
                  style={{
                    padding: '0.6rem 1.2rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(136, 204, 255, 0.2)',
                    background: 'rgba(136, 204, 255, 0.05)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.9rem',
                    backdropFilter: 'blur(10px)',
                    cursor: 'default',
                    fontFamily: "'SF Pro Text', sans-serif"
                  }}
                >
                  {item}
                </motion.div>
              ))}
            </div>

            {/* QUOTE */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1.2, duration: 1 }}
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1.5rem',
                width: '100%',
                margin: '0 auto'
              }}
            >
              <p style={{
                fontFamily: "'SF Mono', monospace",
                fontSize: '1rem',
                color: '#88ccff',
                letterSpacing: '0.15em',
                fontStyle: 'italic',
                whiteSpace: 'nowrap'
              }}>
                "WORK HARD, STUDY HARD"
              </p>
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
