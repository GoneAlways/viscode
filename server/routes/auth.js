import { Router } from 'express';
import crypto from 'crypto';
import db from '../db.js';

const router = Router();

// Ensure password and token columns exist (migration-safe, idempotent)
for (const col of ['password', 'token']) {
  try { db.exec(`ALTER TABLE users ADD COLUMN ${col} TEXT DEFAULT ''`); } catch { /* already exists */ }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: '用户名已存在' });
  }
  const token = generateToken();
  const avatarColors = ['#ff5722', '#4caf50', '#2196f3', '#9c27b0', '#ff9800', '#e91e63', '#00bcd4', '#607d8b'];
  const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
  const result = db.prepare(
    'INSERT INTO users (username, password, token, avatar_color) VALUES (?, ?, ?, ?)'
  ).run(username, hashPassword(password), token, color);
  const user = db.prepare('SELECT id, username, avatar_color, token FROM users WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ user, token });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || user.password !== hashPassword(password)) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const token = generateToken();
  db.prepare('UPDATE users SET token = ? WHERE id = ?').run(token, user.id);
  const updated = db.prepare('SELECT id, username, avatar_color, token FROM users WHERE id = ?').get(user.id);
  res.json({ user: updated, token });
});

// GET /api/auth/me — get current user by token
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '未登录' });
  const user = db.prepare('SELECT id, username, avatar_color, token FROM users WHERE token = ?').get(token);
  if (!user) return res.status(401).json({ error: '登录已过期' });
  res.json({ user });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    db.prepare('UPDATE users SET token = \'\' WHERE token = ?').run(token);
  }
  res.json({ success: true });
});

export default router;
