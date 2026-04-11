import { create } from 'zustand'

export const useStore = create((set) => ({
  // --- STATE ---
  mode: 'HOME', // 'HOME' | 'SPACE' | 'PLANET'
  spaceProgress: 0, // 0.0 to 1.0
  savedProgress: 0, // Backup of spaceProgress when entering a planet
  activePlanet: null, 
  isTransitioning: false, // LOCK for animations
  theme: 'dark', // 'dark' | 'light'

  // --- ACTIONS ---
  setMode: (mode) => set({ mode }),
  setIsTransitioning: (state) => set({ isTransitioning: state }),
  
  // Update progress ONLY if we are in SPACE mode (Safety check)
  setSpaceProgress: (progress) => set((state) => ({ 
      spaceProgress: state.mode === 'SPACE' ? progress : state.spaceProgress 
  })),

  enterPlanet: (planetData) => set(() => {
    // Calculate progress from planet's Z position
    // Z = lerp(10, -100, progress) => progress = (10 - Z) / 110
    const planetZ = planetData.position[2]
    const planetProgress = Math.max(0, Math.min(1, (10 - planetZ) / 110))
    
    return { 
      isTransitioning: true,
      mode: 'PLANET', 
      activePlanet: planetData,
      spaceProgress: planetProgress, // Sync progress to planet position
      savedProgress: planetProgress  // Exit near this planet
    }
  }),

  exitPlanet: () => set({ 
      isTransitioning: true,
      mode: 'SPACE', 
      activePlanet: null 
  }),

  goHome: () => set({ 
      mode: 'HOME', 
      spaceProgress: 0, 
      savedProgress: 0, 
      activePlanet: null,
      isTransitioning: false,
      isReturningFromSpace: true // Trigger reverse animation
  }),
  
  // Instant home without animation (for navbar click)
  goHomeInstant: () => set({ 
      mode: 'HOME', 
      spaceProgress: 0, 
      savedProgress: 0, 
      activePlanet: null,
      isTransitioning: false,
      isReturningFromSpace: false // NO animation
  }),
  setReturningFromSpace: (val) => set({ isReturningFromSpace: val })
}))
