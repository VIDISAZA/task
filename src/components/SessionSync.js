'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/store/useUserStore';

/**
 * SessionSync — Automatically initializes user profile from session data
 * on first login. Runs silently in the background.
 */
export default function SessionSync() {
  const { data: session } = useSession();
  const { initFromSession } = useUserStore();

  useEffect(() => {
    if (session?.user) {
      initFromSession(session.user);
    }
  }, [session, initFromSession]);

  return null; // This component renders nothing
}
