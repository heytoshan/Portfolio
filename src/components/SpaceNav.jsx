import React from 'react'
import { useStore } from '../store'

// --- NAVIGATION WAYPOINTS with Planet Data ---
const WAYPOINTS = [
  {
    name: 'HOME',
    progress: 0,
    planetData: null // Goes to HOME screen (not a planet)
  },
  { 
    name: 'ABOUT', 
    progress: 0.12, 
    planetData: { position: [0, 0, 0], name: 'ABOUT', type: 'GLASS', color: '#88ccff' }
  },
//... (keeping other items)


  { 
    name: 'SKILLS', 
    progress: 0.23,
    planetData: { position: [-2, 1, -15], name: 'SKILLS', type: 'MERCURY', color: '#ffaa00' }
  },
  { 
    name: 'PROJECTS', 
    progress: 0.36,
    planetData: { position: [2, -1, -30], name: 'PROJECTS', type: 'MARS', color: '#ff4400' }
  },
  { 
    name: 'RESUME', 
    z: -45,
    planetData: { position: [0, 0, -45], name: 'RESUME', type: 'RESUME', color: '#aa44ff' }
  }
]



// Width constraints - responsive
const MIN_WIDTH = 320
const MAX_WIDTH = 520

// Premium Star Logo - 4-pointed tactical star
const SiteLogo = ({ rotation }) => (
  <svg 
    width="18" 
    height="18" 
    viewBox="0 0 24 24" 
    fill="none"
    style={{ 
      filter: 'drop-shadow(0 0 4px rgba(136, 204, 255, 0.4))',
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s cubic-bezier(0.2, 0, 0.2, 1)'
    }}
  >
    {/* Main Star Body */}
    <path 
      d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" 
      fill="white"
      fillOpacity="0.9"
    />
    {/* Internal Detail */}
    <path 
      d="M12 8L13 11L16 12L13 13L12 16L11 13L8 12L11 11L12 8Z" 
      fill="rgba(136, 204, 255, 0.8)"
    />
    {/* Center Core */}
    <circle cx="12" cy="12" r="1.5" fill="#88ccff" />
  </svg>
)

// Cinematic Sun: Soft, radial, glowy, no sharp spikes
const CinematicSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    {/* Core */}
    <circle cx="12" cy="12" r="6" fill="currentColor" fillOpacity="0.9" />
    {/* Soft Glow Ring */}
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="1 3" />
    {/* Outer Haze */}
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" />
  </svg>
)

// Cinematic Moon: Clean crescent, mysterious, no stars
const CinematicMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    {/* Crescent Shape */}
    <path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
      fill="currentColor" 
      fillOpacity="0.9"
    />
    {/* Subtle Glow Reflection */}
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.1" />
  </svg>
)

export default function SpaceNav() {
  const setMode = useStore(state => state.setMode)
  const mode = useStore(state => state.mode)
  const goHome = useStore(state => state.goHome)
  const goHomeInstant = useStore(state => state.goHomeInstant)
  const spaceProgress = useStore(state => state.spaceProgress)
  const activePlanet = useStore(state => state.activePlanet)
  const enterPlanet = useStore(state => state.enterPlanet)
  const exitPlanet = useStore(state => state.exitPlanet)
  const theme = useStore(state => state.theme)
  const toggleTheme = useStore(state => state.toggleTheme)

  // Mobile detection (required for width logic)
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 480)
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 480)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // SCROLL-SCRUBBED WIDTH
  const scrollFactor = Math.min(1, spaceProgress / 0.3)
  
  // Responsive width constraints
  const minW = isMobile ? 350 : 450 // Wider on mobile to prevent text crop
  const maxW = isMobile ? 380 : 650 // Reduced max width, less sprawling
  
  const currentWidth = minW + (maxW - minW) * scrollFactor
  const isScrolled = scrollFactor > 0.1

  // Scroll-tied rotation for glyph (very slow)
  const glyphRotation = spaceProgress * 45

  // Calculate active waypoint
  const getActiveWaypoint = () => {
    for (let i = WAYPOINTS.length - 1; i >= 0; i--) {
      if (spaceProgress >= WAYPOINTS[i].progress - 0.05) {
        return WAYPOINTS[i].name
      }
    }
    return WAYPOINTS[0].name
  }

  const activeWaypoint = mode === 'PLANET' && activePlanet 
    ? activePlanet.name 
    : getActiveWaypoint()

  // Direct planet entry - no scroll step to avoid conflicts
  const handleNavigate = (waypoint) => {
    // 1. HOME - Go to home screen (no animation)
    if (waypoint.name === 'HOME') {
      goHomeInstant()
      return
    }

    // 2. All other buttons (ABOUT, SKILLS, PROJECTS, RESUME) - Enter planet
    if (!waypoint.planetData) return

    // If already in this planet, do nothing
    if (mode === 'PLANET' && activePlanet?.name === waypoint.planetData.name) {
      return
    }

    // If in planet mode, exit first then enter new planet
    if (mode === 'PLANET') {
      exitPlanet()
      setTimeout(() => enterPlanet(waypoint.planetData), 600)
      return
    }

    // If in HOME mode, go to SPACE first then enter planet
    if (mode === 'HOME') {
      setMode('SPACE')
      setTimeout(() => enterPlanet(waypoint.planetData), 300)
      return
    }

    // From SPACE mode, directly enter planet
    enterPlanet(waypoint.planetData)
  }

  // Navigate to START (scroll position 0) when clicking alien glyph
  const handleHomeClick = () => {
    // If in planet, exit first
    if (mode === 'PLANET') {
      exitPlanet()
    }
    
    // Scroll to start (position 0)
    setTimeout(() => {
      const scrollContainers = document.querySelectorAll('[style*="overflow"]')
      for (const el of scrollContainers) {
        if (el.scrollHeight > el.clientHeight) {
          el.scrollTo({ top: 0, behavior: 'smooth' })
          break
        }
      }
    }, mode === 'PLANET' ? 600 : 0)
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        width: `${currentWidth}px`,
        maxWidth: 'calc(100vw - 24px)',
        height: '48px',
        borderRadius: '16px',
        zIndex: 10000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        background: 'rgba(28, 28, 30, 0.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '0.5px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 2px 16px rgba(0, 0, 0, 0.15)',
        pointerEvents: 'auto'
      }}
    >
      {/* Site Logo - LEFT (clickable, goes to START) */}
      <div 
        onClick={handleHomeClick}
        style={{ 
          display: 'flex', 
          alignItems: 'center',
          cursor: 'pointer',
          padding: '0.25rem',
          gap: '0.5rem'
        }}
      >
        <SiteLogo rotation={glyphRotation} />
      </div>

      {/* Navigation Items - CENTER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        flex: 1,
        overflowX: 'auto',
        justifyContent: 'center',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
      {WAYPOINTS.map((waypoint, index) => {
        const isActive = activeWaypoint === waypoint.name
        const isPassed = spaceProgress >= waypoint.progress
        // Only highlight when inside a planet
        const showHighlight = mode === 'PLANET' && isActive
        
        return (
          <React.Fragment key={waypoint.name}>
            <button
              onClick={() => handleNavigate(waypoint)}
              style={{
                padding: '0.4rem clamp(0.4rem, 2vw, 0.75rem)',
                fontSize: '0.65rem',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: showHighlight ? 600 : 400,
                color: showHighlight 
                  ? '#ffffff' 
                  : isPassed 
                    ? 'rgba(255, 255, 255, 0.75)' 
                    : 'rgba(255, 255, 255, 0.45)',
                background: showHighlight 
                  ? 'rgba(255, 255, 255, 0.12)' 
                  : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'color 0.2s ease, background 0.2s ease',
                letterSpacing: '0.02em',
                textTransform: 'uppercase',
                outline: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {waypoint.name}
            </button>
            {/* Separator between items */}
            {index < WAYPOINTS.length - 1 && (
              <div style={{
                width: '1px',
                height: '12px',
                background: 'rgba(255, 255, 255, 0.06)'
              }} />
            )}
          </React.Fragment>
        )
      })}
      </div>

      {/* Right Action - Terminal Trigger */}
      <div 
        onClick={() => window.toggleCommandPalette?.()}
        style={{ 
          width: '28px',
          height: '28px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'rgba(255, 255, 255, 0.8)',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.color = '#ffffff'
          e.target.style.background = 'rgba(136, 204, 255, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.target.style.color = 'rgba(255, 255, 255, 0.8)'
          e.target.style.background = 'rgba(255, 255, 255, 0.08)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M4 17L10 11L4 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 19H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Progress Indicator Line - Shows scroll position in SPACE mode */}
      {mode === 'SPACE' && (
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${Math.min(100, spaceProgress * 200)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, rgba(136, 204, 255, 0.6), rgba(136, 204, 255, 0.2))',
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>
      )}
    </nav>
  )
}
