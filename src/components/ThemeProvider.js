'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export default function ThemeProvider({ children }) {
  const { profile } = useUserStore();

  useEffect(() => {
    // Check local profile setting for dark mode and apply to HTML tag
    if (profile.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [profile.darkMode]);

  return <>{children}</>;
}
