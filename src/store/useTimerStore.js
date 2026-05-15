import { create } from 'zustand';

export const useTimerStore = create((set, get) => ({
  timeLeft: 25 * 60, // 25 minutes default
  isActive: false,
  mode: 'focus', // 'focus' or 'break'
  
  startTimer: () => set({ isActive: true }),
  pauseTimer: () => set({ isActive: false }),
  resetTimer: () => set((state) => ({ 
    isActive: false, 
    timeLeft: state.mode === 'focus' ? 25 * 60 : 5 * 60 
  })),
  
  setMode: (newMode) => set({ 
    mode: newMode, 
    timeLeft: newMode === 'focus' ? 25 * 60 : 5 * 60,
    isActive: false 
  }),
  
  tick: () => set((state) => {
    if (state.timeLeft <= 0) {
      return { isActive: false, timeLeft: 0 };
    }
    return { timeLeft: state.timeLeft - 1 };
  }),

  logSession: async (durationMinutes) => {
    try {
      await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationMinutes }),
      });
    } catch (err) {
      console.error('Failed to log session', err);
    }
  }
}));
