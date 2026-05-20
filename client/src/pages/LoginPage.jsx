import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('请填写用户名和密码');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('两次密码不一致');
      return;
    }
    if (password.length < 4) {
      setError('密码至少4位');
      return;
    }
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{mode === 'login' ? '登录 viscode' : '注册 viscode'}</h2>
        <p className="login-subtitle">
          {mode === 'login' ? '欢迎回来，登录您的账号' : '创建一个新账号以开始使用'}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              autoFocus
            />
          </div>
          <div className="login-field">
            <label>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
            />
          </div>
          {mode === 'register' && (
            <div className="login-field">
              <label>确认密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="请再次输入密码"
              />
            </div>
          )}
          <button type="submit" className="login-btn" disabled={submitting}>
            {submitting ? '处理中...' : mode === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="login-switch">
          {mode === 'login' ? (
            <>还没有账号？ <button onClick={() => { setMode('register'); setError(''); }}>立即注册</button></>
          ) : (
            <>已有账号？ <button onClick={() => { setMode('login'); setError(''); }}>立即登录</button></>
          )}
        </p>
      </div>
    </div>
  );
}
