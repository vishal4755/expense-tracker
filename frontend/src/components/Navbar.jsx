import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const navigate = useNavigate();
  const theme = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav style={{
      background: theme.navBg,
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `0.5px solid ${theme.border}`,
      boxShadow: theme.isDark ? 'none' : '0 2px 10px rgba(0,0,0,0.08)'
    }}>
      <h2 style={{ color: theme.text, margin: 0, fontSize: '18px' }}>💰 Expense Tracker</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

        {/* Theme Toggle */}
        <button onClick={theme.toggleTheme} style={{
          width: '40px', height: '22px', borderRadius: '11px',
          background: theme.isDark ? 'rgba(255,255,255,0.2)' : '#E24B4A',
          border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s'
        }}>
          <div style={{
            width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
            position: 'absolute', top: '3px',
            left: theme.isDark ? '3px' : '21px',
            transition: 'left 0.3s'
          }} />
        </button>
        <span style={{ color: theme.textSecondary, fontSize: '12px' }}>
          {theme.isDark ? '🌙' : '☀️'}
        </span>

        {/* Profile */}
        <div onClick={() => navigate('/profile')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: '#E24B4A', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '16px'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span style={{ color: theme.text, fontSize: '14px' }}>{user.name || 'User'}</span>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          padding: '8px 16px', background: 'rgba(226,75,74,0.15)',
          color: '#E24B4A', border: '0.5px solid #E24B4A',
          borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 500
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;