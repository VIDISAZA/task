'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { User, Bell, Palette, Shield, LogOut, Save, Moon, Sun } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { profile, updateProfile } = useUserStore();
  
  // Local state for the form so we don't update global state on every keystroke
  const [localProfile, setLocalProfile] = useState(profile);
  
  // Update local form when global profile loads (client-side hydration)
  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(localProfile);
    alert('Settings saved successfully!');
  };

  // Theme toggle — applies IMMEDIATELY without needing Save
  const handleThemeToggle = () => {
    const newDarkMode = !profile.darkMode;
    updateProfile({ darkMode: newDarkMode });
    setLocalProfile(prev => ({ ...prev, darkMode: newDarkMode }));
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      signOut({ callbackUrl: '/login' });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please upload an image smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalProfile({ ...localProfile, avatarSeed: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--surface-solid)',
    color: 'var(--foreground)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    transition: 'var(--transition)',
  };

  return (
    <div>
      <Topbar title="Settings" />
      
      <div style={{ maxWidth: '720px', margin: '0 auto', animation: 'fadeIn 0.4s ease-out' }}>
        
        {/* Account Section */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            <User size={20} color="var(--primary)" /> Account
          </h3>
          
          <form onSubmit={handleSave}>
            {/* Avatar Section */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: 'var(--radius-lg)', background: 'var(--primary-soft)', border: '2px solid var(--primary-glow)', overflow: 'hidden', flexShrink: 0 }}>
                <img 
                  src={localProfile.avatarSeed?.startsWith('data:image') ? localProfile.avatarSeed : `https://api.dicebear.com/7.x/avataaars/svg?seed=${localProfile.avatarSeed}`} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Avatar</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    style={{ ...inputStyle, flex: 1 }}
                    value={localProfile.avatarSeed?.startsWith('data:image') ? 'Custom Image' : localProfile.avatarSeed}
                    onChange={(e) => setLocalProfile({...localProfile, avatarSeed: e.target.value})}
                    placeholder="Type a name to generate..."
                    disabled={localProfile.avatarSeed?.startsWith('data:image')}
                  />
                  <label className="btn-secondary" style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                    Upload
                    <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>
            </div>
            
            {/* Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Display Name</label>
                <input 
                  type="text" 
                  style={inputStyle}
                  value={localProfile.name}
                  onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Email</label>
                <input 
                  type="email" 
                  style={inputStyle}
                  value={localProfile.email}
                  onChange={(e) => setLocalProfile({...localProfile, email: e.target.value})}
                />
              </div>
            </div>

            {/* Birth Date */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Date of Birth</label>
              <input 
                type="date" 
                style={inputStyle}
                value={localProfile.birthDate || ''}
                onChange={(e) => setLocalProfile({...localProfile, birthDate: e.target.value})}
              />
            </div>

            {/* Bio */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 500 }}>Bio</label>
              <textarea 
                style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                value={localProfile.bio}
                onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn-primary">
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* Appearance Section — REALTIME */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            <Palette size={20} color="var(--primary)" /> Appearance
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--primary-soft)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {profile.darkMode ? <Moon size={20} color="var(--primary)" /> : <Sun size={20} color="var(--warning)" />}
              <div>
                <h4 style={{ marginBottom: '0.15rem', fontSize: '0.95rem' }}>
                  {profile.darkMode ? 'Dark Mode' : 'Light Mode'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                  Switch theme instantly — no save needed
                </p>
              </div>
            </div>
            <button 
              className="theme-switch"
              data-active={profile.darkMode ? "true" : "false"}
              onClick={handleThemeToggle}
              aria-label="Toggle theme"
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600 }}>
            <Bell size={20} color="var(--primary)" /> Notifications
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--surface)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <h4 style={{ marginBottom: '0.15rem', fontSize: '0.95rem' }}>Push Notifications</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>Receive alerts for task deadlines and focus completion.</p>
            </div>
            <button 
              className="theme-switch"
              data-active={localProfile.notifications ? "true" : "false"}
              onClick={() => setLocalProfile({...localProfile, notifications: !localProfile.notifications})}
              aria-label="Toggle notifications"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 600, color: 'var(--danger)' }}>
            <Shield size={20} /> Danger Zone
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--danger-soft)', borderRadius: 'var(--radius-md)', background: 'var(--danger-soft)' }}>
            <div>
              <h4 style={{ marginBottom: '0.15rem', fontSize: '0.95rem', color: 'var(--danger)' }}>Log Out</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>Securely log out of your Arion account.</p>
            </div>
            <button 
              onClick={handleLogout}
              style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
