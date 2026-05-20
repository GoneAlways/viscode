import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="header-logo">viscode</Link>
      </div>
      <input className="header-search" type="text" placeholder="搜索视频..." readOnly />
      <div className="header-right">
        {user ? (
          <>
            <div className="header-user" title={user.username}>
              <span className="header-avatar" style={{ background: user.avatar_color }}>
                {user.username[0]}
              </span>
              <span className="header-username">{user.username}</span>
            </div>
            <button className="header-logout-btn" onClick={handleLogout}>退出</button>
          </>
        ) : (
          <Link to="/login" className="header-login-btn">登录</Link>
        )}
      </div>
    </header>
  );
}
