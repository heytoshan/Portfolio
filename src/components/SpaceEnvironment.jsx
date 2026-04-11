import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useMobile from '../hooks/useMobile'

export default function SpaceEnvironment() {
  const isMobile = useMobile()
  
  // Minimal Dust for ambiance (no clutter)
  const dustCount = isMobile ? 500 : 1500

  return (
    <group>
      <SpaceDust count={dustCount} />
    </group>
  )
}

function SpaceDust({ count }) {
  const mesh = useRef()
  
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 80
        const y = (Math.random() - 0.5) * 80
        const z = (Math.random() - 0.5) * 100 - 20
        
        temp[i * 3] = x
        temp[i * 3 + 1] = y
        temp[i * 3 + 2] = z
    }
    return temp
  }, [count])

  useFrame((state, delta) => {
    if (mesh.current) {
        mesh.current.rotation.y += delta * 0.01
    }
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#88ccff"
        transparent
        opacity={0.3}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </points>
  )
}
