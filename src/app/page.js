'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import DashboardCharts from '@/components/DashboardCharts';
import { Target, Zap, Activity, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useTaskStore } from '@/store/useTaskStore';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const { tasks, fetchTasks } = useTaskStore();
  const [insight, setInsight] = useState("Analyzing your productivity patterns...");
  const [greeting, setGreeting] = useState({ text: 'Welcome back!', emoji: '👋' });
  const [currentDate, setCurrentDate] = useState({ day: '', date: '' });
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);

    // Set dynamic greeting based on time
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting({ text: 'Good morning', emoji: '☀️' });
    else if (hour < 18) setGreeting({ text: 'Good afternoon', emoji: '🌤️' });
    else setGreeting({ text: 'Good evening', emoji: '🌙' });

    setCurrentDate({
      day: now.toLocaleDateString('en-US', { weekday: 'long' }),
      date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });

    // Fetch tasks for stats
    fetchTasks();

    // Fetch AI insights
    fetch('/api/insights')
      .then(res => res.json())
      .then(data => {
        if (data.success) setInsight(data.data.insight);
      })
      .catch(() => {});
  }, [fetchTasks]);

  // Compute real stats from tasks
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const userName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div>
      <Topbar title="Dashboard" />
      
      <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
        {/* Hero Greeting Card */}
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              {greeting.text}, {userName}! {greeting.emoji}
            </h2>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              <span className="gradient-text" style={{ fontWeight: 600 }}>More than a to-do list.</span>{' '}
              {insight}
            </p>
            <Link href="/focus">
              <button className="btn-primary">
                Start Focus Session <ArrowRight size={16} />
              </button>
            </Link>
          </div>
          
          {mounted && (
            <div style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'var(--primary-soft)', padding: '1.25rem 1.75rem', borderRadius: 'var(--radius-xl)', 
              border: '1px solid var(--primary-glow)', minWidth: '160px'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                {currentDate.day}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', letterSpacing: '0.5px', textTransform: 'uppercase', fontWeight: 500 }}>
                {currentDate.date}
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--success-soft)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
              <Target size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Tasks Done</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{completedTasks} <span style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', fontWeight: 400 }}>/ {totalTasks}</span></h4>
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--primary-soft)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
              <Zap size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Completion</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{completionRate}%</h4>
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--warning-soft)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
              <Activity size={22} />
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Pending</p>
              <h4 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{pendingTasks}</h4>
            </div>
          </div>
        </div>

        <DashboardCharts />
      </div>
    </div>
  );
}
