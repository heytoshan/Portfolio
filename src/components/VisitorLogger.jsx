import { useEffect } from 'react'
import useMobile from '../hooks/useMobile'

export default function VisitorLogger() {
  const isMobile = useMobile()

  useEffect(() => {
    const logVisit = async () => {
      // Check if we've already logged this session
      if (sessionStorage.getItem('visited_logged')) return

      try {
        // --- 1. GATHER DATA ---
        
        // A. Network Identity (IP, ISP, Location)
        const ipRes = await fetch('https://ipapi.co/json/')
        const data = await ipRes.json()
        
        // B. Daily Visitor Count
        let visitCount = 'Unknown'
        try {
          // Use a public counter API keyed by date
          const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
          const countRes = await fetch(`https://api.countapi.xyz/hit/toshan-portfolio/visits-${today}`)
          const countData = await countRes.json()
          visitCount = countData.value || 'Unknown'
        } catch (e) {
          console.warn('Counter API failed', e)
        }
        
        // C. Hardware Fingerprint
        // 1. GPU Renderer (High Entropy)
        const getGPU = () => {
          try {
            const canvas = document.createElement('canvas')
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
            return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown GPU'
          } catch (e) { return 'Unknown GPU' }
        }
        const gpu = getGPU()

        // 2. Connection Info
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
        const connType = connection ? connection.effectiveType : 'Unknown'
        const connSpeed = connection ? `${connection.downlink} Mbps` : 'Unknown'
        
        // 3. System Specs
        const cores = navigator.hardwareConcurrency || 'Unknown'
        const ram = navigator.deviceMemory ? `~${navigator.deviceMemory} GB` : 'Unknown'
        const screenRes = `${window.screen.width}x${window.screen.height}`
        const pixelRatio = window.devicePixelRatio || 1
        
        // 4. Battery (Async)
        let batteryInfo = 'Unknown'
        try {
          if (navigator.getBattery) {
            const battery = await navigator.getBattery()
            const level = Math.round(battery.level * 100) + '%'
            const charging = battery.charging ? '⚡ Charging' : '🔋 Battery'
            batteryInfo = `${level} (${charging})`
          }
        } catch (e) {}

        // 5. Software
        const ua = navigator.userAgent
        const language = navigator.language
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const platform = navigator.platform

        // --- 2. FORMAT DISCORD MESSAGE (CLEAN HACKER THEME) ---
        const message = {
          embeds: [{
            title: "🕵️ VISITOR ANALYSIS REPORT",
            color: 0x00ff00,
            fields: [
              { name: "📍 Location", value: `\`${data.city || '?'}, ${data.region || '?'}, ${data.country_name || '?'}\``, inline: true },
              { name: "🔋 Battery", value: `\`${batteryInfo}\``, inline: true },
              { name: "🌐 Connection", value: `\`${connType} (${connSpeed})\``, inline: true },
              { name: "🛠️ Platform", value: `\`${platform} | ${language} | ${timeZone}\``, inline: false }
            ],
            footer: { text: `Target Environment: ${isMobile ? 'MOBILE' : 'DESKTOP'}` },
            timestamp: new Date().toISOString()
          }]
        }

        // --- 3. SEND WEBHOOK ---
        const webhookUrl = "https://discord.com/api/webhooks/1495391384960499787/kGenDPVUjFa71EAZerGTVl0g_yOC25J9Mzs6zZfPvO_rmWWxpO593JEM1v09dPWiJqug" ||import.meta.env.VITE_DISCORD_WEBHOOK
        
        if (webhookUrl) {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          })
          
          sessionStorage.setItem('visited_logged', 'true')
          console.log('Target logged.')
        }

      } catch (error) {
        console.error('Logger Error:', error)
      }
    }

    logVisit()
  }, [])

  return null
}
