import React, { useLayoutEffect, useEffect, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { Stars, Environment, useScroll, ScrollControls } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import { useStore } from './store'
import GlassPlanet from './components/GlassPlanet'
import PlanetEnvironment from './components/PlanetEnvironment'
import SkillsContent from './components/SkillsContent'
import ProjectsContent from './components/ProjectsContent'
import HomeContent from './components/HomeContent'
import AboutContent from './components/AboutContent'
import ResumeContent from './components/ResumeContent'
import SpaceNav from './components/SpaceNav'
import GlassFooter from './components/GlassFooter'
import useMobile from './hooks/useMobile' // [NEW]
import VisitorLogger from './components/VisitorLogger' // [NEW]
import SpaceEnvironment from './components/SpaceEnvironment' // [NEW]
import SpaceInstruction from './components/SpaceInstruction' // [NEW]
import Loader from './components/Loader' // [NEW]
import CustomCursor from './components/CustomCursor' // [NEW]
import CommandPalette from './components/CommandPalette' // [NEW]


// --- CONSTANTS ---
const SPACE_START_Z = 10
const SPACE_END_Z = -52 // End further back to see full footer at z=-65

// ... (SpaceNavigator and CameraController unchanged) ...

// 1. SPACE NAVIGATOR
// Listens to scroll and updates the store's spaceProgress.
// Only active when in SPACE mode.
function SpaceNavigator() {
  const scroll = useScroll()
  const setSpaceProgress = useStore(state => state.setSpaceProgress)
  const mode = useStore(state => state.mode)
  const isTransitioning = useStore(state => state.isTransitioning)
  const goHome = useStore(state => state.goHome)
  
  const previousMode = React.useRef('HOME')
  const settlingFrames = React.useRef(0)
  const scrollUpCount = React.useRef(0)

  // Listen for wheel events to detect intentional scroll up at top
  React.useEffect(() => {
    const handleWheel = (e) => {
      const currentMode = useStore.getState().mode
      const currentProgress = useStore.getState().spaceProgress
      
      // Only in SPACE mode and at the very top
      if (currentMode !== 'SPACE' || currentProgress > 0.01) {
        scrollUpCount.current = 0
        return
      }
      
      // User is scrolling UP (negative deltaY) at the top
      if (e.deltaY < -10) {
        scrollUpCount.current++
        if (scrollUpCount.current >= 3) { // 3 scroll-up gestures
          scrollUpCount.current = 0
          goHome()
        }
      } else if (e.deltaY > 10) {
        // Scrolling down resets the counter
        scrollUpCount.current = 0
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [goHome])

  useFrame(() => {
    // Track mode changes
    const justEnteredFromHome = previousMode.current === 'HOME' && mode === 'SPACE'
    previousMode.current = mode
    
    // Only run in SPACE mode
    if (mode !== 'SPACE') {
      settlingFrames.current = 0
      return
    }
    
    // Reset scroll position when entering from HOME
    if (justEnteredFromHome) {
      scroll.el.scrollTop = 0
      setSpaceProgress(0)
      settlingFrames.current = 90 // Wait ~1.5 seconds for damping to settle
      scrollUpCount.current = 0
      return
    }
    
    // Wait for scroll damping to settle after entering from HOME
    if (settlingFrames.current > 0) {
      settlingFrames.current--
      scroll.el.scrollTop = 0
      setSpaceProgress(0)
      return
    }
    
    // Skip during transitions
    if (isTransitioning) return
    
    // Update progress
    setSpaceProgress(scroll.offset)
  })
  return null
}



// 2. CAMERA CONTROLLER
// The Brain. Decides where the camera goes based on Mode and Progress.
function CameraController() {
  const { camera } = useThree()
  // We subscribe to these for the Effect triggers, but use direct state reading in the Loop
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const setIsTransitioning = useStore(state => state.setIsTransitioning)
  // We don't need spaceProgress in the component scope for the loop anymore
  
  // A. LOOP LOGIC (Space Mode)
  useFrame(() => {
    const currentMode = useStore.getState().mode
    const currentProgress = useStore.getState().spaceProgress
    const transitioning = useStore.getState().isTransitioning

    if (currentMode === 'SPACE') {
      // If transitioning OR GSAP is animating, DO NOT TOUCH CAMERA
      if (transitioning || gsap.isTweening(camera.position)) return

      // Calculate target Z based on progress
      const targetZ = THREE.MathUtils.lerp(SPACE_START_Z, SPACE_END_Z, currentProgress)
      
      camera.position.z = targetZ
      
      // Keep X/Y centered in space
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, 0, 0.1)
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0, 0.1)
    }
  })

  // B. MODE TRANSITIONS (Planet Mode)
  // useLayoutEffect ensures we start animations BEFORE the browser paints the next frame
  useLayoutEffect(() => {
    // Kill any fighting tweens immediately
    gsap.killTweensOf(camera.position)

    if (mode === 'PLANET' && activePlanet) {
      // 1. Disable Body Scroll
      document.body.style.overflow = 'hidden'

      // 2. Calculate zoom distance based on planet size for consistent view
      const planetSizes = {
        'ABOUT': 2.5,
        'SKILLS': 2.0,
        'PROJECTS': 2.8,
        'RESUME': 2.6
      }
      const baseSize = 2.5 
      const baseDistance = 3.6
      const planetSize = planetSizes[activePlanet.name] || 2.5
      const zoomDistance = (planetSize / baseSize) * baseDistance

      // 3. Get planet position
      const [px, py, pz] = activePlanet.position
      const targetZ = pz + zoomDistance
      
      console.log('Entering planet:', activePlanet.name, 'at', [px, py, pz], 'Camera going to z:', targetZ)
      
      // 4. Animate to Planet
      gsap.to(camera.position, {
        x: px,
        y: py,
        z: targetZ,
        duration: 1.2,
        ease: "power2.out",
        onStart: () => {
          setIsTransitioning(true)
        },
        onComplete: () => {
          console.log('Camera arrived at:', camera.position.x, camera.position.y, camera.position.z)
          setIsTransitioning(false)
        }
      })
      
    } else if (mode === 'SPACE') {
      // EXITING PLANET
      setIsTransitioning(true)
      document.body.style.overflow = 'hidden'

      const savedProgress = useStore.getState().savedProgress
      const targetZ = THREE.MathUtils.lerp(SPACE_START_Z, SPACE_END_Z, savedProgress)
      
      // FAST SMOOTH EXIT
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: targetZ,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
          setIsTransitioning(false)
          document.body.style.overflow = 'auto'
        }
      })
    }
  }, [mode, activePlanet, camera])

  return null
}

// --- MAIN APP COMPONENT ---

// 3. DYNAMIC LIGHTING & CELESTIAL BODIES
function CelestialLighting() {
  const { mouse } = useThree()
  const starsRef = useRef()
  // Always SPACE/DARK mode now
  const celestialPos = [30, 20, -40] // Moon Position

  useFrame((state) => {
    // Subtle float
    state.camera.position.y += Math.sin(state.clock.elapsedTime * 0.1) * 0.001
    
    // Mouse Parallax for Stars - Reduced sensitivity for better focus
    if (starsRef.current) {
      starsRef.current.rotation.y = THREE.MathUtils.lerp(starsRef.current.rotation.y, (mouse.x * Math.PI) / 60, 0.05)
      starsRef.current.rotation.x = THREE.MathUtils.lerp(starsRef.current.rotation.x, (mouse.y * Math.PI) / 60, 0.05)
    }
  })

  return (
    <>
      <ambientLight intensity={0.05} />
      
      <directionalLight 
        position={celestialPos} 
        intensity={0.5} 
        color="#b0d0ff" 
        castShadow
        shadow-bias={-0.0001}
      />

      <pointLight 
        position={celestialPos} 
        intensity={0.8} 
        color="#4488ff" 
        distance={100} 
        decay={2}
      />

        {/* --- 4. SCENE CONTENT --- */}
        <SpaceEnvironment /> {/* [NEW] Dust & Rocks */}
        
        <group ref={starsRef}>
           <Stars 
            radius={100} 
            depth={50} 
            count={3000} 
            factor={3} 
            saturation={0} 
            fade 
            speed={0} 
          />
        </group>
    </>
  )
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const enterPlanet = useStore(state => state.enterPlanet)
  const exitPlanet = useStore(state => state.exitPlanet)
  const mode = useStore(state => state.mode)
  const isMobile = useMobile() // [NEW]

  // [OPTIMIZATION]
  // On Mobile + Home Mode, we want fewer stars to reduce load.
  // When in Space Mode, we can afford more stats.
  const starCount = isMobile && mode === 'HOME' ? 500 : 3000
  
  return (
    <>
      <VisitorLogger /> {/* [NEW] Logger */}

      <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <Loader /> {/* [NEW] System Loader */}
      
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'auto' }}>
        <Canvas 
          // [OPTIMIZATION] Reduce DPR slightly on mobile for everything
          dpr={[1, isMobile ? 1.25 : 1.5]} 
          camera={{ position: [0, 0, 10], fov: 60 }} 
          gl={{ 
            powerPreference: "high-performance", 
            antialias: false, 
            stencil: false, 
            depth: true 
          }}
        >
          <color attach="background" args={['#050510']} />
          <fogExp2 attach="fog" args={['#050510', 0.01]} />
          
          <CelestialLighting />
          
          <Environment preset="city" />
          
          <PlanetEnvironment />
          
          
          <React.Suspense fallback={null}>
            <ScrollControls pages={6} damping={0.2} distance={1}>
                {/* Reverted to 6 pages for compact spacing */}

                <SpaceNavigator />
                <CameraController />
                
                {/* PLANETS - Original Spacing (15 units) */}
                
                {/* 1. HOME (Earth-like) - Balanced, Organic */}
                <GlassPlanet 
                  position={[0, 0, 0]} 
                  size={2.5} 
                  color="#4488ff" 
                  label="ABOUT"
                  roughness={0.4}
                  metalness={0.5}
                  emissive="#001133"
                  onClick={() => enterPlanet({ position: [0, 0, 0], name: 'ABOUT', type: 'GLASS', color: '#88ccff' })} 
                />
                
                {/* 2. SKILLS (Moon-like) - Rough, Matte, Golden */}
                <GlassPlanet 
                  position={[-2, 1, -15]} 
                  size={2.0} 
                  color="#ffcc00" 
                  label="SKILLS"
                  roughness={0.9}
                  metalness={0.1}
                  emissive="#332200"
                  onClick={() => enterPlanet({ position: [-2, 1, -15], name: 'SKILLS', type: 'MERCURY', color: '#ffaa00' })} 
                />
                
                {/* 3. PROJECTS (Mars-like) - Metallic, Rusty, Industrial */}
                <GlassPlanet 
                  position={[2, -1, -30]} 
                  size={2.8} 
                  color="#ff4444" 
                  label="PROJECTS"
                  roughness={0.6}
                  metalness={0.8}
                  emissive="#330000"
                  onClick={() => enterPlanet({ position: [2, -1, -30], name: 'PROJECTS', type: 'MARS', color: '#ff4400' })} 
                />
                
                {/* 4. RESUME (Alien) - Glossy, High Tech, Purple */}
                <GlassPlanet 
                  position={[0, 0, -45]} 
                  size={2.6} 
                  color="#cc88ff" 
                  label="RESUME"
                  roughness={0.1}
                  metalness={1.0}
                  emissive="#220044"
                  onClick={() => enterPlanet({ position: [0, 0, -45], name: 'RESUME', type: 'RESUME', color: '#aa44ff' })} 
                />
            </ScrollControls>
          </React.Suspense>
        </Canvas>
      </div>
      </div>

      {/* SKILLS CONTENT OVERLAY */}
      <SkillsContent />

      {/* PROJECTS CONTENT OVERLAY */}
      <ProjectsContent />
      
      {/* HOME / ABOUT CONTENT OVERLAY - Now dedicated to HOME Intro */}
      <HomeContent />
      
      {/* ABOUT PLANET CONTENT OVERLAY - Dedicated to ABOUT bio */}
      <AboutContent />

      {/* RESUME PLANET CONTENT OVERLAY */}
      <ResumeContent />

      {/* FOOTER CONTENT OVERLAY */}
      <GlassFooter />

      {/* HUD NAVIGATION */}
      <SpaceNav />
      <SpaceInstruction /> {/* [NEW] Instruction Text */}

      {/* UI OVERLAY - RETURN TO ORBIT (Glass Pill Back) */}
    {mode === 'PLANET' && (
  <div
    style={{
      position: 'fixed',
      top: 'clamp(5rem, 12vh, 6rem)', // Pushed down to clear navbar (approx 80px)
      left: 'clamp(1rem, 5vw, 2rem)',
      zIndex: 200,
      width: 'max-content'
    }}
  >
    <button
      onClick={exitPlanet}
      style={{
        background: 'transparent',
        border: 'none',
        outline: 'none',
        appearance: 'none',
        WebkitAppearance: 'none'
      }}
      className="
        group flex items-center gap-[8px]
        px-3 md:px-0 py-2
        cursor-pointer
        text-white
        opacity-80 hover:opacity-100
        transition-all duration-200
        hover:-translate-x-1
        drop-shadow-md
      "
    >
      {/* Arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        className="relative top-[1px] group-hover:-translate-x-1 transition-transform"
      >
        <path
          d="M14 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Text */}
      <span
        className="
          hidden md:block
          text-[12px]
          leading-none
          tracking-[0.15em]
          font-bold
          text-white
        "
      >
        RETURN TO ORBIT
      </span>
    </button>
  </div>
)}
      <VisitorLogger />
      <CustomCursor /> {/* [NEW] Custom Cursor */}
      <CommandPalette /> {/* [NEW] Command Palette */}
    </>
  )
}
