import { Bell, Search, LogOut } from 'lucide-react';
import Link from 'next/link';
import styles from './Topbar.module.css';
import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

export default function Topbar({ title }) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.actions}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
        </div>
        
        {mounted && (
          <div className={styles.digitalClock}>
            {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        )}

        <div className={styles.notifContainer}>
          <button className={styles.iconBtn} onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell size={20} />
            <span className={styles.badge}></span>
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link href="/profile" className={styles.avatar}>
            {mounted && session?.user ? (
              <img 
                src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`} 
                alt="User Avatar" 
              />
            ) : (
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Guest`} alt="Guest Avatar" />
            )}
          </Link>
          
          {session && (
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              className={styles.iconBtn} 
              title="Sign Out"
              style={{ color: 'var(--danger)', opacity: 0.8 }}
            >
              <LogOut size={20} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
