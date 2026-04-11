import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import useMobile from '../hooks/useMobile'

export default function TiltWrapper({ children }) {
  const isMobile = useMobile()
  const ref = useRef(null)

  // Motion values for X and Y mouse position
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Smooth springs for rotation
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { damping: 20, stiffness: 150 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 150 })

  function handleMouseMove(e) {
    if (!ref.current || isMobile) return
    const rect = ref.current.getBoundingClientRect()
    
    // Calculate normalized mouse position relative to center of element (-0.5 to 0.5)
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  if (isMobile) return <>{children}</>

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        height: '100%',
        width: '100%'
      }}
    >
      <motion.div style={{ transformStyle: 'preserve-3d' }}>
         {children}
      </motion.div>
    </motion.div>
  )
}
