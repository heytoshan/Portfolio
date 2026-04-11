import React, { useEffect, useState, useRef } from 'react'

export default function AudioManager() {
  const [isMuted, setIsMuted] = useState(true) // Start muted by default (browser policy)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioContextRef = useRef(null)
  const humOscillatorRef = useRef(null)
  const humGainRef = useRef(null)

  // Initialize Audio Context
  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    audioContextRef.current = new AudioContext()
    
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  // Start Ambience
  const startAmbience = () => {
    if (!audioContextRef.current || humOscillatorRef.current) return

    const ctx = audioContextRef.current
    
    // Create oscillator for low hum
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.setValueAtTime(50, ctx.currentTime) // Deep rumble
    
    // Low pass filter to make it softer
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(120, ctx.currentTime)

    // Connect: Osc -> Filter -> Gain -> Destination
    osc.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    // Volume - very subtle
    gainNode.gain.setValueAtTime(0, ctx.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2) // Fade in

    osc.start()
    
    humOscillatorRef.current = osc
    humGainRef.current = gainNode
  }

  const stopAmbience = () => {
    if (humGainRef.current && audioContextRef.current) {
        const ctx = audioContextRef.current
        humGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 1) // Fade out
        setTimeout(() => {
             humOscillatorRef.current?.stop()
             humOscillatorRef.current = null
        }, 1000)
    }
  }

  const toggleMute = () => {
    if (!hasInteracted) {
        // First interaction - resume context if suspended
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume()
        }
        setHasInteracted(true)
    }

    setIsMuted(!isMuted)
  }

  useEffect(() => {
    if (!isMuted && hasInteracted) {
        startAmbience()
    } else {
        stopAmbience()
    }
  }, [isMuted, hasInteracted])

  // Expose sound effects globally (or via window for simplicity in this scope)
  useEffect(() => {
    window.playHoverSound = () => {
       if (isMuted || !audioContextRef.current) return
       const ctx = audioContextRef.current
       const osc = ctx.createOscillator()
       const gain = ctx.createGain()
       osc.connect(gain)
       gain.connect(ctx.destination)
       
       // High pitch blip
       osc.frequency.setValueAtTime(800, ctx.currentTime)
       osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
       
       gain.gain.setValueAtTime(0.05, ctx.currentTime)
       gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
       
       osc.start()
       osc.stop(ctx.currentTime + 0.1)
    }

    window.playClickSound = () => {
        if (isMuted || !audioContextRef.current) return
        const ctx = audioContextRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        // Positive chirp
        osc.frequency.setValueAtTime(400, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1)
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
        
        osc.start()
        osc.stop(ctx.currentTime + 0.15)
     }
  }, [isMuted])


  return (
    <button
      onClick={toggleMute}
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 10001,
        transition: 'all 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = 'rgba(136, 204, 255, 0.6)'
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {isMuted ? (
        // Mute Icon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M9 9v6a3 3 0 0 0 5.12 2.12M15 9.34V4l-6.81 5H4v6h5.25"></path>
        </svg>
      ) : (
        // Sound Icon
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      )}
    </button>
  )
}
