import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed!');
    }
  };

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginTop: 0 }}>💰 Expense Tracker</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '30px' }}>Login to your account</p>

        {error && <p style={{ color: '#E24B4A', textAlign: 'center', background: 'rgba(226,75,74,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="email" placeholder="Email Address" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
          <input type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
          <button onClick={handleLogin}
            style={{ padding: '12px', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Login
          </button>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0 }}>
            Don't have an account?{' '}
            <span onClick={() => navigate('/register')} style={{ color: '#E24B4A', cursor: 'pointer' }}>Register</span>
          </p>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0 }}>
            <span onClick={() => navigate('/forgot-password')} style={{ color: '#378ADD', cursor: 'pointer' }}>Forgot Password?</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;