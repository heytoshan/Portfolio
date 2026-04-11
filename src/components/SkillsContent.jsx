import React, { useRef, useMemo } from 'react'
import BackButton from './BackButton'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import useMobile from '../hooks/useMobile'
import TiltWrapper from './TiltWrapper'

// --- SKILLS DATA ---
const SKILLS = [
  { category: 'LANGUAGE', items: ['C', 'C++', 'JavaScript', 'TypeScript', 'Python', 'Java'], status: 'OPTIMIZED' },
  { category: 'FRAMEWORK', items: ['React.js', 'Next.js', 'Vite', 'Three.js'], status: 'STABLE' },
  { category: 'BACKEND', items: ['Node.js', 'Express.js', 'FastAPI'], status: 'ACTIVE' },
  { category: 'DATABASE', items: ['MongoDB', 'SQL', 'PostgreSQL', 'Redis'], status: 'SYNCED' },
  { category: 'TOOLS', items: ['Git', 'Postman', 'Docker', 'Vercel', 'AWS'], status: 'READY' },
  { category: 'DSA', items: ['Data Structures', 'Algorithms'], status: 'CORE' },
  { category: 'AI', items: ['Foundational Concepts', 'Prompt Engineering'], status: 'EVOLVING' }
]

export default function SkillsContent() {
  const mode = useStore(state => state.mode)
  const activePlanet = useStore(state => state.activePlanet)
  const containerRef = useRef(null)
  const listRef = useRef(null)
  const isMobile = useMobile()
  const [scrollProgress, setScrollProgress] = React.useState(0)

  const isVisible = mode === 'PLANET' && activePlanet?.name === 'SKILLS'

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: isMobile ? 'auto' : 0, 
        bottom: 0,
        left: 0,
        width: '100%',
        height: isMobile ? '80vh' : '100vh',
        overflow: 'hidden',
        zIndex: 50,
        pointerEvents: 'auto',
        paddingTop: isMobile ? '4rem' : '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: isMobile ? 'rgba(10, 26, 44, 0.85)' : 'transparent',
        backdropFilter: isMobile ? 'blur(20px)' : 'none',
        borderTop: isMobile ? '1px solid rgba(86, 129, 162, 0.3)' : 'none',
        borderRadius: isMobile ? '32px 32px 0 0' : '0',
      }}
    >
        <style>
            {`
                .list-area::-webkit-scrollbar {
                  display: none;
                }
                .list-area {
                  ms-overflow-style: none;
                  scrollbar-width: none;
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { opacity: 0.1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }

                @keyframes pulse-glow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }

                @keyframes scroll-bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-10px); }
                    60% { transform: translateY(-5px); }
                }

                .diagnostic-container {
                    position: relative;
                    width: 100%;
                    max-width: 900px;
                    padding: 2rem 1rem;
                }

                .power-line {
                    position: absolute;
                    left: ${isMobile ? '30px' : '50%'};
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: linear-gradient(to bottom, 
                        rgba(136, 204, 255, 0), 
                        rgba(230, 235, 239, 0.4) 15%, 
                        rgba(136, 204, 255, 0.4) 85%, 
                        rgba(136, 204, 255, 0)
                    );
                    transform: ${isMobile ? 'none' : 'translateX(-50%)'};
                    z-index: 1;
                }

                .power-line::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 60px;
                    background: #88ccff;
                    filter: blur(8px);
                    animation: scanline 4s infinite linear;
                }

                .node-connector {
                    position: relative;
                    display: flex;
                    align-items: center;
                    margin-bottom: 3rem;
                    z-index: 2;
                    width: 100%;
                    flex-direction: ${isMobile ? 'row' : 'row'};
                    justify-content: ${isMobile ? 'flex-start' : 'center'};
                }

                .node-point {
                    width: 14px;
                    height: 14px;
                    background: #0a0f19;
                    border: 2px solid #88ccff;
                    border-radius: 50%;
                    margin-left: ${isMobile ? '23px' : '0'};
                    margin-right: ${isMobile ? '1rem' : '0'};
                    flex-shrink: 0;
                    position: absolute;
                    left: ${isMobile ? 'auto' : '50%'};
                    transform: ${isMobile ? 'none' : 'translateX(-50%)'};
                    box-shadow: 0 0 15px rgba(136, 204, 255, 0.6);
                    z-index: 3;
                }

                .node-point::after {
                    content: '';
                    position: absolute;
                    inset: -5px;
                    border-radius: 50%;
                    border: 1px solid #88ccff;
                    animation: pulse-glow 2s infinite ease-in-out;
                }

                .node-content {
                    width: ${isMobile ? 'auto' : '400px'};
                    flex: ${isMobile ? '1' : 'none'};
                    padding: 1.25rem;
                    background: ${isMobile ? 'rgba(58, 71, 82, 0.35)' : 'rgba(136, 204, 255, 0.08)'};
                    border: 1px solid rgba(136, 204, 255, 0.5);
                    border-radius: 12px;
                    backdrop-filter: blur(25px);
                    position: relative;
                    transition: all 0.3s ease;
                    margin-left: ${isMobile ? '60px' : '0'};
                    margin-right: ${isMobile ? '10px' : '0'};
                    box-shadow: ${isMobile ? '0 10px 40px rgba(0, 0, 0, 0.4)' : '0 10px 40px rgba(0, 0, 0, 0.3)'};
                }

                .node-content:hover {
                    background: rgba(136, 204, 255, 0.15);
                    border-color: rgba(136, 204, 255, 0.5);
                    box-shadow: 0 0 50px rgba(136, 204, 255, 0.15);
                }

                .node-content.left {
                    margin-right: ${isMobile ? '0' : '480px'};
                    text-align: ${isMobile ? 'left' : 'right'};
                }

                .node-content.right {
                    margin-left: ${isMobile ? '2rem' : '480px'};
                    text-align: left;
                }

                /* Decorative line connecting node to point on desktop */
                .node-content::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 60px;
                    height: 1px;
                    background: linear-gradient(to right, transparent, rgba(136, 204, 255, 0.3));
                    display: ${isMobile ? 'none' : 'block'};
                }

                .node-content.left::before {
                    right: -60px;
                    background: linear-gradient(to right, rgba(136, 204, 255, 0.3), transparent);
                }

                .node-content.right::before {
                    left: -60px;
                    background: linear-gradient(to left, rgba(136, 204, 255, 0.3), transparent);
                }

                .diagnostic-header {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 0.75rem;
                    justify-content: inherit;
                }

                .category-label {
                    font-family: "'Orbitron', sans-serif";
                    font-size: 0.9rem;
                    color: #88ccff;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    font-weight: 700;
                }

                .status-tag {
                    font-family: 'monospace';
                    font-size: 0.65rem;
                    background: rgba(136, 204, 255, 0.1);
                    color: rgba(136, 204, 255, 0.8);
                    padding: 1px 6px;
                    border: 1px solid rgba(136, 204, 255, 0.3);
                    border-radius: 4px;
                }

                .skill-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.75rem;
                    justify-content: inherit;
                }

                .skill-item {
                    font-family: "'Outfit', sans-serif";
                    font-size: 0.9rem;
                    color: rgba(255, 255, 255, 0.95);
                    position: relative;
                    padding: 5px 14px;
                    background: rgba(255, 255, 255, 0.12);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                }

                .skill-item:hover {
                    color: #fff;
                    background: rgba(136, 204, 255, 0.2);
                    border-color: rgba(136, 204, 255, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 0 10px rgba(136, 204, 255, 0.3);
                }

                /* Custom Sci-Fi Scrollbar - Disabled on Desktop for clean indicator */
                .list-area::-webkit-scrollbar {
                  width: ${isMobile ? '6px' : '0'};
                }
                .list-area::-webkit-scrollbar-track { 
                    background: transparent;
                }
                .list-area::-webkit-scrollbar-thumb {
                  background: rgba(136, 204, 255, 0.3);
                  border-radius: 3px;
                }

            `}
        </style>

        {/* Diagnostic Metadata Header (Simplified) */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
                marginBottom: isMobile ? '2rem' : '4rem', 
                textAlign: 'center', 
                zIndex: 10, 
                width: '100%',
                maxWidth: '600px'
            }}
        >
            <div style={{
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                color: '#0877cbff',
                letterSpacing: '0.3em',
                marginBottom: '0.5rem',
                opacity: 0.8,
                textAlign: 'center'
            }}>
                SYSTEM.CORE.ARSENAL_v2.1
            </div>
            <div style={{
                height: '1.5px',
                width: '120px',
                background: 'linear-gradient(90deg, transparent, #88ccff, transparent)',
                margin: '1rem auto 0 auto'
            }} />
        </motion.div>

        {/* Scrollable List Area */}
        <div 
          className="list-area" 
          ref={listRef}
          onScroll={(e) => {
            const { scrollTop, scrollHeight, clientHeight } = e.target
            const progress = scrollTop / (scrollHeight - clientHeight)
            setScrollProgress(progress)
          }}
          style={{
            flex: 1,
            width: '100%',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '8rem',
            paddingRight: isMobile ? '0' : '40px', 
          }}
        >
            <div className="diagnostic-container">
                <div className="power-line" />
                
                {SKILLS.map((set, idx) => {
                    const isEven = idx % 2 === 0
                    return (
                        <motion.div 
                            key={set.category}
                            className="node-connector"
                            initial={{ opacity: 0, x: isEven && !isMobile ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                        >
                            <div className="node-point" />
                            <TiltWrapper>
                                <div className={`node-content ${!isMobile ? (isEven ? 'left' : 'right') : 'right'}`}>
                                    <div className="diagnostic-header">
                                        <span className="category-label">{set.category}</span>
                                        <span className="status-tag">{set.status}</span>
                                    </div>
                                    <div className="skill-list">
                                        {set.items.map((skill, sIdx) => (
                                            <div 
                                                key={skill}
                                                className="skill-item"
                                            >
                                                {skill}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TiltWrapper>
                        </motion.div>
                    )
                })}
            </div>
        </div>


        {/* Persistent Scroll Progress Indicator (Big Screen Only) */}
        {!isMobile && (
            <div style={{
                position: 'fixed',
                right: '40px',
                top: '50%',
                transform: 'translateY(-50%)',
                height: '300px',
                width: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-end',
                pointerEvents: 'none',
                zIndex: 60
            }}>
                <div style={{
                    fontFamily: 'monospace',
                    fontSize: '0.6rem',
                    color: '#88ccff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2rem',
                    marginBottom: '1rem',
                    opacity: 0.6
                }}>
                    Data_Feed.Pos
                </div>
                
                <div style={{
                    height: '200px',
                    width: '1px',
                    background: 'rgba(136, 204, 255, 0.15)',
                    position: 'relative',
                    right: '10px'
                }}>
                    {/* Active Track */}
                    <motion.div 
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: -1,
                            width: '3px',
                            height: '40px',
                            background: '#88ccff',
                            boxShadow: '0 0 10px #88ccff',
                            y: scrollProgress * 160 // 200 - 40
                        }}
                    />
                    
                    {/* Markers */}
                    {[0, 0.25, 0.5, 0.75, 1].map(m => (
                        <div key={m} style={{
                            position: 'absolute',
                            top: `${m * 100}%`,
                            right: '-5px',
                            width: '4px',
                            height: '1px',
                            background: 'rgba(136, 204, 255, 0.4)'
                        }} />
                    ))}
                </div>

                <div style={{
                    marginTop: '1.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: '#88ccff',
                    opacity: 0.8
                }}>
                    {Math.round(scrollProgress * 100)}%
                </div>
            </div>
        )}

        {/* Global indicator for mobile - simplified */}
        {isMobile && (
             <div style={{
                position: 'fixed',
                bottom: '2rem',
                left: '2rem',
                zIndex: 100,
                fontFamily: 'monospace',
                fontSize: '0.7rem',
                color: '#51aef5ff',
                background: 'rgba(10, 15, 25, 0.63)',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(136, 204, 255, 0.2)'
             }}>
                PAGE_{Math.round(scrollProgress * 100)}PCT
             </div>
        )}
    </div>
  )
}
