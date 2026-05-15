'use client';
import { useState, useEffect } from 'react';
import Topbar from '@/components/Topbar';
import { User, Bell, Shield, LogOut, Save } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function SettingsPage() {
  const { profile, updateProfile, logout } = useUserStore();
  
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

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
      alert('Logged out. Profile data reset to Guest.');
      window.location.href = '/';
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

  return (
    <div>
      <Topbar title="Settings" />
      
      <div className="dashboard-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="glass-panel" style={{ padding: '2rem' }}>
          
          {/* Account Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <User size={20} /> Account Settings
            </h3>
            
            <form onSubmit={handleSave}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--primary)', overflow: 'hidden', flexShrink: 0 }}>
                  <img 
                    src={localProfile.avatarSeed?.startsWith('data:image') ? localProfile.avatarSeed : `https://api.dicebear.com/7.x/avataaars/svg?seed=${localProfile.avatarSeed}`} 
                    alt="Avatar Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Avatar (Upload or type a name to generate)</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)' }}
                      value={localProfile.avatarSeed?.startsWith('data:image') ? 'Custom Image Uploaded' : localProfile.avatarSeed}
                      onChange={(e) => setLocalProfile({...localProfile, avatarSeed: e.target.value})}
                      placeholder="Type a name..."
                      disabled={localProfile.avatarSeed?.startsWith('data:image')}
                    />
                    <label style={{ padding: '0.75rem 1rem', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      Upload Photo
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Display Name</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)' }}
                    value={localProfile.name}
                    onChange={(e) => setLocalProfile({...localProfile, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Email Address</label>
                  <input 
                    type="email" 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)' }}
                    value={localProfile.email}
                    onChange={(e) => setLocalProfile({...localProfile, email: e.target.value})}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Date of Birth (For Zodiac)</label>
                <input 
                  type="date" 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)' }}
                  value={localProfile.birthDate || ''}
                  onChange={(e) => setLocalProfile({...localProfile, birthDate: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Bio</label>
                <textarea 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--foreground)', minHeight: '80px', fontFamily: 'inherit' }}
                  value={localProfile.bio}
                  onChange={(e) => setLocalProfile({...localProfile, bio: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Preferences Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              <Bell size={20} /> Preferences
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>Push Notifications</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Receive notifications for task deadlines and focus timer completion.</p>
                </div>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={localProfile.notifications}
                    onChange={(e) => setLocalProfile({...localProfile, notifications: e.target.checked})}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                  />
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <h4 style={{ marginBottom: '0.25rem' }}>Dark Mode</h4>
                  <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Enable dark theme across the application.</p>
                </div>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <input 
                    type="checkbox" 
                    checked={localProfile.darkMode}
                    onChange={(e) => setLocalProfile({...localProfile, darkMode: e.target.checked})}
                    style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Security & Danger Zone */}
          <div>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--danger)' }}>
              <Shield size={20} /> Danger Zone
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.05)' }}>
              <div>
                <h4 style={{ marginBottom: '0.25rem', color: 'var(--danger)' }}>Log Out</h4>
                <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Securely log out of your Arion account on this device.</p>
              </div>
              <button 
                onClick={handleLogout}
                style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--danger)', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer' }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
