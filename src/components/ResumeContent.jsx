import React from 'react'
import { useStore } from '../store'
import useMobile from '../hooks/useMobile' // [NEW]

export default function ResumeContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const isMobile = useMobile() // [NEW]

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'RESUME'

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: isMobile ? 'auto' : 0, // [FIX] Bottom align mobile
        bottom: 0,
        left: 0,
        width: '100%',
        height: isMobile ? '80vh' : '100vh', // [FIX] Reduced height mobile
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile 
          ? '5rem 1rem' 
          : 'clamp(8rem, 15vh, 9rem) clamp(1rem, 5vw, 2rem) 2rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        zIndex: 50,
        pointerEvents: 'auto',
        background: isMobile ? 'rgba(20, 10, 30, 0.95)' : 'transparent', // [FIX] Dark Purple tint
        borderTop: isMobile ? '1px solid rgba(170, 68, 255, 0.2)' : 'none',
        borderRadius: isMobile ? '30px 30px 0 0' : '0',
        animation: isMobile ? 'slideUp 0.5s ease-out forwards' : 'none'
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
      {/* macOS Style Glass Card Container */}
      <div style={{
        width: '100%',
        maxWidth: 'min(800px, 94vw)',
        height: '80vh',
        background: 'rgba(15, 20, 35, 0.75)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 30px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* macOS Title Bar */}
        <div style={{
          padding: '1rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'grid',
          gridTemplateColumns: '80px 1fr 80px',
          alignItems: 'center'
        }}>
          {/* Traffic Lights */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 5px rgba(255, 95, 86, 0.3)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 5px rgba(255, 189, 46, 0.3)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 5px rgba(39, 201, 63, 0.3)' }} />
          </div>

          <h1 style={{
            margin: 0,
            fontSize: '0.75rem',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.7)',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            textAlign: 'center'
          }}>
            RESUME_DATA_v1.0
          </h1>
          
          {/* Action Flank */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="/resume.pdf"
              download="resume.pdf"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.65rem',
                fontFamily: "'Orbitron', sans-serif",
                color: '#cc88ff',
                textDecoration: 'none',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                opacity: 0.8,
                transition: 'opacity 0.2s ease',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => e.target.style.opacity = '1'}
              onMouseOut={(e) => e.target.style.opacity = '0.8'}
            >
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>SAVE</span>
            </a>
          </div>
        </div>

        {/* PDF Preview */}
        <div style={{
          flex: 1,
          padding: isMobile ? '0.5rem' : '1.5rem',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.2)'
        }}>
          <iframe
            src="/resume.pdf#toolbar=0&navpanes=0&scrollbar=0"
            title="Resume Preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
