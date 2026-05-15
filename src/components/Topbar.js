import { Bell, Search } from 'lucide-react';
import Link from 'next/link';
import styles from './Topbar.module.css';
import { useUserStore } from '@/store/useUserStore';
import { useEffect, useState } from 'react';

export default function Topbar({ title }) {
  const { profile } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  return (
    <header className={styles.topbar}>
      <h1 className={styles.title}>{title}</h1>
      
      <div className={styles.actions}>
        <div className={styles.searchBar}>
          <Search size={18} className={styles.searchIcon} />
          <input type="text" placeholder="Search tasks..." className={styles.searchInput} />
        </div>
        
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
        
        <Link href="/profile" className={styles.avatar}>
          {mounted && (
            <img 
              src={profile.avatarSeed?.startsWith('data:image') ? profile.avatarSeed : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed}`} 
              alt="User Avatar" 
            />
          )}
        </Link>
      </div>
    </header>
  );
}
