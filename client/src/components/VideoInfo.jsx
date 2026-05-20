import { useState } from 'react';
import { likeVideo } from '../api';

export default function VideoInfo({ video }) {
  const [subscribed, setSubscribed] = useState(false);
  const [likes, setLikes] = useState(video.likes);

  const handleLike = async () => {
    try {
      const data = await likeVideo(video.id);
      setLikes(data.likes);
    } catch { /* ignore */ }
  };

  return (
    <div className="video-info">
      <h1 className="video-title">{video.title}</h1>

      <div className="video-meta">
        <div className="channel">
          <div className="avatar" style={{ background: video.thumbnail_color }}>
            {video.channel[0]}
          </div>
          <div>
            <div className="channel-name">{video.channel}</div>
            <div className="sub-count">{formatViews(video.views)} 次观看</div>
          </div>
          <button
            className={`subscribe-btn ${subscribed ? 'subscribed' : ''}`}
            onClick={() => setSubscribed(!subscribed)}
          >
            {subscribed ? '已订阅' : '订阅'}
          </button>
        </div>

        <div className="actions">
          <button className="action-btn" onClick={handleLike}>
            👍 {formatNum(likes)}
          </button>
          <button className="action-btn">👎</button>
          <button className="action-btn">↗ 分享</button>
          <button className="action-btn">⋯</button>
        </div>
      </div>

      {video.description && (
        <div className="description">{video.description}</div>
      )}
    </div>
  );
}

function formatViews(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万';
  return String(n);
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + ' 万';
  if (n >= 1000) return (n / 1000).toFixed(1) + ' 千';
  return String(n);
}
