import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import useMobile from '../hooks/useMobile'

// --- HUD SUB-COMPONENTS ---

// 1. Diagnostic Feed Module
const DiagnosticLogs = ({ isMobile }) => {
  const [logs, setLogs] = useState([])
  
  useEffect(() => {
    const messages = [
      'SYSTEM_INIT', 'CORE: ACTIVE', 'COORD_LOCKED',
      'GRAV_OK', 'VIS_LOG', 'DATA_SYNC', 'THRUST_RDY',
      'ORBIT: 0.94', 'MEM_OPT', 'AES-256'
    ]
    
    const interval = setInterval(() => {
      const timestamp = new Date().toLocaleTimeString('en-GB', { hour12: false, minute: '2-digit', second: '2-digit' })
      const hex = Math.floor(Math.random() * 0xFFF).toString(16).toUpperCase().padStart(3, '0')
      const msg = messages[Math.floor(Math.random() * messages.length)]
      const newLog = `[${timestamp}] ${hex}::${msg}`
      
      setLogs(prev => [newLog, ...prev].slice(0, isMobile ? 3 : 6))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [isMobile])

  return (
    <div style={{
      position: 'absolute',
      bottom: isMobile ? '60px' : '40px',
      top: 'auto',
      left: isMobile ? '20px' : '40px',
      width: isMobile ? '180px' : '320px',
      pointerEvents: 'none',
      zIndex: 10
    }}>
      <div style={{ 
        fontFamily: "'SF Mono', monospace", 
        fontSize: isMobile ? '0.5rem' : '0.65rem', 
        color: 'rgba(136, 204, 255, 0.4)',
        letterSpacing: '0.2em',
        marginBottom: '6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{ width: '3px', height: '3px', background: '#88ccff', borderRadius: '50%' }} />
        LIVE_DIAGNOSTICS
      </div>
      <div style={{
        padding: isMobile ? '6px 10px' : '12px',
        background: 'rgba(136, 204, 255, 0.03)',
        borderLeft: '1px solid rgba(136, 204, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        borderRadius: 0,
      }}>
        {logs.map((log, i) => (
          <motion.div
            key={log}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1 - i * (isMobile ? 0.3 : 0.15), x: 0 }}
            style={{ 
              fontFamily: "'SF Mono', monospace", 
              fontSize: isMobile ? '0.55rem' : '0.6rem', 
              color: '#88ccff', 
              marginBottom: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden'
            }}
          >
            {log}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// 2. Simplified Social Link Grid
const SocialGrid = ({ isMobile }) => {
  const socialLinks = [
    { 
      name: 'GITHUB', 
      url: 'https://github.com/heytoshan', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      )
    },
    { 
      name: 'LINKEDIN', 
      url: 'https://linkedin.com/in/heytoshan',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      name: 'EMAIL', 
      url: 'mailto:heyprogrammertoshan@gmail.com',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      )
    }
  ]

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: '12px',
      justifyContent: 'center',
      pointerEvents: 'auto'
    }}>
      {socialLinks.map((link) => (
        <motion.a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ x: isMobile ? 0 : 5, scale: 1.05 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px',
            padding: isMobile ? '8px 12px' : '10px 16px',
            background: 'rgba(136, 204, 255, 0.05)',
            border: '1px solid rgba(136, 204, 255, 0.15)',
            borderRadius: 0,
            textDecoration: 'none',
            color: '#88ccff',
            fontSize: isMobile ? '0.55rem' : '0.65rem',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.15em',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(136, 204, 255, 0.1)'
            e.currentTarget.style.borderColor = 'rgba(136, 204, 255, 0.3)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(136, 204, 255, 0.05)'
            e.currentTarget.style.borderColor = 'rgba(136, 204, 255, 0.15)'
          }}
        >
          {link.icon}
          <span>{link.name}</span>
        </motion.a>
      ))}
    </div>
  )
}

// --- HUD DECORATIONS ---

const CyberBracket = ({ pos, size = 15 }) => {
  const isTop = pos.includes('top')
  const isLeft = pos.includes('left')
  return (
    <div style={{
      position: 'absolute',
      [isTop ? 'top' : 'bottom']: '-2px',
      [isLeft ? 'left' : 'right']: '-2px',
      width: size,
      height: size,
      borderTop: isTop ? '2px solid #88ccff' : 'none',
      borderBottom: !isTop ? '2px solid #88ccff' : 'none',
      borderLeft: isLeft ? '2px solid #88ccff' : 'none',
      borderRight: !isLeft ? '2px solid #88ccff' : 'none',
      opacity: 0.6,
      pointerEvents: 'none'
    }} />
  )
}

// 3. Central Command Console (Ultra-Creative Holographic View)
const CommandConsole = ({ goHome, isMobile }) => {
  return (
    <div style={{
      position: 'relative',
      width: isMobile ? 'min(320px, 88vw)' : '500px',
      padding: isMobile ? '20px 14px' : '30px 24px',
      background: 'rgba(15, 20, 35, 0.85)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(136, 204, 255, 0.2)',
      borderRadius: 0,
      // Reverted clipPath for cleaner sharp look
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), inset 0 0 50px rgba(136, 204, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '18px' : '22px',
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {/* 1. Holographic Texture Overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(136, 204, 255, 0.05) 0%, transparent 100%), repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(136, 204, 255, 0.02) 1px, rgba(136, 204, 255, 0.02) 2px)',
        pointerEvents: 'none',
      }} />
      
      {/* 2. Scanning Beam */}
      <motion.div 
        animate={{ y: ['-100%', '300%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '40px',
          background: 'linear-gradient(to bottom, transparent, rgba(136, 204, 255, 0.08), transparent)',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* 4 Corner Cyber Brackets */}
      <CyberBracket pos="top-left" />
      <CyberBracket pos="top-right" />
      <CyberBracket pos="bottom-left" />
      <CyberBracket pos="bottom-right" />

      {/* Console Header */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          fontFamily: "'Orbitron', sans-serif", 
          fontSize: isMobile ? '0.65rem' : '0.8rem', 
          color: '#fff', 
          letterSpacing: '0.2em',
          textShadow: '0 0 10px rgba(136, 204, 255, 0.5)'
        }}>
          TACTICAL_OVERVIEW_v4.2
        </div>
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ 
            width: '8px', 
            height: '8px', 
            background: '#27c93f', 
            borderRadius: '50%', 
            boxShadow: '0 0 12px #27c93f' 
          }} 
        />
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(136, 204, 255, 0.4), transparent)' }} />

      {/* Living Stats Row - Now show all on mobile too */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: isMobile ? '12px' : '15px' 
      }}>
        {[
          { label: 'COORDINATES', val: '-52.00 // 12.01', active: true },
          { label: 'SYSTEM_UPTIME', val: '99.99%', active: true },
          { label: 'DATA_NODES', val: 'VERIFIED', active: false },
          { label: 'ORBITAL_PHASE', val: 'PHASE_4', active: true }
        ].map(stat => (
          <div key={stat.label} style={{ 
            textAlign: 'left',
            flex: isMobile ? '0 0 48%' : '0 0 45%', // 2 columns for mobile too
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontFamily: "'SF Mono', monospace", 
                fontSize: isMobile ? '0.45rem' : '0.55rem', 
                color: 'rgba(136, 204, 255, 0.4)', 
                marginBottom: '2px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {stat.active && <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} style={{ width: '4px', height: '4px', background: '#88ccff', borderRadius: '50%' }} />}
                {stat.label}
              </div>
              <div style={{ 
                fontFamily: "'SF Mono', monospace", 
                fontSize: isMobile ? '0.55rem' : '0.65rem', 
                color: '#88ccff' 
              }}>{stat.val}</div>
            </div>
            {!isMobile && (
              <div style={{ width: '30px', height: '2px', background: 'rgba(136, 204, 255, 0.1)', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '100%', height: '100%', background: '#88ccff' }} 
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(136, 204, 255, 0.2), transparent)' }} />

      {/* Consolidated Socials */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
          <div style={{ 
          fontFamily: "'SF Mono', monospace", 
          fontSize: '0.7rem', 
          color: 'rgba(136, 204, 255, 0.4)', 
          letterSpacing: '0.2em'
        }}>
          FIND ME ON_
        </div>
        <SocialGrid isMobile={isMobile} />
      </div>

      {/* Thruster Button Refinement */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <motion.button
          onClick={() => goHome()}
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(136, 204, 255, 0.2)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            position: 'relative',
            width: '100%',
            padding: isMobile ? '12px' : '18px',
            background: 'rgba(136, 204, 255, 0.1)',
            border: '1px solid rgba(136, 204, 255, 0.4)',
            borderRadius: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(136, 204, 255, 0.1)',
            pointerEvents: 'auto'
          }}
        >
          {/* Animated Glow Backing */}
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(136, 204, 255, 0.1)', pointerEvents: 'none' }} 
          />
          
          <svg width={isMobile ? "20" : "24"} height={isMobile ? "20" : "24"} viewBox="0 0 24 24" fill="none" stroke="#88ccff" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span style={{ 
            fontFamily: "'Orbitron', sans-serif", 
            fontSize: isMobile ? '0.65rem' : '0.85rem', 
            color: '#88ccff', 
            letterSpacing: '0.4em',
            fontWeight: 'bold'
          }}>
            INIT_RE-ENTRY
          </span>
        </motion.button>
      </div>

      {/* Signature */}
      <div style={{ 
        position: 'relative',
        zIndex: 2,
        marginTop: isMobile ? '5px' : '2px', 
        fontFamily: "'Orbitron', sans-serif", 
        fontSize: '0.5rem', 
        color: 'rgba(255, 255, 255, 0.3)', 
        textAlign: 'center',
        letterSpacing: '0.1em'
      }}>
        DESIGNED & BUILT BY TOSHAN :: 2024
      </div>
    </div>
  )
}

export default function GlassFooter() {
  const mode = useStore(state => state.mode)
  const spaceProgress = useStore(state => state.spaceProgress)
  const goHome = useStore(state => state.goHome)
  const isMobile = useMobile()

  // Footer visible only after passing RESUME planet (progress > 0.9)
  const isVisible = mode === 'SPACE' && spaceProgress > 0.9

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
            inset: 0,
            zIndex: 10001, // Pushed above EVERYTHING including navbar
            pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(136, 204, 255, 0.08) 0%, transparent 85%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            padding: '20px'
          }}
        >
          {/* 1. IDENTITY PLATE (TOP LEFT on Mobile, under Nav) */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{
              position: 'absolute',
              top: isMobile ? '100px' : '40px',
              left: isMobile ? '20px' : '40px',
              transform: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              width: 'auto',
              alignItems: 'flex-start',
              scale: isMobile ? 0.7 : 1,
              transformOrigin: 'top left'
            }}
          >
            <div style={{ 
              fontFamily: "'Orbitron', sans-serif", 
              fontSize: '0.8rem', 
              color: '#fff', 
              letterSpacing: '0.3em',
              whiteSpace: 'nowrap',
              textAlign: 'left'
            }}>
              IDENTITY :: TOSHAN
            </div>
            <div style={{ 
              width: isMobile ? '100px' : '120px', 
              height: '1px', 
              background: 'linear-gradient(90deg, #88ccff, transparent)' 
            }} />
          </motion.div>

          {/* 2. STATS (Desktop Only) */}
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              textAlign: 'right',
              fontFamily: "'SF Mono', monospace",
              fontSize: '0.65rem',
              color: 'rgba(136, 204, 255, 0.4)',
              letterSpacing: '0.1em'
            }}>
              <div>STAR_MAP_v2.1</div>
              <div>ORBITAL_VELOCITY: 32,400 KM/H</div>
            </div>
          )}

          {/* 3. DIAGNOSTIC LOGS */}
          <DiagnosticLogs isMobile={isMobile} />

          {/* 4. CENTRAL COMMAND CONSOLE */}
          <CommandConsole goHome={goHome} isMobile={isMobile} />

          <style>
            {`
              @keyframes pulse-glow {
                0%, 100% { opacity: 0.2; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.1); }
              }
            `}
          </style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


