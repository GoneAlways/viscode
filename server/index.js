import express from 'express';
import cors from 'cors';
import videosRouter from './routes/videos.js';
import commentsRouter from './routes/comments.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/videos', videosRouter);
app.use('/api', commentsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
