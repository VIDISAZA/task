'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Clock, BarChart2, Settings } from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className={styles.sidebar}>
      <Link href="/about" className={styles.logo} style={{ textDecoration: 'none' }}>
        <div className={styles.logoIcon} style={{ background: 'linear-gradient(135deg, #a855f7, #d8b4fe)' }}>A</div>
        <span className="gradient-text" style={{ background: 'linear-gradient(135deg, #a855f7, #d8b4fe)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: 900 }}>Arion</span>
      </Link>
      
      <nav className={styles.nav}>
        <Link href="/" className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/tasks" className={`${styles.navItem} ${pathname === '/tasks' ? styles.active : ''}`}>
          <CheckSquare size={20} />
          <span>Tasks</span>
        </Link>
        <Link href="/focus" className={`${styles.navItem} ${pathname === '/focus' ? styles.active : ''}`}>
          <Clock size={20} />
          <span>Focus Timer</span>
        </Link>
        <Link href="/analytics" className={`${styles.navItem} ${pathname === '/analytics' ? styles.active : ''}`}>
          <BarChart2 size={20} />
          <span>Analytics</span>
        </Link>
      </nav>

      <div className={styles.bottomNav}>
        <Link href="/settings" className={`${styles.navItem} ${pathname === '/settings' ? styles.active : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
