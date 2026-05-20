import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/videos/:id/comments
router.get('/videos/:id/comments', (req, res) => {
  const comments = db.prepare(`
    SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC
  `).all(req.params.id);
  res.json(comments);
});

// POST /api/videos/:id/comments — add a comment
router.post('/videos/:id/comments', (req, res) => {
  const { author, text } = req.body;
  if (!author || !text) {
    return res.status(400).json({ error: 'author and text are required' });
  }
  const result = db.prepare(`
    INSERT INTO comments (video_id, author, text) VALUES (?, ?, ?)
  `).run(req.params.id, author, text);

  const comment = db.prepare('SELECT * FROM comments WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(comment);
});

// DELETE /api/comments/:id
router.delete('/comments/:id', (req, res) => {
  const result = db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Comment not found' });
  res.json({ success: true });
});

export default router;
