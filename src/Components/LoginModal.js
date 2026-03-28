import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { useAuth } from '../contexts/AuthContext';
import './LoginModal.css';

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID || '';
const AUTH_URL = 'http://localhost:5000/api/auth';

export default function LoginModal() {
  const { loginOpen, setLoginOpen, loginPhone, registerPhone, loginFacebook, saveUser } = useAuth(); // eslint-disable-line

  const [tab, setTab]           = useState('login');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPass]     = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const reset     = () => { setName(''); setPhone(''); setPass(''); setError(''); setLoading(false); };
  const close     = () => { setLoginOpen(false); reset(); };
  const switchTab = (t) => { setTab(t); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (phone.length < 10) { setError('Số điện thoại phải có ít nhất 10 chữ số.'); return; }
    setLoading(true);
    try {
      if (tab === 'login') await loginPhone(phone, password);
      else                 await registerPhone(name, phone, password);
      close();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setError(''); setLoading(true);
      try {
        const res  = await fetch(`${AUTH_URL}/google-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        saveUser(data.user, data.token);
        close();
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    },
    onError: () => setError('Đăng nhập Google thất bại.'),
  });

  const handleFacebook = async (response) => {
    if (!response.accessToken) return;
    setError(''); setLoading(true);
    try {
      await loginFacebook(response.accessToken, response.userID);
      close();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (!loginOpen) return null;

  return (
    <div className="lm-overlay" onClick={e => e.target === e.currentTarget && close()}>
      <div className="lm-box">

        {/* Header */}
        <div className="lm-header">
          <div className="lm-logo">
            <span>👶</span>
            <span className="lm-logo-text">Shop mẹ <em>Thủy</em></span>
          </div>
          <button className="lm-close" onClick={close}>✕</button>
        </div>

        {/* Tabs */}
        <div className="lm-tabs">
          <button className={`lm-tab ${tab === 'login'    ? 'active' : ''}`} onClick={() => switchTab('login')}>Đăng nhập</button>
          <button className={`lm-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => switchTab('register')}>Đăng ký</button>
        </div>

        {/* Social */}
        <div className="lm-social">
          <button className="lm-social-btn lm-google" onClick={() => handleGoogle()} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.2 0 5.9 1.1 8.1 2.9l6-6C34.5 3.1 29.5 1 24 1 14.9 1 7.1 6.4 3.6 14.1l7 5.4C12.4 13.3 17.7 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z"/>
              <path fill="#FBBC05" d="M10.6 28.5A14.6 14.6 0 0 1 9.5 24c0-1.6.3-3.1.7-4.5l-7-5.4A23.9 23.9 0 0 0 0 24c0 3.9.9 7.5 2.5 10.8l7.4-5.7c-.2-.8-.3-1.6-.3-2.1v1.4z"/>
              <path fill="#34A853" d="M24 47c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-3.8-13.5-9.2l-7.4 5.7C7.1 41.6 14.9 47 24 47z"/>
            </svg>
            Tiếp tục với Google
          </button>

          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            callback={handleFacebook}
            fields="name,email,picture"
            render={rp => (
              <button className="lm-social-btn lm-facebook" onClick={rp.onClick} disabled={loading || rp.isDisabled}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Tiếp tục với Facebook
              </button>
            )}
          />
        </div>

        {/* Divider */}
        <div className="lm-divider"><span>hoặc</span></div>

        {/* Form */}
        <form className="lm-form" onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div className="lm-field">
              <label>Họ và tên</label>
              <input type="text" placeholder="Nguyễn Thị Thủy" value={name}
                onChange={e => setName(e.target.value)} required />
            </div>
          )}

          <div className="lm-field">
            <label>Số điện thoại</label>
            <div className="lm-phone-wrap">
              <span className="lm-phone-prefix">🇻🇳 +84</span>
              <input
                type="tel"
                placeholder="0912 345 678"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                required
              />
            </div>
          </div>

          <div className="lm-field">
            <label>Mật khẩu</label>
            <div className="lm-pass-wrap">
              <input type={showPass ? 'text' : 'password'} placeholder="Ít nhất 6 ký tự"
                value={password} onChange={e => setPass(e.target.value)} required />
              <button type="button" className="lm-eye" onClick={() => setShowPass(s => !s)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {error && <div className="lm-error">⚠️ {error}</div>}

          <button type="submit" className="lm-submit" disabled={loading}>
            {loading ? 'Đang xử lý…' : tab === 'login' ? '🔐 Đăng nhập' : '✨ Tạo tài khoản'}
          </button>
        </form>

        <p className="lm-footer-note">
          {tab === 'login'
            ? <>Chưa có tài khoản? <button className="lm-link" onClick={() => switchTab('register')}>Đăng ký ngay</button></>
            : <>Đã có tài khoản? <button className="lm-link" onClick={() => switchTab('login')}>Đăng nhập</button></>
          }
        </p>

      </div>
    </div>
  );
}
