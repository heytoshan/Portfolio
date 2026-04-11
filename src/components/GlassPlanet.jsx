
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text, useTexture } from '@react-three/drei'
import { useStore } from '../store'

// --- SHARED RESOURCES ---
// 1. Single Geometry for all planets (Radius 1). 
//    We will scale the mesh to resize it.
//    Reduced segments to 48 (Visual fidelity maintained, 30% vertex saving).
const sharedGeometry = new THREE.SphereGeometry(1, 48, 48)

// 2. Single Physical Material (Expensive!)
//    Color is Fixed to White (Clear Glass).
//    We will rely on the inner sphere for the specific planet color.
const sharedGlassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 1,  // Glass
  opacity: 1,
  metalness: 0,
  roughness: 0,     // Perfectly smooth
  ior: 1.5,         // Refractive Index
  thickness: 2,     // Volume
  attenuationColor: 0xffffff,
  attenuationDistance: 5,
  specularIntensity: 1,
  specularColor: 0xffffff,
  envMapIntensity: 1,
  transparent: true, // Required for transmission
  side: THREE.FrontSide
})

export default function GlassPlanet({ 
  position, 
  size = 1, 
  color = 'white', 
  label = '', 
  texture = null, 
  roughness = 0.5,
  metalness = 0.5,
  emissive = 'black',
  onClick 
}) {
  const mode = useStore(state => state.mode)
  
  // Load texture if provided (Suspense handled by parent)
  const map = texture ? useTexture(texture) : null

  // Memoize materials
  const innerMaterial = useMemo(() => {
     return new THREE.MeshStandardMaterial({
        map: map,
        color: color,
        roughness: roughness,
        metalness: metalness,
        emissive: emissive,
        emissiveIntensity: 0.5,
      })
  }, [color, map, roughness, metalness, emissive])

  // Ref for the Label
  const labelRef = useRef()
  // Ref for floating animation (INNER group only)
  const floatRef = useRef()
  // Vector for distance calculation
  const vec = useMemo(() => new THREE.Vector3(), [])
  // Track animation start time
  const floatStartTime = useRef(null)

  // Get active planet from store
  const activePlanet = useStore(state => state.activePlanet)

  // CINEMATIC LABEL BEHAVIOR + FLOATING ANIMATION
  useFrame((state) => {
    // Check if THIS planet is the active one being viewed
    const isThisPlanetActive = mode === 'PLANET' && activePlanet?.name === label

    // FLOATING ANIMATION (only for the active planet)
    // This modifies the INNER float group, not the outer position group
    if (floatRef.current && isThisPlanetActive) {
      // Track start time for consistent animation
      if (floatStartTime.current === null) {
        floatStartTime.current = state.clock.getElapsedTime()
      }
      const localTime = state.clock.getElapsedTime() - floatStartTime.current
      // Very subtle bobbing: oscillates between -0.03 and +0.03
      const floatY = Math.sin(localTime * 0.5) * 0.03
      floatRef.current.position.y = floatY
    } else if (floatRef.current) {
      // Reset to 0 (center) when not active
      floatRef.current.position.y = 0
      floatStartTime.current = null // Reset for next time
    }

    if (!labelRef.current || !label) return

    // 1. Calculate Distance: Camera <-> Planet Center
    const worldPos = vec.set(position[0], position[1], position[2])
    const dist = state.camera.position.distanceTo(worldPos)

    // 2. Determine Visibility Range
    const maxDist = 40
    const minDist = 8
    
    // Normalized visibility factor (0 to 1)
    let vis = 1 - (dist - minDist) / (maxDist - minDist)
    vis = Math.max(0, Math.min(1, vis))

    // 3. Planet Mode Check (Hide if we entered a planet)
    if (mode === 'PLANET') {
      vis = 0
    }

    // 4. Apply Animations
    labelRef.current.fillOpacity = vis * 0.7

    const baseHeight = 1.15
    const riseAmount = 0.1
    labelRef.current.position.y = baseHeight + (vis * riseAmount)
  })

  return (
    // OUTER GROUP: Fixed position from prop (NEVER modified by animation)
    <group 
      position={position} 
      scale={[size, size, size]}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick(e)
      }} 
      onPointerOver={() => document.body.style.cursor = 'pointer'} 
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      {/* INNER GROUP: Only handles float offset (oscillates around y=0) */}
      <group ref={floatRef}>
        <mesh geometry={sharedGeometry} material={sharedGlassMaterial} renderOrder={1} />
        <mesh scale={[0.5, 0.5, 0.5]} geometry={sharedGeometry} material={innerMaterial} />

        {/* CINEMATIC LABEL */}
        {label && (
          <Text
            ref={labelRef}
            text={label}
            position={[0, 1.8, 0]}
            fontSize={0.25}
            color="#e0e0e0"
            anchorX="center"
            anchorY="bottom"
            letterSpacing={0.2}
            outlineWidth={0}
            fillOpacity={0}
          >
            {label}
          </Text>
        )}
      </group>
    </group>
  )
}

