'use client';
import { Bell, Search, LogOut, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import styles from './Topbar.module.css';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useUserStore } from '@/store/useUserStore';

export default function Topbar({ title }) {
  const { data: session } = useSession();
  const { profile, updateProfile } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    updateProfile({ darkMode: !profile.darkMode });
  };

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.actions}>
        {/* Real-time Clock — Large & Prominent */}
        {mounted && (
          <div className={styles.clockContainer}>
            <div className={styles.clockTime}>
              {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className={styles.clockDate}>
              {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search..." className={styles.searchInput} />
        </div>

        {/* Theme Toggle */}
        {mounted && (
          <button 
            className={styles.iconBtn} 
            onClick={toggleTheme} 
            title={profile.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {profile.darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        )}

        {/* Notifications */}
        <div className={styles.notifContainer}>
          <button className={styles.iconBtn} onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell size={18} />
            <span className={styles.notifBadge}></span>
          </button>
          
          {isNotifOpen && (
            <div className={styles.notifDropdown}>
              <div className={styles.notifHeader}>
                <h4>Notifications</h4>
              </div>
              <div className={styles.notifList}>
                <div className={styles.notifItem}>
                  <div className={styles.notifDot}></div>
                  <div>
                    <p><strong>Arion</strong> rescheduled 2 overdue tasks for today.</p>
                    <span className={styles.notifTime}>Just now</span>
                  </div>
                </div>
                <div className={styles.notifItem}>
                  <div className={styles.notifDot} style={{ background: 'var(--success)' }}></div>
                  <div>
                    <p>You completed a 25-minute focus session. Great job!</p>
                    <span className={styles.notifTime}>2 hours ago</span>
                  </div>
                </div>
                <div className={styles.notifItem}>
                  <div className={styles.notifDot} style={{ background: 'var(--warning)' }}></div>
                  <div>
                    <p>Don't forget to review your Eisenhower Matrix today.</p>
                    <span className={styles.notifTime}>Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* User Avatar + Logout */}
        <div className={styles.userSection}>
          <Link href="/profile" className={styles.avatar}>
            {mounted && session?.user ? (
              <img 
                src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name || 'User'}`} 
                alt="Avatar" 
                width={36}
                height={36}
              />
            ) : (
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" 
                alt="Guest" 
                width={36}
                height={36}
              />
            )}
          </Link>
          
          {session && (
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              className={styles.logoutBtn} 
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
