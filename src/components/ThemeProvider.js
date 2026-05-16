'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function ThemeProvider({ children }) {
  const { profile } = useUserStore();

  useEffect(() => {
    const theme = profile.darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    
    // Also store in localStorage for anti-flicker script
    try {
      localStorage.setItem('arion-theme', theme);
    } catch (e) { /* ignore */ }
  }, [profile.darkMode]);

  // On first mount, apply theme from localStorage immediately to prevent flicker
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('arion-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch (e) { /* ignore */ }
  }, []);

  return <>{children}</>;
}
