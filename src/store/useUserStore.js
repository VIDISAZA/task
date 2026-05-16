import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      profile: {
        name: 'User',
        email: '',
        avatarSeed: 'User',
        birthDate: '',
        bio: 'Welcome to Arion! Set up your profile to get started.',
        notifications: true,
        darkMode: false, // Default to light mode (Craft-inspired)
        initialized: false,
      },
      
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),

      // Initialize profile from session data (first login)
      initFromSession: (sessionUser) => {
        const current = get().profile;
        // Only initialize if not already done
        if (!current.initialized && sessionUser) {
          set({
            profile: {
              ...current,
              name: sessionUser.name || current.name,
              email: sessionUser.email || current.email,
              avatarSeed: sessionUser.image || sessionUser.name || current.avatarSeed,
              initialized: true,
            }
          });
        }
      },

      logout: () => set({
        profile: {
          name: 'User',
          email: '',
          avatarSeed: 'User',
          birthDate: '',
          bio: 'Welcome to Arion!',
          notifications: true,
          darkMode: false,
          initialized: false,
        }
      })
    }),
    {
      name: 'arion-user-storage',
    }
  )
);
