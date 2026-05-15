'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import DashboardCharts from '@/components/DashboardCharts';
import ArionAvatar from '@/components/ArionAvatar';
import { Target, Zap, Activity } from 'lucide-react';

export default function Home() {
  const [insight, setInsight] = useState("Loading insights...");
  
  useEffect(() => {
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
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Good morning! ☀️</h2>
            <p style={{ color: 'rgba(238, 242, 246, 0.7)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              Your <span className="gradient-text" style={{ fontWeight: 'bold' }}>Arion AI</span> insight: "{insight}"
            </p>
            <button className="btn-primary">Start Focus Timer</button>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
             <ArionAvatar busyness={75} streak={3} isFocusing={false} />
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
