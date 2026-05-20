import { Router } from 'express';
import db from '../db.js';

const router = Router();

// GET /api/videos — list all videos
router.get('/', (_req, res) => {
  const videos = db.prepare(`
    SELECT id, title, channel, thumbnail_color, duration, views, likes, created_at
    FROM videos ORDER BY created_at DESC
  `).all();
  res.json(videos);
});

// GET /api/videos/:id — single video detail
router.get('/:id', (req, res) => {
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  // Increment view count
  db.prepare('UPDATE videos SET views = views + 1 WHERE id = ?').run(req.params.id);
  video.views += 1;
  res.json(video);
});

// POST /api/videos — create a new video
router.post('/', (req, res) => {
  const { title, channel, description, video_url, thumbnail_color, duration } = req.body;
  if (!title || !channel) {
    return res.status(400).json({ error: 'title and channel are required' });
  }
  const result = db.prepare(`
    INSERT INTO videos (title, channel, description, video_url, thumbnail_color, duration)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, channel, description || '', video_url || '', thumbnail_color || '#f44336', duration || '0:00');

  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(video);
});

// POST /api/videos/:id/like — like a video
router.post('/:id/like', (req, res) => {
  const video = db.prepare('SELECT * FROM videos WHERE id = ?').get(req.params.id);
  if (!video) return res.status(404).json({ error: 'Video not found' });
  db.prepare('UPDATE videos SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  res.json({ likes: video.likes + 1 });
});

export default router;
