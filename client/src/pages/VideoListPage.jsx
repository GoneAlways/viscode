import { useState, useEffect } from 'react';
import { fetchVideos, createVideo } from '../api';
import VideoCard from '../components/VideoCard';

export default function VideoListPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', channel: '', description: '', duration: '0:00', thumbnail_color: '#f44336' });

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await fetchVideos();
      setVideos(data);
    } catch {
      setError('无法加载视频列表，请确保后端已启动');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadVideos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createVideo(form);
      setShowForm(false);
      setForm({ title: '', channel: '', description: '', duration: '0:00', thumbnail_color: '#f44336' });
      await loadVideos();
    } catch { /* ignore */ }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error-msg">{error}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 className="page-title" style={{ margin: 0 }}>推荐视频</h2>
        <button className="subscribe-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? '收起' : '+ 添加视频'}
        </button>
      </div>

      {showForm && (
        <form className="add-video-form" onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="视频标题" required />
          <input name="channel" value={form.channel} onChange={handleChange} placeholder="频道名称" required />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="视频描述"
            rows={2}
            className="full-width"
            style={{
              padding: '10px 14px', borderRadius: 8, border: '1px solid #3f3f3f',
              background: '#121212', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical',
            }}
          />
          <input name="duration" value={form.duration} onChange={handleChange} placeholder="时长 (如 5:30)" />
          <input name="thumbnail_color" value={form.thumbnail_color} onChange={handleChange} placeholder="主题色 (如 #f44336)" />
          <button type="submit">发布视频</button>
        </form>
      )}

      <div className="video-grid">
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
    </div>
  );
}
