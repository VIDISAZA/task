'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Clock, BarChart2, Settings, Info } from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/focus', icon: Clock, label: 'Focus' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
];

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <Link href="/about" className={styles.logo}>
        <div className={styles.logoIcon}>A</div>
        <span className={styles.logoText}>Arion</span>
      </Link>
      
      <nav className={styles.nav}>
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link 
            key={href}
            href={href} 
            className={`${styles.navItem} ${pathname === href ? styles.active : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}
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
