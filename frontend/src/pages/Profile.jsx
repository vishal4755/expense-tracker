import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/auth/change-password', passwords, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Password changed successfully!');
      setShowPasswordForm(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password!');
    }
  };

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        {/* Back Button */}
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'none', border: 'none', color: '#378ADD',
          cursor: 'pointer', fontSize: '14px', marginBottom: '20px', padding: 0
        }}>
          ← Back to Dashboard
        </button>

        {/* Profile Card */}
        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '30px', border: '0.5px solid rgba(255,255,255,0.1)', marginBottom: '20px' }}>
          
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
            <div style={{
              width: '70px', height: '70px', borderRadius: '50%',
              background: '#E24B4A', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '28px'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 style={{ color: '#fff', margin: 0 }}>{user.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0', fontSize: '14px' }}>{user.email}</p>
            </div>
          </div>

          {/* User Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Full Name', value: user.name },
              { label: 'Email', value: user.email },
              { label: 'Mobile', value: user.mobile || 'Not provided' }
            ].map((item, i) => (
              <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.1)' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 4px', fontSize: '12px' }}>{item.label}</p>
                <p style={{ color: '#fff', margin: 0, fontSize: '15px' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password */}
        <div style={{ background: '#1a1a2e', borderRadius: '16px', padding: '25px', border: '0.5px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>Security</h3>
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} style={{
              padding: '8px 16px', background: 'rgba(55,138,221,0.15)',
              color: '#378ADD', border: '0.5px solid #378ADD',
              borderRadius: '8px', cursor: 'pointer', fontSize: '13px'
            }}>
              Change Password
            </button>
          </div>

          {error && <p style={{ color: '#E24B4A', background: 'rgba(226,75,74,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
          {success && <p style={{ color: '#1D9E75', background: 'rgba(29,158,117,0.1)', padding: '10px', borderRadius: '8px' }}>{success}</p>}

          {showPasswordForm && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="password" placeholder="Current Password" value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
              <input type="password" placeholder="New Password" value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
              <input type="password" placeholder="Confirm New Password" value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff' }} />
              <button onClick={handleChangePassword} style={{
                padding: '12px', background: '#E24B4A', color: '#fff',
                border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
              }}>
                Update Password
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;