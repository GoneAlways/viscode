import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchVideo, fetchVideos, fetchComments } from '../api';
import VideoPlayer from '../components/VideoPlayer';
import VideoInfo from '../components/VideoInfo';
import VideoCard from '../components/VideoCard';
import CommentForm from '../components/CommentForm';
import CommentItem from '../components/CommentItem';

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [v, allVideos] = await Promise.all([fetchVideo(id), fetchVideos()]);
      setVideo(v);
      setRelated(allVideos.filter((rv) => rv.id !== Number(id)).slice(0, 8));
      const cs = await fetchComments(id);
      setComments(cs);
    } catch {
      setError('加载失败，请确保后端已启动');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCommentAdded = (comment) => {
    setComments((prev) => [comment, ...prev]);
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error) return <div className="error-msg">{error}</div>;
  if (!video) return <div className="error-msg">视频不存在</div>;

  return (
    <div className="detail-layout">
      <div className="detail-main">
        <VideoPlayer videoUrl={video.video_url} />
        <VideoInfo video={video} />

        <section className="comments-section">
          <div className="comments-header">
            <h3>{comments.length} 条评论</h3>
          </div>

          <CommentForm videoId={video.id} onCommentAdded={handleCommentAdded} />

          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} onDeleted={handleCommentDeleted} />
          ))}
        </section>
      </div>

      <aside className="detail-sidebar sidebar">
        <h3>推荐视频</h3>
        {related.map((v) => (
          <VideoCard key={v.id} video={v} compact newWindow />
        ))}
      </aside>
    </div>
  );
}
