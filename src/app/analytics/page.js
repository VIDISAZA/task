'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Clock } from 'lucide-react';

const COLORS = ['var(--success)', 'var(--border)'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(resData => {
        if (resData.success) {
          setData(resData.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <Topbar title="Analytics" />
        <div style={{ padding: '2rem', opacity: 0.5 }}>Loading analytics data...</div>
      </div>
    );
  }

  // Fallback data if DB is empty
  const chartData = data?.chartData?.length > 0 ? data.chartData : [
    { name: 'Mon', hours: 0, completed: 0 },
    { name: 'Tue', hours: 0, completed: 0 },
  ];

  const completionData = data?.completionRate ? [
    { name: 'Completed', value: data.completionRate.completed },
    { name: 'Pending', value: data.completionRate.pending }
  ] : [
    { name: 'Completed', value: 0 },
    { name: 'Pending', value: 1 }
  ];

  return (
    <div>
      <Topbar title="Productivity Analytics" />
      
      <div className="dashboard-content">
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '12px', color: 'var(--success)' }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Completion Rate</p>
              <h4 style={{ fontSize: '1.5rem' }}>
                {data?.completionRate ? Math.round((data.completionRate.completed / (data.completionRate.completed + data.completionRate.pending || 1)) * 100) : 0}%
              </h4>
            </div>
          </div>
          
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '12px', color: 'var(--primary)' }}>
              <Clock size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Total Focus Hours</p>
              <h4 style={{ fontSize: '1.5rem' }}>
                {data?.chartData?.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1) || 0}h
              </h4>
            </div>
          </div>

          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '12px', color: 'var(--warning)' }}>
              <Award size={24} />
            </div>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Best Focus Day</p>
              <h4 style={{ fontSize: '1.5rem' }}>
                {data?.chartData?.length ? [...data.chartData].sort((a,b) => b.hours - a.hours)[0].name : '-'}
              </h4>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.5rem' }}>Tasks vs Pending Overview</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel">
            <h3 style={{ marginBottom: '1.5rem' }}>Weekly Focus Trend (Hours)</h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--foreground)" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--foreground)" opacity={0.5} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Line type="monotone" dataKey="hours" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
