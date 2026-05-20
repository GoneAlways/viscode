import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Header from './components/Header';
import VideoListPage from './pages/VideoListPage';
import VideoDetailPage from './pages/VideoDetailPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const { loading } = useAuth();

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<VideoListPage />} />
        <Route path="/video/:id" element={<VideoDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
