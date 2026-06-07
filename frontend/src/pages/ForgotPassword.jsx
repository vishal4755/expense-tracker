import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setStep(2);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setStep(3);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#1a1a2e', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '0.5px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', marginTop: 0 }}>💰 Expense Tracker</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '30px' }}>
          {step === 1 && 'Enter your email address'}
          {step === 2 && 'Enter OTP sent to your email'}
          {step === 3 && 'Set new password'}
        </p>

        {/* Steps indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '25px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              width: '30px', height: '4px', borderRadius: '2px',
              background: s <= step ? '#E24B4A' : 'rgba(255,255,255,0.1)'
            }} />
          ))}
        </div>

        {error && <p style={{ color: '#E24B4A', textAlign: 'center', background: 'rgba(226,75,74,0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>{error}</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {step === 1 && (
            <>
              <input type="email" placeholder="Email Address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
              <button onClick={handleSendOTP} disabled={loading}
                style={{ padding: '12px', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input type="text" placeholder="Enter 6-digit OTP" value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px', letterSpacing: '5px', textAlign: 'center' }} />
              <button onClick={handleVerifyOTP} disabled={loading}
                style={{ padding: '12px', background: '#E24B4A', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <p onClick={handleSendOTP} style={{ color: '#378ADD', textAlign: 'center', cursor: 'pointer', margin: 0, fontSize: '13px' }}>
                Resend OTP
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <input type="password" placeholder="New Password" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: '0.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '15px' }} />
              <button onClick={handleResetPassword} disabled={loading}
                style={{ padding: '12px', background: '#1D9E75', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </>
          )}

          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', margin: 0 }}>
            <span onClick={() => navigate('/login')} style={{ color: '#E24B4A', cursor: 'pointer' }}>Back to Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;