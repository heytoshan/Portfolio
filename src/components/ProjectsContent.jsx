import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import useMobile from '../hooks/useMobile'
import TiltWrapper from './TiltWrapper'


// --- PROJECTS DATA ---
const PROJECTS = [
  {
    id: 1,
    title: 'GitHub-Repo-Finder',
    description: 'A sleek, modern, and highly responsive web application built with React 19 and Tailwind CSS 4 that allows users to search for GitHub profiles and explore their repositories with ease..',
    stack: ['React 19', 'Tailwind CSS 4'],
    links: {
      github: 'https://github.com/heytoshan/GitHub-Repo-Finder',
      live: null
    }
  },
  {
    id: 2,
    title: 'Currency-Converter',
    description: 'A premium, high-performance Currency Converter built with React and Vanilla CSS. This project features a modern, glassmorphic UI, real-time data fetching with fallback reliability, and a focus on sleek aesthetics.',
    stack: ['React.js', 'vanilla css', 'exchange rate API'],
    links: {
      github: 'https://github.com/heytoshan/Currency-Converter',
      live: null
    }
  },
  {
    id: 3,
    title: 'Random-Password-Generator',
    description: 'A high-performance, secure, and modern password generation tool built with React and Vite. Designed for users who demand both security and ease of use.',
    stack: ['React', 'Vite', 'Vanilla CSS'],
    links: {
      github: 'https://github.com/heytoshan/Random-Password-Generator',
      live: null
    }
  }
]

// Glass Card Component
function ProjectCard({ project, isExpanded, onToggle }) {
  const isMobile = useMobile()
  
  return (
    <TiltWrapper>
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => onToggle(project.id)}
        style={{
          background: isExpanded ? 'rgba(255, 68, 68, 0.15)' : 'rgba(255, 68, 68, 0.05)',
          border: '1px solid rgba(255, 68, 68, 0.2)',
          borderRadius: 0,
          padding: isMobile ? '1.5rem' : '2rem',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s ease',
          boxShadow: isExpanded ? '0 0 30px rgba(255, 68, 68, 0.2)' : 'none',
          width: '100%',
          boxSizing: 'border-box'
        }}
        whileHover={{ x: isMobile ? 0 : 10, background: 'rgba(255, 68, 68, 0.1)' }}
      >
        {/* Holographic Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1rem'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: isMobile ? '1.1rem' : '1.4rem',
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.1rem',
            color: '#fff'
          }}>{project.title}</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              fontSize: '0.7rem',
              fontFamily: "'SF Mono', monospace",
              color: 'rgba(255, 68, 68, 0.6)'
            }}>ID_00{project.id}</span>
            
            {/* Expand Indicator */}
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none"
              style={{
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease',
                opacity: 0.6
              }}
            >
              <path 
                d="M19 9l-7 7-7-7" 
                stroke="rgba(255, 68, 68, 0.8)" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: "'Outfit', sans-serif"
        }}>
          {project.description}
        </p>

        {/* Expansion Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ paddingTop: '2rem', borderTop: '1px solid rgba(255, 68, 68, 0.1)', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {project.stack.map(s => (
                    <span key={s} style={{
                      fontSize: '0.65rem',
                      fontFamily: "'Orbitron', sans-serif",
                      padding: '4px 10px',
                      background: 'rgba(255, 68, 68, 0.1)',
                      border: '1px solid rgba(255, 68, 68, 0.2)',
                      color: '#ff4444'
                    }}>{s}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a 
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} // Prevent card toggle
                    style={{
                      fontSize: '0.8rem',
                      fontFamily: "'SF Mono', monospace",
                      color: '#fff',
                      padding: '10px 18px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: 0,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    → GitHub
                  </a>
                  {project.links.live && (
                    <a 
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevent card toggle
                      style={{
                        fontSize: '0.8rem',
                        fontFamily: "'SF Mono', monospace",
                        color: '#fff',
                        padding: '10px 18px',
                        background: 'rgba(255, 68, 68, 0.2)',
                        border: '1px solid rgba(255, 68, 68, 0.4)',
                        borderRadius: 0,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(255, 100, 68, 0.3)'
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'rgba(255, 100, 68, 0.2)'
                      }}
                    >
                      → Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </TiltWrapper>
  )
}

export default function ProjectsContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const [expandedId, setExpandedId] = useState(null)
  const isMobile = useMobile() // [NEW]

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'PROJECTS'

  if (!isVisible) return null

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

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
        justifyContent: 'flex-start',
        padding: isMobile 
          ? '5rem 1rem 4rem' // Mobile padding (Pushed lower)
          : 'clamp(8rem, 18vh, 10rem) clamp(1rem, 5vw, 2rem) 2rem',
        boxSizing: 'border-box',
        overflowY: 'auto',
        zIndex: 5,
        pointerEvents: 'auto',
        background: isMobile ? 'rgba(44, 30, 30, 0.95)' : 'transparent', // [FIX] Dark Red tint for Mars
        borderTop: isMobile ? '1px solid rgba(255, 68, 68, 0.2)' : 'none',
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
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <span style={{
          fontSize: '0.65rem',
          fontFamily: 'monospace',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase'
        }}>
          FEATURED WORK
        </span>
        <h2 style={{
          margin: '0.5rem 0 0 0',
          fontSize: 'clamp(1.5rem, 5vw, 1.8rem)',
          fontFamily: 'monospace',
          fontWeight: 600,
          color: '#ffffff',
          letterSpacing: '0.05em'
        }}>
          PROJECTS
        </h2>
      </div>

      {/* Project Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '500px'
      }}>
        {PROJECTS.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isExpanded={expandedId === project.id}
            onToggle={() => handleToggle(project.id)}
          />
        ))}
      </div>

      {/* Hint */}
      <div style={{
        marginTop: '2rem',
        fontSize: '0.65rem',
        fontFamily: 'monospace',
        color: 'rgba(255, 255, 255, 0.3)',
        letterSpacing: '0.2em'
      }}>
        TAP TO EXPAND
      </div>
    </div>
  )
}
