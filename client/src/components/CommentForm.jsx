import { useState } from 'react';
import { Link } from 'react-router-dom';
import { postComment } from '../api';
import { useAuth } from '../AuthContext';

export default function CommentForm({ videoId, onCommentAdded }) {
  const { user } = useAuth();
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    if (!text.trim() || !user) return;
    try {
      const comment = await postComment(videoId, user.username, text.trim());
      onCommentAdded(comment);
      setText('');
    } catch { /* ignore */ }
  };

  if (!user) {
    return (
      <div className="comment-login-hint">
        <Link to="/login">登录</Link> 后即可发表评论
      </div>
    );
  }

  return (
    <div className="comment-form">
      <div className="avatar" style={{ background: user.avatar_color }}>
        {user.username[0]}
      </div>
      <div className="comment-input-box">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="发表评论..."
          maxLength={500}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <div className="comment-actions">
          <button className="cancel-btn" onClick={() => setText('')}>取消</button>
          <button className="submit-btn" disabled={!text.trim()} onClick={handleSubmit}>评论</button>
        </div>
      </div>
    </div>
  );
}
