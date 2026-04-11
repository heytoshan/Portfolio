import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import useMobile from '../hooks/useMobile';

const COMMANDS = [
  { id: 'nav-home', label: 'NAVIGATE: HOME', shortcut: 'H', action: 'HOME' },
  { id: 'nav-about', label: 'NAVIGATE: ABOUT_PLANET', shortcut: 'A', action: 'ABOUT' },
  { id: 'nav-skills', label: 'NAVIGATE: SKILLS_PLANET', shortcut: 'S', action: 'SKILLS' },
  { id: 'nav-projects', label: 'NAVIGATE: PROJECTS_PLANET', shortcut: 'P', action: 'PROJECTS' },
  { id: 'nav-resume', label: 'NAVIGATE: RESUME_PLANET', shortcut: 'R', action: 'RESUME' },
  { id: 'sys-diagnostics', label: 'SYSTEM: TOGGLE_DIAGNOSTICS', shortcut: 'D', action: 'DIAGNOSTICS' },
  { id: 'sys-theme', label: 'SYSTEM: TOGGLE_COLOR_PHASE', shortcut: 'T', action: 'THEME' },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const isMobile = useMobile();
  
  const { mode, enterPlanet, exitPlanet, goHomeInstant, toggleTheme } = useStore();

  const filteredCommands = COMMANDS.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const executeCommand = (cmd) => {
    setIsOpen(false);
    
    switch (cmd.action) {
      case 'HOME':
        goHomeInstant();
        break;
      case 'ABOUT':
        executeNav({ position: [0, 0, 0], name: 'ABOUT', type: 'GLASS', color: '#88ccff' });
        break;
      case 'SKILLS':
        executeNav({ position: [-2, 1, -15], name: 'SKILLS', type: 'MERCURY', color: '#ffaa00' });
        break;
      case 'PROJECTS':
        executeNav({ position: [2, -1, -30], name: 'PROJECTS', type: 'MARS', color: '#ff4400' });
        break;
      case 'RESUME':
        executeNav({ position: [0, 0, -45], name: 'RESUME', type: 'RESUME', color: '#aa44ff' });
        break;
      case 'DIAGNOSTICS':
        // Future: toggle a diagnostics overlay
        break;
      case 'THEME':
        toggleTheme();
        break;
      default:
        break;
    }
  };

  const executeNav = (planetData) => {
    if (mode === 'PLANET') exitPlanet();
    setTimeout(() => {
        useStore.getState().setMode('SPACE');
        enterPlanet(planetData);
    }, mode === 'PLANET' ? 600 : 0);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex]);
      }
    }
  };

  // Exposed trigger for mobile icon
  useEffect(() => {
    window.toggleCommandPalette = () => setIsOpen(prev => !prev);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            style={{
              width: '100%',
              maxWidth: '500px',
              background: 'rgba(10, 10, 12, 0.95)',
              border: '1px solid rgba(136, 204, 255, 0.3)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(136, 204, 255, 0.1)',
              borderRadius: '0',
              overflow: 'hidden',
              fontFamily: "'Orbitron', sans-serif"
            }}
          >
            {/* Header / Search */}
            <div style={{
              padding: '1.25rem',
              borderBottom: '1px solid rgba(136, 204, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ color: '#88ccff', fontSize: '0.8rem', opacity: 0.8 }}>{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="SYSTEM_COMMANDS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleInputKeyDown}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  width: '100%',
                  fontSize: '0.9rem',
                  letterSpacing: '0.1em',
                  fontFamily: "'Orbitron', sans-serif"
                }}
              />
              <div style={{
                fontSize: '0.6rem',
                color: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                ESC
              </div>
            </div>

            {/* Command List */}
            <div style={{
              maxHeight: '300px',
              overflowY: 'auto',
              padding: '0.5rem'
            }}>
              {filteredCommands.length > 0 ? filteredCommands.map((cmd, idx) => (
                <div
                  key={cmd.id}
                  onClick={() => executeCommand(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: selectedIndex === idx ? 'rgba(136, 204, 255, 0.1)' : 'transparent',
                    borderLeft: `2px solid ${selectedIndex === idx ? '#88ccff' : 'transparent'}`,
                    transition: 'all 0.1s ease'
                  }}
                >
                  <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.05em',
                    color: selectedIndex === idx ? '#fff' : 'rgba(255, 255, 255, 0.6)'
                  }}>
                    {cmd.label}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{
                      fontSize: '0.6rem',
                      color: 'rgba(136, 204, 255, 0.5)',
                      fontFamily: 'monospace'
                    }}>
                      [{cmd.shortcut}]
                    </span>
                  </div>
                </div>
              )) : (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontSize: '0.7rem'
                }}>
                  NO_COMMANDS_FOUND
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderTop: '1px solid rgba(136, 204, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.55rem',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.05em'
            }}>
              <span>USE ARROW KEYS & ENTER TO NAVIGATE</span>
              <span>VER_1.0.4_HUD</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
