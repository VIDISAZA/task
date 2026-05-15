import { useEffect, useState } from 'react';

export default function ArionAvatar({ busyness = 50, streak = 0, isFocusing = false }) {
  const [expression, setExpression] = useState('😎'); // Default happy

  useEffect(() => {
    if (isFocusing) {
      setExpression('🧐'); // Focused
    } else if (busyness > 80) {
      setExpression('🥵'); // Overwhelmed
    } else if (streak > 2) {
      setExpression('🔥'); // On fire!
    } else if (busyness < 20) {
      setExpression('😴'); // Chill/Bored
    } else {
      setExpression('😎'); // Normal
    }
  }, [busyness, streak, isFocusing]);

  return (
    <div style={{ 
      width: '120px', 
      height: '120px', 
      borderRadius: '20px', 
      background: 'linear-gradient(135deg, var(--primary-glow), rgba(0,0,0,0))', 
      border: `2px solid ${isFocusing ? 'var(--warning)' : 'var(--primary)'}`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      flexDirection: 'column',
      boxShadow: isFocusing ? '0 0 20px var(--warning)' : '0 0 10px var(--primary-glow)',
      transition: 'all 0.3s ease'
    }}>
      <span style={{ fontSize: '3.5rem', transition: 'all 0.3s' }}>
        {expression}
      </span>
      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', marginTop: '0.5rem' }}>Arion</span>
    </div>
  );
}
