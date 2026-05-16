import { create } from 'zustand';

export const useTimerStore = create((set, get) => ({
  focusDuration: 25 * 60,
  breakDuration: 5 * 60,
  timeLeft: 25 * 60,
  isActive: false,
  mode: 'focus', // 'focus' or 'break'
  
  setDuration: (mode, minutes) => set((state) => {
    const newSeconds = Math.max(1, minutes) * 60; // Minimum 1 minute
    if (mode === 'focus') {
      return { 
        focusDuration: newSeconds, 
        timeLeft: state.mode === 'focus' && !state.isActive ? newSeconds : state.timeLeft 
      };
    } else {
      return { 
        breakDuration: newSeconds, 
        timeLeft: state.mode === 'break' && !state.isActive ? newSeconds : state.timeLeft 
      };
    }
  }),
  
  startTimer: () => set({ isActive: true }),
  pauseTimer: () => set({ isActive: false }),
  resetTimer: () => set((state) => ({ 
    isActive: false, 
    timeLeft: state.mode === 'focus' ? state.focusDuration : state.breakDuration 
  })),
  
  setMode: (newMode) => set((state) => ({ 
    mode: newMode, 
    timeLeft: newMode === 'focus' ? state.focusDuration : state.breakDuration,
    isActive: false 
  })),
  
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
