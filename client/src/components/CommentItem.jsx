import { deleteComment } from '../api';

const AVATAR_COLORS = ['#ff5722', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'];

export default function CommentItem({ comment, onDeleted }) {
  const color = AVATAR_COLORS[comment.id % AVATAR_COLORS.length];

  const handleDelete = async () => {
    try {
      await deleteComment(comment.id);
      onDeleted(comment.id);
    } catch { /* ignore */ }
  };

  const timeAgo = getTimeAgo(comment.created_at);

  return (
    <div className="comment">
      <div className="avatar" style={{ background: color }}>
        {comment.author[0]}
      </div>
      <div className="comment-body">
        <div>
          <span className="comment-author">{comment.author}</span>
          <span className="comment-time">{timeAgo}</span>
        </div>
        <div className="comment-text">{comment.text}</div>
        <div className="comment-actions-row">
          <button>👍 {comment.likes}</button>
          <button>👎</button>
          <button>回复</button>
          <button className="danger" onClick={handleDelete}>删除</button>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr) {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return '刚刚';
  if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前';
  if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前';
  if (diff < 604800) return Math.floor(diff / 86400) + ' 天前';
  return Math.floor(diff / 604800) + ' 周前';
}
