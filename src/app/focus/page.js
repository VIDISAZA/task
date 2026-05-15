'use client';
import { useEffect, useRef } from 'react';
import Topbar from '@/components/Topbar';
import styles from './page.module.css';
import { useTimerStore } from '@/store/useTimerStore';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

export default function FocusPage() {
  const { timeLeft, isActive, mode, startTimer, pauseTimer, resetTimer, setMode, tick, logSession } = useTimerStore();
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      pauseTimer();
      // Only log focus sessions, not breaks
      if (mode === 'focus') {
        logSession(25);
        alert('Focus session completed! Great job.');
      }
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft, mode, tick, pauseTimer, logSession]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'focus' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div>
      <Topbar title="Focus Timer" />
      
      <div className={styles.container}>
        <div className={styles.timerCard}>
          <div className={styles.modeTabs}>
            <button 
              className={`${styles.modeTab} ${mode === 'focus' ? styles.active : ''}`}
              onClick={() => setMode('focus')}
            >
              <Zap size={16} /> Focus
            </button>
            <button 
              className={`${styles.modeTab} ${mode === 'break' ? styles.active : ''}`}
              onClick={() => setMode('break')}
            >
              <Coffee size={16} /> Short Break
            </button>
          </div>

          <div className={styles.timerDisplayWrapper}>
            {/* SVG Circle Progress */}
            <svg className={styles.progressRing} width="300" height="300">
              <circle
                className={styles.progressRingCircleBg}
                stroke="var(--border)"
                strokeWidth="8"
                fill="transparent"
                r="140"
                cx="150"
                cy="150"
              />
              <circle
                className={styles.progressRingCircle}
                stroke={mode === 'focus' ? 'var(--primary)' : 'var(--success)'}
                strokeWidth="8"
                fill="transparent"
                r="140"
                cx="150"
                cy="150"
                strokeDasharray={2 * Math.PI * 140}
                strokeDashoffset={2 * Math.PI * 140 - (progress / 100) * 2 * Math.PI * 140}
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className={styles.timeText}>{formatTime(timeLeft)}</div>
          </div>

          <div className={styles.controls}>
            {isActive ? (
              <button className={`${styles.controlBtn} ${styles.pauseBtn}`} onClick={pauseTimer}>
                <Pause size={24} /> Pause
              </button>
            ) : (
              <button className={`${styles.controlBtn} ${styles.startBtn}`} onClick={startTimer}>
                <Play size={24} /> Start
              </button>
            )}
            
            <button className={`${styles.controlBtn} ${styles.resetBtn}`} onClick={resetTimer}>
              <RotateCcw size={24} />
            </button>
          </div>
        </div>

        <div className="glass-panel" style={{ marginTop: '2rem' }}>
           <h3>Why focus matters?</h3>
           <p style={{ opacity: 0.8, marginTop: '0.5rem' }}>Arion suggests that taking 5-minute breaks between 25-minute focus sessions can increase your productivity by 40% and prevent burnout.</p>
        </div>
      </div>
    </div>
  );
}
