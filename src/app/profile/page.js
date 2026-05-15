'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import styles from './page.module.css';
import { Target, Clock, Zap, Star, Flame, Trophy, Lock, Moon, CheckSquare, Calendar, Activity } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

const getZodiac = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // 1-12
  
  if ((month == 1 && day <= 19) || (month == 12 && day >= 22)) return { sign: 'Capricorn', emoji: '♑' };
  if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return { sign: 'Aquarius', emoji: '♒' };
  if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return { sign: 'Pisces', emoji: '♓' };
  if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return { sign: 'Aries', emoji: '♈' };
  if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return { sign: 'Taurus', emoji: '♉' };
  if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return { sign: 'Gemini', emoji: '♊' };
  if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return { sign: 'Cancer', emoji: '♋' };
  if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return { sign: 'Leo', emoji: '♌' };
  if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return { sign: 'Virgo', emoji: '♍' };
  if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return { sign: 'Libra', emoji: '♎' };
  if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return { sign: 'Scorpio', emoji: '♏' };
  if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return { sign: 'Sagittarius', emoji: '♐' };
  return null;
};

export default function ProfilePage() {
  const { profile } = useUserStore();
  const [stats, setStats] = useState({ focusHours: 0, completedTasks: 0, bestStreak: 0 });
  const [mounted, setMounted] = useState(false);

  // Helper to get image source
  const getAvatarSrc = () => {
    if (!profile.avatarSeed) return `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`;
    return profile.avatarSeed.startsWith('data:image') 
      ? profile.avatarSeed 
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.avatarSeed}`;
  };

  useEffect(() => {
    setMounted(true);
    // Fetch real stats to display on profile
    fetch('/api/stats')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          const totalHours = resData.data.chartData?.reduce((acc, curr) => acc + curr.hours, 0) || 0;
          setStats({
            focusHours: totalHours.toFixed(1),
            completedTasks: resData.data.completionRate?.completed || 0,
            bestStreak: 3 // Hardcoded or calculated
          });
        }
      });
  }, []);

  return (
    <div>
      <Topbar title="My Profile" />
      
      <div className={styles.container}>
        {/* Main Profile Card */}
        <div className={styles.profileCard}>
          <div 
            className={styles.banner} 
            style={mounted ? { backgroundImage: `url(${getAvatarSrc()})` } : {}}
          >
            {/* Animated Task Management Background Elements */}
            <CheckSquare size={48} className={`${styles.floatingElement} ${styles.float1}`} />
            <Clock size={64} className={`${styles.floatingElement} ${styles.float2}`} />
            <Target size={52} className={`${styles.floatingElement} ${styles.float3}`} />
            <Calendar size={40} className={`${styles.floatingElement} ${styles.float4}`} />
            <Activity size={56} className={`${styles.floatingElement} ${styles.float5}`} />
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.avatarWrapper}>
              {mounted && (
                <img 
                  src={getAvatarSrc()} 
                  alt="User Avatar" 
                  className={styles.avatar} 
                />
              )}
            </div>
            {mounted && (
              <>
                <h2 className={styles.name}>{profile.name}</h2>
                <p className={styles.bio}>{profile.bio}</p>
              </>
            )}
            
            {/* Achievements/Badges */}
            <div className={styles.badges}>
              {mounted && profile.birthDate && getZodiac(profile.birthDate) && (
                <div className={styles.badge} style={{ color: 'var(--secondary)' }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '4px' }}>{getZodiac(profile.birthDate).emoji}</span> 
                  {getZodiac(profile.birthDate).sign}
                </div>
              )}
              <div className={styles.badge} style={{ color: 'var(--warning)' }}>
                <Trophy size={16} /> Arion Founder
              </div>
              <div className={styles.badge} style={{ color: 'var(--danger)' }}>
                <Flame size={16} /> 3-Day Streak
              </div>
              <div className={`${styles.badge} ${styles.locked}`}>
                <Lock size={16} /> Focus Master (50h)
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h3 style={{ marginTop: '1rem' }}>Lifetime Statistics</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
              <Clock size={24} />
            </div>
            <div className={styles.statValue}>{stats.focusHours}h</div>
            <div className={styles.statLabel}>Deep Focus Time</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)' }}>
              <Target size={24} />
            </div>
            <div className={styles.statValue}>{stats.completedTasks}</div>
            <div className={styles.statLabel}>Tasks Crushed</div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--warning)' }}>
              <Zap size={24} />
            </div>
            <div className={styles.statValue}>{stats.bestStreak}</div>
            <div className={styles.statLabel}>Best Day Streak</div>
          </div>
        </div>

        {/* Activity or Custom Widgets could go here */}
        <div className="glass-panel" style={{ marginTop: '1rem', padding: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Star size={20} color="var(--primary)" /> Recent Milestones
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.8 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--success)' }}></div>
              <div>Completed 10 tasks in a single day. <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>2 days ago</span></div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.8 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
              <div>Logged first 2-hour Pomodoro session. <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>1 week ago</span></div>
            </li>
            <li style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: 0.8 }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--warning)' }}></div>
              <div>Joined Arion! <span style={{ opacity: 0.5, fontSize: '0.8rem', marginLeft: '0.5rem' }}>Just now</span></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
