'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import DashboardCharts from '@/components/DashboardCharts';
import ArionAvatar from '@/components/ArionAvatar';
import { Target, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [insight, setInsight] = useState("Loading insights...");
  const [greeting, setGreeting] = useState({ text: 'Welcome back!', emoji: '👋' });
  const [currentDate, setCurrentDate] = useState({ day: '', date: '' });
  
  useEffect(() => {
    // Set dynamic greeting based on time
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting({ text: 'Good morning!', emoji: '☀️' });
    else if (hour < 18) setGreeting({ text: 'Good afternoon!', emoji: '🌤️' });
    else setGreeting({ text: 'Good evening!', emoji: '🌙' });

    setCurrentDate({
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });

    // Fetch AI insights
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        if (data.success) setInsight(data.data.insight);
      });
  }, []);

  return (
    <div>
      <Topbar title="Dashboard" />
      
      <div className="dashboard-content">
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{greeting.text} {greeting.emoji}</h2>
            <p style={{ color: 'var(--foreground)', opacity: 0.7, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              <span className="gradient-text" style={{ fontWeight: 'bold' }}>More than a to-do list.</span> {insight}
            </p>
            <Link href="/focus">
              <button className="btn-primary">Start Focus Timer</button>
            </Link>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
             <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                {currentDate.day}
             </div>
             <div style={{ fontSize: '1rem', opacity: 0.7, letterSpacing: '1px', textTransform: 'uppercase' }}>
                {currentDate.date}
             </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
              <Target size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Tasks Done</p>
              <h4 style={{ fontSize: '1.5rem' }}>12 / 16</h4>
            </div>
          </div>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Zap size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Current Streak</p>
              <h4 style={{ fontSize: '1.5rem' }}>3 Days</h4>
            </div>
          </div>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--warning)' }}>
              <Activity size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Busyness Score</p>
              <h4 style={{ fontSize: '1.5rem' }}>75%</h4>
            </div>
          </div>
        </div>

        <DashboardCharts />
      </div>
    </div>
  );
}
