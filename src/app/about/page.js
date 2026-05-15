'use client';
import styles from './page.module.css';
import Link from 'next/link';
import { Target, Zap, Clock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className={styles.landingContainer}>
      {/* Blurred Background Orbs linked to Theme Variables */}
      <div className={styles.glowPrimary}></div>
      <div className={styles.glowSecondary}></div>
      <div className={styles.glowAccent}></div>

      {/* Navbar integrated into the page */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>A</div>
          ARION
        </div>
      </nav>

      {/* Hero Content */}
      <div className={styles.hero}>
        <h1 className={styles.welcome}>MEET ARION</h1>
        <p className={styles.desc}>
          More than a to-do list.
        </p>
        <Link href="/" className={styles.btn}>
          OPEN DASHBOARD
        </Link>
      </div>

      {/* Highlight Features */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <Target size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3>Smart Priority</h3>
          <p>AI automatically sorts your tasks based on urgency, importance, and deadlines.</p>
        </div>
        <div className={styles.featureCard}>
          <Clock size={24} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
          <h3>Focus Timer</h3>
          <p>Built-in Pomodoro timer seamlessly logs your deep work sessions to your analytics.</p>
        </div>
        <div className={styles.featureCard}>
          <Zap size={24} color="var(--warning)" style={{ marginBottom: '1rem' }} />
          <h3>Auto-Reschedule</h3>
          <p>Missed a task? Arion catches overdue items and intelligently reschedules them for you.</p>
        </div>
      </div>
    </div>
  );
}
