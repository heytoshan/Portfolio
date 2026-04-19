import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../store";
import useMobile from "../hooks/useMobile";
import TiltWrapper from "./TiltWrapper";

const roles = ["SOFTWARE DEVELOPER", "FREELANCER", "FULL STACK ENGINEER"];

// Generate random stars for parallax background
function generateStars(count) {
  const stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      depth: Math.random(),
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  return stars;
}

function AnimatedLetter({ letter, index }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: 0.05,
        delay: index * 0.035,
        ease: "easeOut",
      }}
      style={{ display: 'inline-block' }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

function AnimatedRole({ text }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={text}
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {text.split("").map((letter, index) => (
          <AnimatedLetter key={`${letter}-${index}`} letter={letter} index={index} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default function HomeContent() {
  const mode = useStore(state => state.mode);
  const setMode = useStore(state => state.setMode);
  const activePlanet = useStore(state => state.activePlanet);
  const isReturningFromSpace = useStore(state => state.isReturningFromSpace);
  const setReturningFromSpace = useStore(state => state.setReturningFromSpace);
  
  const [roleIndex, setRoleIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const accumulatedScrollRef = useRef(0);
  const isMobile = useMobile(); // [NEW] Use hook instead of local state

  // Lock space re-entry during return animation
  const isLockedRef = useRef(false);

  // Animate smooth reverse when returning from space
  useEffect(() => {
    if (isReturningFromSpace) {
      isLockedRef.current = true; // LOCK
      // Start from progress = 1 (end state)
      setScrollProgress(1);
      accumulatedScrollRef.current = 1000;
      setReturningFromSpace(false);
      
      // Smoothly animate back to 0 over 1.2 seconds
      const duration = 1200;
      const startTime = Date.now();
      const startProgress = 1;
      const targetProgress = 0;
      
      const animateReverse = () => {
        const elapsed = Date.now() - startTime;
        const t = Math.min(1, elapsed / duration);
        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - t, 3);
        const newProgress = startProgress + (targetProgress - startProgress) * eased;
        
        setScrollProgress(newProgress);
        accumulatedScrollRef.current = newProgress * 1000;
        
        if (t < 1) {
          requestAnimationFrame(animateReverse);
        } else {
           isLockedRef.current = false; // UNLOCK when done
        }
      };
      
      requestAnimationFrame(animateReverse);
      
      // Safety unlock
      setTimeout(() => { isLockedRef.current = false; }, 1300);
    }
  }, [isReturningFromSpace, setReturningFromSpace]);
  
  // [OPTIMIZATION] Reduce star count on mobile
  const stars = useMemo(() => generateStars(isMobile ? 40 : 120), [isMobile]);

  // Visibility based on store mode - ONLY show in HOME mode
  const isHome = mode === 'HOME';
  const isVisible = isHome;

  // Role cycling
  useEffect(() => {
    if (!isHome) return;
    
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2700);

    return () => clearInterval(interval);
  }, [isHome]);

  // Scroll-based animation tracking
  useEffect(() => {
    if (!isHome) {
      accumulatedScrollRef.current = 0;
      setScrollProgress(0);
      return;
    }

    // [TUNING] Tightened for better flow
    const maxScroll = 600; // [REDUCED] Faster transition past intro
    const handleWheel = (e) => {
      accumulatedScrollRef.current = Math.max(0, Math.min(maxScroll, 
        accumulatedScrollRef.current + e.deltaY * 0.75
      ));
      
      const progress = accumulatedScrollRef.current / maxScroll;
      setScrollProgress(progress);
      
      if (progress >= 0.99 && !isLockedRef.current) {
        setTimeout(() => {
          setMode('SPACE');
          accumulatedScrollRef.current = 0;
          setScrollProgress(0);
        }, 500);
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e) => {
      const deltaY = touchStartY - e.touches[0].clientY;
      accumulatedScrollRef.current = Math.max(0, Math.min(maxScroll, 
        accumulatedScrollRef.current + deltaY * 1.8
      ));
      touchStartY = e.touches[0].clientY;
      
      const progress = accumulatedScrollRef.current / maxScroll;
      setScrollProgress(progress);
      
      if (progress >= 0.99 && !isLockedRef.current) {
        setTimeout(() => {
          setMode('SPACE');
          accumulatedScrollRef.current = 0;
          setScrollProgress(0);
        }, 500);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isHome, setMode]);

  // Handle orb click - trigger animation to plateau
  const handleOrbClick = () => {
    const startProgress = scrollProgress;
    const targetProgress = 0.55; // Midpoint of plateau
    const duration = 1200;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = t * (2 - t);
      const newProgress = startProgress + (targetProgress - startProgress) * eased;
      
      setScrollProgress(newProgress);
      accumulatedScrollRef.current = newProgress * 1000; // Match maxScroll
      
      if (t < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  };

  // ============================================================
  // SCROLL-DRIVEN ANIMATION CALCULATIONS (REFINED FOR PLATEAU)
  // ============================================================
  // Phase 1 (0-0.3): Orb to center, hi-text fades
  // Phase 2 (0.3-0.45): Holographic reveal appears
  // Phase 3 (0.45-0.6): Plateau (Readable Dwell) - SHORTENED
  // Phase 4 (0.6-1.0): Transition to space
  // Orb Position: Curves to center, then stays for plateau
  const orbX = scrollProgress < 0.3
    ? 35 - (scrollProgress / 0.3) * 35 
    : 0;

  const orbY = scrollProgress < 0.45
    ? 0
    : scrollProgress < 0.6
      ? -35 // Stays up during plateau
    : -35 - ((scrollProgress - 0.6) / 0.4) * 150; // Final move up

  const orbScale = scrollProgress < 0.3
    ? 0.8 + (scrollProgress / 0.3) * 0.4
    : scrollProgress < 0.6
    ? 1.2
    : 1.2 - ((scrollProgress - 0.6) / 0.4) * 0.5;

  // Texts
  const initialTextOpacity = Math.max(0, 1 - scrollProgress * 3);

  const introOpacity = scrollProgress < 0.3
    ? 0
    : scrollProgress < 0.45
      ? (scrollProgress - 0.3) / 0.15
    : scrollProgress < 0.6
        ? 1
        : Math.max(0, 1 - ((scrollProgress - 0.6) / 0.2));

  const introY = scrollProgress < 0.3
    ? 40
    : scrollProgress < 0.45
      ? 40 - ((scrollProgress - 0.3) / 0.15) * 40
      : scrollProgress < 0.6
        ? 0
        : -((scrollProgress - 0.6) / 0.4) * 150;

  // Container transition
  const containerY = scrollProgress > 0.8 
    ? -((scrollProgress - 0.8) / 0.2) * 100 
    : 0;

  // Stars parallax
  const starOffset = scrollProgress * 120; // Increased for better depth feel

  const scrollIndicatorOpacity = Math.max(0, 1 - scrollProgress * 4);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            backgroundColor: '#050510',
            pointerEvents: 'auto',
            overflow: 'hidden',
            transform: `translateY(${containerY}vh)`,
            transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)'
          }}
        >
          {/* STAR FIELD */}
          <div style={{
            position: 'absolute',
            inset: 0,
            transform: `translateY(${-starOffset}px)`
          }}>
            {stars.map(star => (
              <div
                key={star.id}
                style={{
                  position: 'absolute',
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  borderRadius: '50%',
                  backgroundColor: `rgba(200, 220, 255, ${star.opacity})`,
                  transform: `translateY(${starOffset * star.depth * 0.3}px)`,
                  boxShadow: star.size > 1.5 ? `0 0 ${star.size * 2}px rgba(200, 220, 255, 0.3)` : 'none'
                }}
              />
            ))}
          </div>

          {/* MAIN CONTENT GRID */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gridTemplateRows: isMobile ? '1fr 1fr' : '1fr',
            alignItems: 'center',
            padding: isMobile ? '2rem 1rem' : '0 5%'
          }}>
            {/* LEFT SIDE - INITIAL TEXT (HI THERE, I'M TOSHAN) */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMobile ? 'center' : 'flex-start',
              textAlign: isMobile ? 'center' : 'left',
              gap: '0.75rem',
              paddingLeft: isMobile ? '0' : '4rem',
              opacity: initialTextOpacity,
              transition: 'opacity 0.4s ease-out',
              order: isMobile ? 2 : 1
            }}>
              {/* Oblique line */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 80 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                style={{
                  height: '1px',
                  width: '80px',
                  background: 'linear-gradient(to right, rgba(136, 204, 255, 0.5), transparent)',
                  marginBottom: '1rem',
                  transform: 'rotate(-12deg)',
                  transformOrigin: 'left',
                  display: isMobile ? 'none' : 'block'
                }}
              />

              {/* HI THERE */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{
                  color: '#88ccff',
                  fontSize: '1.125rem',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: 0
                }}
              >
                HI THERE,
              </motion.p>

              {/* I'M TOSHAN */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'flex-start',
                  gap: '1.5rem'
                }}
              >
                <span style={{ color: '#f0f0f0' }}>I'M</span>
                <span style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(136,204,255,0.6) 30%, rgba(255,255,255,0.4) 60%, rgba(136,204,255,0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(136, 204, 255, 0.3)',
                  fontWeight: 700,
                  filter: 'drop-shadow(0 0 15px rgba(136, 204, 255, 0.25))'
                }}>
                  TOSHAN
                </span>
              </motion.h1>

              {/* Role */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                style={{
                  color: 'rgba(136, 204, 255, 0.6)',
                  fontSize: 'clamp(1rem, 2vw, 1.4rem)',
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '0.5rem'
                }}
              >
                <AnimatedRole text={roles[roleIndex]} />
              </motion.div>
            </div>

            {/* RIGHT SIDE - ORB (moves to center on scroll) */}
            <div 
              onClick={handleOrbClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: scrollProgress < 0.3 ? 'auto' : 'none',
                cursor: scrollProgress < 0.3 ? 'pointer' : 'default',
                transform: `translateX(${orbX}vw) translateY(${orbY}vh) scale(${orbScale})`,
                transition: 'transform 0.4s cubic-bezier(0.33, 1, 0.68, 1)',
                order: isMobile ? 1 : 2
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{
                  position: 'relative',
                  width: '280px',
                  height: '280px'
                }}
              >
                {/* Planet glow */}
                <div style={{
                  position: 'absolute',
                  inset: '-40%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(136, 204, 255, 0.12) 0%, transparent 60%)',
                  filter: 'blur(25px)'
                }} />
                
                  {/* Planet body */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  // [OPTIMIZATION] Enhanced Mobile Orb (Depth without Blur)
                  background: isMobile 
                    // Richer mobile gradient: Deep dark blue center -> Lighter blue rim
                    ? 'radial-gradient(circle at 35% 35%, rgba(136, 204, 255, 0.15) 0%, rgba(30, 60, 100, 0.4) 40%, rgba(10, 15, 30, 0.8) 100%)'
                    : 'radial-gradient(circle at 30% 30%, rgba(136, 204, 255, 0.25) 0%, rgba(80, 120, 180, 0.15) 40%, rgba(40, 60, 100, 0.1) 70%, rgba(20, 30, 60, 0.08) 100%)',
                  border: '1px solid rgba(136, 204, 255, 0.15)',
                  boxShadow: isMobile
                    // Fake depth using multiple shadows instead of blur
                    ? 'inset -10px -10px 30px rgba(0,0,0,0.5), inset 5px 5px 15px rgba(136,204,255,0.1), 0 0 25px rgba(136, 204, 255, 0.15)' 
                    : 'inset -15px -15px 50px rgba(0, 0, 0, 0.3), inset 8px 8px 30px rgba(136, 204, 255, 0.08), 0 0 60px rgba(136, 204, 255, 0.1)'
                }} />
                
                {/* Planet rings */}
                <div style={{
                  position: 'absolute',
                  inset: '12%',
                  borderRadius: '50%',
                  border: '1px solid rgba(136, 204, 255, 0.08)'
                }} />
                <div style={{
                  position: 'absolute',
                  inset: '25%',
                  borderRadius: '50%',
                  border: '1px solid rgba(136, 204, 255, 0.05)'
                }} />
                
                {/* Planet highlight */}
                <div style={{
                  position: 'absolute',
                  top: '12%',
                  left: '18%',
                  width: '25%',
                  height: '25%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
                  filter: 'blur(6px)'
                }} />
                
                {/* INTRO LABEL & ARROW */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: scrollProgress < 0.1 ? 1 : 0, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-100px',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {/* Arrow */}
                  <div style={{
                    width: '40px',
                    height: '1px',
                    background: 'rgba(136, 204, 255, 0.6)',
                    position: 'relative'
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: '0',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '0',
                      height: '0',
                      borderTop: '4px solid transparent',
                      borderBottom: '4px solid transparent',
                      borderRight: '6px solid rgba(136, 204, 255, 0.6)'
                    }} />
                  </div>
                  
                  {/* Text */}
                  <span style={{
                    fontFamily: "'SF Mono', monospace",
                    fontSize: '0.8rem',
                    color: 'rgba(136, 204, 255, 0.8)',
                    letterSpacing: '0.1em'
                  }}>
                    INIT SYSTEM
                  </span>
                </motion.div>
              </motion.div>
            </div>

            {/* INTRODUCTION CARD (Centrally Aligned Premium UI) */}
              <div style={{
                position: 'absolute',
                top: isMobile ? '58%' : '50%', // CENTERED (Pushed lower on mobile)
                left: '50%',
                transform: `translate(-50%, -50%) translateY(${introY}px)`,
                width: '90%',
                maxWidth: '580px', // Slightly wider for new bio
                opacity: introOpacity,
                pointerEvents: introOpacity > 0.8 ? 'auto' : 'none',
                zIndex: 100
              }}>
                <TiltWrapper>
                  <motion.div 
                    initial={{ scale: 0.8, filter: 'blur(10px)' }}
                    animate={{ 
                      scale: introOpacity > 0.5 ? 1 : 0.8,
                      filter: introOpacity > 0.5 ? 'blur(0px)' : 'blur(10px)',
                      opacity: [0.9, 1, 0.95, 1] 
                    }}
                    transition={{ 
                      duration: 0.5,
                      opacity: { repeat: Infinity, duration: 2 } 
                    }}
                    style={{
                      background: 'linear-gradient(135deg, rgba(8, 12, 20, 0.9) 0%, rgba(136, 204, 255, 0.05) 100%)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: 'none',
                      borderRadius: '0',
                      padding: isMobile ? '2rem 1.25rem' : '3.5rem 2.5rem',
                      boxShadow: '0 0 40px rgba(136, 204, 255, 0.1), inset 0 0 30px rgba(136, 204, 255, 0.05)',
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Holographic Scanner Line */}
                    <motion.div
                      animate={{ top: ['-10%', '110%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #88ccff, transparent)',
                        boxShadow: '0 0 15px #88ccff',
                        zIndex: 10,
                        opacity: 0.6
                      }}
                    />

                    {/* Tech Grid Overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(rgba(136, 204, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(136, 204, 255, 0.03) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                      pointerEvents: 'none',
                      opacity: 0.5
                    }} />

                    {/* Premium Corner Accents */}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? '30px' : '60px', height: isMobile ? '30px' : '60px', borderTop: '2px solid #88ccff', borderLeft: '2px solid #88ccff' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: isMobile ? '30px' : '60px', height: isMobile ? '30px' : '60px', borderBottom: '2px solid #88ccff', borderRight: '2px solid #88ccff' }} />

                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: '#fff',
                        fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                        fontFamily: "'Orbitron', sans-serif",
                        marginBottom: '1.5rem',
                        letterSpacing: '0.2em',
                        textShadow: '0 0 20px rgba(136, 204, 255, 0.4)',
                        fontWeight: 700
                      }}
                    >
                      PERSONA_DATA.init()
                    </motion.h3>
                    
                    <div style={{ 
                      width: '60px', 
                      height: '2px', 
                      background: 'linear-gradient(90deg, transparent, #88ccff, transparent)', 
                      margin: '0 auto 1.5rem',
                      boxShadow: '0 0 10px #88ccff'
                    }} />

                    <div style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                      lineHeight: 1.8,
                      fontFamily: "'Outfit', sans-serif",
                      marginBottom: '2.5rem',
                      fontWeight: 300,
                      textAlign: 'left'
                    }}>
                      <p style={{ marginBottom: '1rem' }}>
                        I’m Toshan, a Computer Science undergraduate and full-stack developer who enjoys building scalable web applications and solving real-world problems with code. I work primarily with the MERN stack, and I have hands-on experience in backend development, API design, and modern frontend architectures.
                      </p>
                      <p>
                        Alongside full-stack development, I actively explore AI/ML fundamentals and system design, and I enjoy turning complex ideas into clean, user-friendly solutions. I’m constantly learning, experimenting, and pushing my limits to grow as an engineer.
                      </p>
                    </div>
                    
                    {/* Mini Tech Stack with enhanced styling */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      flexWrap: 'wrap',
                      gap: '0.85rem'
                    }}>
                      {['React', 'MERN', 'Node.js', 'API Design', 'System Design'].map(tech => (
                        <motion.span 
                          key={tech} 
                          whileHover={{ scale: 1.1, backgroundColor: 'rgba(136, 204, 255, 0.15)' }}
                          style={{ 
                            fontSize: '0.7rem', 
                            fontFamily: "'Orbitron', sans-serif",
                            letterSpacing: '0.1em',
                            background: 'rgba(136, 204, 255, 0.08)',
                            border: '1px solid rgba(136, 204, 255, 0.3)',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            color: '#88ccff',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </TiltWrapper>
            </div>
          </div>

          {/* Persistent Scroll Indicator */}
          <motion.div 
            style={{ 
              position: 'absolute',
              bottom: isMobile ? '2.5rem' : '4rem',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              opacity: scrollIndicatorOpacity,
              pointerEvents: 'none',
              zIndex: 110
            }}
          >
            {/* Sleek Animated Line Indicator */}
            <div style={{
              width: '1px',
              height: '60px',
              background: 'linear-gradient(to bottom, transparent, rgba(136, 204, 255, 0.4), transparent)',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}>
              <motion.div 
                animate={{ 
                  y: [-60, 60],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '30px',
                  background: 'linear-gradient(to bottom, transparent, #88ccff, transparent)',
                  boxShadow: '0 0 10px #88ccff'
                }} 
              />
            </div>
            <p style={{
              fontSize: '0.6rem',
              color: 'rgba(136, 204, 255, 0.5)',
              letterSpacing: '0.25em',
              fontFamily: "'Orbitron', sans-serif",
              whiteSpace: 'nowrap',
              textTransform: 'uppercase'
            }}>SCROLL TO DIVE IN</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
