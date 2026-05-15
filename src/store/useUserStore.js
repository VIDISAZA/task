import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      profile: {
        name: 'Felix',
        email: 'felix@example.com',
        avatarSeed: 'Felix',
        birthDate: '2000-01-01',
        bio: 'Leveling up my life one task at a time. Currently focusing on launching the new marketing campaign and maintaining my daily reading habit.',
        notifications: true,
        darkMode: true,
      },
      updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
      })),
      logout: () => set({
        profile: {
          name: 'Guest',
          email: '',
          avatarSeed: 'Guest',
          birthDate: '',
          bio: 'Welcome to Arion.',
          notifications: false,
          darkMode: true,
        }
      })
    }),
    {
      name: 'arion-user-storage', // saves to localStorage so settings persist across reloads
    }
  )
);
