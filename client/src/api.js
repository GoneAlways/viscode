const BASE = '/api';

export async function fetchVideos() {
  const res = await fetch(`${BASE}/videos`);
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function fetchVideo(id) {
  const res = await fetch(`${BASE}/videos/${id}`);
  if (!res.ok) throw new Error('Failed to fetch video');
  return res.json();
}

export async function createVideo(data) {
  const res = await fetch(`${BASE}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create video');
  return res.json();
}

export async function likeVideo(id) {
  const res = await fetch(`${BASE}/videos/${id}/like`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like video');
  return res.json();
}

export async function fetchComments(videoId) {
  const res = await fetch(`${BASE}/videos/${videoId}/comments`);
  if (!res.ok) throw new Error('Failed to fetch comments');
  return res.json();
}

export async function postComment(videoId, author, text) {
  const res = await fetch(`${BASE}/videos/${videoId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, text }),
  });
  if (!res.ok) throw new Error('Failed to post comment');
  return res.json();
}

export async function deleteComment(id) {
  const res = await fetch(`${BASE}/comments/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete comment');
  return res.json();
}

// ---- Auth ----

export async function login(username, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function register(username, password) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
  return res.json();
}

export async function fetchMe(token) {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export async function logout(token) {
  await fetch(`${BASE}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}
