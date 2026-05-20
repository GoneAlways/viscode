import { useNavigate } from 'react-router-dom';

export default function VideoCard({ video, compact, newWindow }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (newWindow) {
      window.open(`/video/${video.id}`, '_blank');
    } else {
      navigate(`/video/${video.id}`);
    }
  };

  if (compact) {
    return (
      <div className="video-card" onClick={handleClick}>
        <div
          className="thumbnail"
          style={{ background: `${video.thumbnail_color}20`, border: `2px solid ${video.thumbnail_color}40` }}
        >
          <span role="img" aria-label="video thumbnail">🎬</span>
          <span className="dur">{video.duration}</span>
        </div>
        <div className="card-info">
          <div className="card-title">{video.title}</div>
          <div className="card-channel">{video.channel}</div>
          <div className="card-meta">{formatViews(video.views)} 次观看</div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-card" onClick={handleClick}>
      <div
        className="thumbnail"
        style={{ background: `${video.thumbnail_color}20`, border: `2px solid ${video.thumbnail_color}40` }}
      >
        <span role="img" aria-label="video thumbnail">🎬</span>
        <span className="dur">{video.duration}</span>
      </div>
      <div className="card-info">
        <div className="card-title">{video.title}</div>
        <div className="card-channel">{video.channel}</div>
        <div className="card-meta">{formatViews(video.views)} 次观看 · {formatLikes(video.likes)} 赞</div>
      </div>
    </div>
  );
}

function formatViews(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万';
  if (n >= 1000) return (n / 1000).toFixed(1) + ' 千';
  return String(n);
}

function formatLikes(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万';
  if (n >= 1000) return (n / 1000).toFixed(1) + ' 千';
  return String(n);
}
