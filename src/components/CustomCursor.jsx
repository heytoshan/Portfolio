import React, { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import useMobile from '../hooks/useMobile'

export default function CustomCursor() {
  const isMobile = useMobile()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // Spring config for the outer ring (fluid lag)
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isMobile) return

    const handleMouseMove = (e) => {
      if (!isVisible) setIsVisible(true)
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a') || (e.target.style.cursor === 'pointer' ? e.target : null)
      setIsActive(!!target)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isMobile, isVisible, cursorX, cursorY])

  if (isMobile) return null

  return (
    <>
      <style>{`
        body { cursor: none !important; }
        a, button, [role="button"], input, textarea { cursor: none !important; }
      `}</style>
      
      {/* Outer Ring - Delayed movement for "fluid" feel */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isActive ? 1.5 : 1,
          opacity: isVisible ? 1 : 0,
          border: '1.5px solid rgba(136, 204, 255, 0.5)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 999999,
          mixBlendMode: 'difference'
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 }
        }}
      />

      {/* Center Dot - Precise movement */}
      <motion.div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          background: '#88ccff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1000000,
          boxShadow: '0 0 10px #88ccff'
        }}
      />
    </>
  )
}
