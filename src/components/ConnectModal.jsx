import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ConnectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState('request') // 'request' | 'form' | 'success'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    instagram: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Show "Fake Permission" request after 5 seconds
  useEffect(() => {
    const hasConnected = localStorage.getItem('portfolio_connected')
    if (!hasConnected) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send to Discord
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK
      if (webhookUrl) {
        const message = {
          embeds: [{
            title: "👋 New Connection Request!",
            color: 0x00ff88, // Cyber Green
            fields: [
              { name: "Name", value: formData.name, inline: true },
              { name: "Instagram", value: formData.instagram || 'Not provided', inline: true },
              { name: "Email", value: formData.email || 'Not provided', inline: false },
              { name: "Message", value: formData.message || 'No message', inline: false }
            ],
            footer: { text: "Guestbook Entry" },
            timestamp: new Date().toISOString()
          }]
        }

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        })
      }

      localStorage.setItem('portfolio_connected', 'true')
      setStep('success')
      setTimeout(() => {
        setIsOpen(false)
      }, 3000)

    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* TRIGGER BUTTON (Always visible if not open) */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setIsOpen(true); setStep('request'); }}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 60,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backgroundColor: 'rgba(5, 10, 20, 0.6)',
            border: '1px solid rgba(136, 204, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            color: '#88ccff',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(136, 204, 255, 0.1)'
          }}
        >
          👋
        </motion.button>
      )}

      {/* MODAL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(5px)',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'rgba(10, 15, 30, 0.95)',
                border: '1px solid rgba(136, 204, 255, 0.2)',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(136, 204, 255, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* SYSTEM HEADER LINE */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #88ccff, transparent)'
              }} />

              {/* CLOSE BUTTON */}
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.4)',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >✕</button>

              {/* STEP 1: PERMISSION REQUEST */}
              {step === 'request' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '3rem', 
                    marginBottom: '1rem',
                    filter: 'drop-shadow(0 0 10px rgba(136, 204, 255, 0.3))'
                  }}>
                    📡
                  </div>
                  <h3 style={{ 
                    color: '#fff', 
                    fontFamily: "'SF Mono', monospace", 
                    marginBottom: '0.5rem',
                    fontSize: '1.2rem'
                  }}>
                    INCOMING CONNECTION
                  </h3>
                  <p style={{ 
                    color: 'rgba(136, 204, 255, 0.7)', 
                    fontSize: '0.9rem',
                    marginBottom: '2rem',
                    lineHeight: '1.5'
                  }}>
                    External entity detected. Do you wish to identify yourself and establish a persistent link?
                  </p>
                  
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                      onClick={() => setIsOpen(false)}
                      style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: "'SF Mono', monospace",
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      DENY
                    </button>
                    <button
                      onClick={() => setStep('form')}
                      style={{
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        background: 'rgba(136, 204, 255, 0.15)',
                        border: '1px solid rgba(136, 204, 255, 0.3)',
                        color: '#88ccff',
                        fontFamily: "'SF Mono', monospace",
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        boxShadow: '0 0 15px rgba(136, 204, 255, 0.15)'
                      }}
                    >
                      ACCEPT
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: FORM */}
              {step === 'form' && (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <h3 style={{ color: '#fff', fontFamily: "'SF Mono', monospace", marginBottom: '0.5rem' }}>
                    IDENTIFICATION
                  </h3>
                  
                  <input
                    type="text"
                    placeholder="Name / Alias *"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    style={inputStyle}
                  />
                  <input
                    type="text"
                    placeholder="Instagram (@username)"
                    value={formData.instagram}
                    onChange={e => setFormData({...formData, instagram: e.target.value})}
                    style={inputStyle}
                  />
                  <input
                    type="email"
                    placeholder="Email (Optional)"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={inputStyle}
                  />
                  <textarea
                    placeholder="Transmission Message..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '1rem',
                      marginTop: '0.5rem',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, rgba(136, 204, 255, 0.2), rgba(136, 204, 255, 0.1))',
                      border: '1px solid rgba(136, 204, 255, 0.3)',
                      color: '#fff',
                      fontFamily: "'SF Mono', monospace",
                      fontWeight: 'bold',
                      cursor: isSubmitting ? 'wait' : 'pointer',
                      fontSize: '1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isSubmitting ? 'TRANSMITTING...' : 'ESTABLISH LINK'}
                  </button>
                </form>
              )}

              {/* STEP 3: SUCCESS */}
              {step === 'success' && (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ fontSize: '4rem', marginBottom: '1rem' }}
                  >
                    ✅
                  </motion.div>
                  <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>LINK ESTABLISHED</h3>
                  <p style={{ color: 'rgba(136, 204, 255, 0.7)' }}>Transmission successful.</p>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

const inputStyle = {
  width: '100%',
  padding: '0.8rem',
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  color: '#fff',
  fontFamily: "'Inter', sans-serif",
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.3s ease'
}
