import React, { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '../store'

// --- PLANET MOOD SYSTEM ---
// Each planet defines its unique atmosphere, lighting, and camera feel
const MOODS = {
  // HERO (GLASS): Cool, clean, premium glass feel - welcoming first impression
  GLASS: { 
    fogColor: '#88ccff',
    fogDensity: 0.03,
    ambientColor: '#88ccff',
    ambientIntensity: 0.8,
    pointColor: '#aaddff',
    pointIntensity: 1.5,
    backgroundMult: 0.02,
    fov: 65,
    breatheSpeed: 0.5
  },
  // SKILLS (MERCURY): Cool, clean, technical - precision and expertise
  MERCURY: { 
    fogColor: '#66ddff',
    fogDensity: 0.04,
    ambientColor: '#88ffff',
    ambientIntensity: 0.7,
    pointColor: '#aaffff',
    pointIntensity: 2.0,
    backgroundMult: 0.02,
    fov: 60,
    breatheSpeed: 0.4
  },
  // PROJECTS (MARS): Heavier, darker, dramatic - showcasing serious work
  MARS: { 
    fogColor: '#442222',
    fogDensity: 0.07,
    ambientColor: '#664433',
    ambientIntensity: 0.4,
    pointColor: '#ff6644',
    pointIntensity: 2.5,
    backgroundMult: 0.03,
    fov: 55,
    breatheSpeed: 0.3
  },
  // RESUME: Professional, clean - showcasing credentials
  RESUME: { 
    fogColor: '#ffddaa',
    fogDensity: 0.04,
    ambientColor: '#ffeecc',
    ambientIntensity: 0.6,
    pointColor: '#ffcc88',
    pointIntensity: 1.8,
    backgroundMult: 0.03,
    fov: 62,
    breatheSpeed: 0.6
  }
}

// Space defaults
const SPACE_FOV = 60
const SPACE_FOG_DENSITY = 0.02

export default function PlanetEnvironment() {
  const { scene, camera } = useThree()
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  
  const meshRef = useRef()
  const pointLightRef = useRef()
  const groupRef = useRef()

  useEffect(() => {
    if (mode === 'PLANET' && activePlanet) {
      const mood = MOODS[activePlanet.type] || MOODS.GLASS
      const fogColor = new THREE.Color(mood.fogColor)
      const pointColor = new THREE.Color(mood.pointColor)

      // 1. FOG TRANSITION (only if fog exists)
      if (scene.fog) {
        gsap.to(scene.fog, {
          density: mood.fogDensity,
          duration: 2.5,
          ease: "power2.inOut"
        })
        gsap.to(scene.fog.color, {
          r: fogColor.r,
          g: fogColor.g,
          b: fogColor.b,
          duration: 2.5
        })
      }

      // 2. BACKGROUND TRANSITION (Very dark atmosphere tint)
      gsap.to(scene.background, {
        r: fogColor.r * mood.backgroundMult,
        g: fogColor.g * mood.backgroundMult,
        b: fogColor.b * mood.backgroundMult,
        duration: 2.5
      })

      // 3. CAMERA FOV TRANSITION (Subtle mood change)
      gsap.to(camera, {
        fov: mood.fov,
        duration: 2.5,
        ease: "power2.inOut",
        onUpdate: () => camera.updateProjectionMatrix()
      })

      // 4. ATMOSPHERE SPHERE FADE IN
      if (meshRef.current) {
        meshRef.current.visible = true
        gsap.to(meshRef.current.material, {
          opacity: 0.25,
          duration: 2,
          delay: 0.5
        })
        gsap.to(meshRef.current.scale, {
          x: 25, y: 25, z: 25,
          duration: 3,
          ease: "power2.out"
        })
      }

      // 5. POINT LIGHT ACTIVATION
      if (pointLightRef.current) {
        gsap.to(pointLightRef.current.color, {
          r: pointColor.r,
          g: pointColor.g,
          b: pointColor.b,
          duration: 2
        })
        gsap.to(pointLightRef.current, {
          intensity: mood.pointIntensity,
          duration: 2.5
        })
      }

    } else {
      // RETURN TO SPACE
      
      // 1. FOG RESET (only if fog exists)
      if (scene.fog) {
        gsap.to(scene.fog, { density: SPACE_FOG_DENSITY, duration: 2 })
        gsap.to(scene.fog.color, { r: 0.02, g: 0.02, b: 0.02, duration: 2 })
      }

      // 2. BACKGROUND RESET
      gsap.to(scene.background, { r: 0, g: 0, b: 0, duration: 2 })

      // 3. CAMERA FOV RESET
      gsap.to(camera, {
        fov: SPACE_FOV,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => camera.updateProjectionMatrix()
      })

      // 4. ATMOSPHERE FADE OUT
      if (meshRef.current) {
        gsap.to(meshRef.current.material, {
          opacity: 0,
          duration: 1,
          onComplete: () => {
            if (meshRef.current) meshRef.current.visible = false
          }
        })
        gsap.to(meshRef.current.scale, {
          x: 20, y: 20, z: 20,
          duration: 1
        })
      }

      // 5. LIGHT FADE OUT
      if (pointLightRef.current) {
        gsap.to(pointLightRef.current, {
          intensity: 0,
          duration: 1.5
        })
      }
    }
  }, [mode, activePlanet, scene, camera])

  // AMBIENT MOVEMENT: Slow rotation + subtle breathing
  useFrame((state, delta) => {
    if (groupRef.current && mode === 'PLANET') {
      groupRef.current.rotation.y += delta * 0.01
      
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.015 + 1
      if (meshRef.current) {
        meshRef.current.scale.setScalar(22 * breathe)
      }
    }
  })

  if (!activePlanet && mode !== 'PLANET') return null

  const pos = activePlanet ? activePlanet.position : [0, 0, 0]
  const col = activePlanet ? (MOODS[activePlanet.type]?.fogColor || '#88ccff') : '#88ccff'

  return (
    <group ref={groupRef} position={pos}>
      {/* ATMOSPHERE DOME */}
      <mesh ref={meshRef} visible={false} scale={[20, 20, 20]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial 
          color={col} 
          side={THREE.BackSide} 
          transparent 
          opacity={0} 
          depthWrite={false}
        />
      </mesh>

      {/* AMBIENT PLANET GLOW */}
      <pointLight 
        ref={pointLightRef}
        intensity={0}
        distance={50}
        decay={2}
        color="#ffffff"
      />
    </group>
  )
}
