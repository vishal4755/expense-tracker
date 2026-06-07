import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed!');
        return;
      }
      navigate('/login');
    } catch (err) {
      setError('Registration failed!');
    }
  };

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginTop: 0 }}>💰 Expense Tracker</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '30px' }}>Create your account</p>

        {error && <p style={{ color: '#E24B4A', textAlign: 'center', background: 'rgba(226,75,74,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input type="text" placeholder="Full Name" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
          <input type="text" placeholder="Mobile Number" value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
          <input type="email" placeholder="Email Address" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
          <input type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
          <button onClick={handleRegister}
            style={{ padding: '12px', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
            Register
          </button>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0 }}>
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} style={{ color: '#E24B4A', cursor: 'pointer' }}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;