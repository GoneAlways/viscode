import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    channel TEXT NOT NULL,
    description TEXT DEFAULT '',
    video_url TEXT DEFAULT '',
    thumbnail_color TEXT DEFAULT '#f44336',
    duration TEXT DEFAULT '0:00',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    video_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    text TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    avatar_color TEXT DEFAULT '#ff5722'
  );
`);

// Seed data — only insert if tables are empty
const videoCount = db.prepare('SELECT COUNT(*) as c FROM videos').get().c;
if (videoCount === 0) {
  const insertVideo = db.prepare(`
    INSERT INTO videos (title, channel, description, video_url, thumbnail_color, duration, views, likes)
    VALUES (@title, @channel, @description, @video_url, @thumbnail_color, @duration, @views, @likes)
  `);

  const insertComment = db.prepare(`
    INSERT INTO comments (video_id, author, text, likes) VALUES (?, ?, ?, ?)
  `);

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (username, avatar_color) VALUES (?, ?)
  `);

  const videos = [
    { title: 'Big Buck Bunny — 开源动画短片 (4K HDR)', channel: 'Blender Studio', description: 'Big Buck Bunny 是 Blender 基金会发布的开源动画短片，使用 Blender 制作。讲述了一只大兔子与三只小啮齿动物的故事。\n\n#开源动画 #Blender #4K', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#e91e63', duration: '9:56', views: 12800000, likes: 342000 },
    { title: 'Sintel — Blender 开源电影完整版', channel: 'Blender Studio', description: 'Sintel 讲述了一个女孩寻找她丢失的龙的史诗故事。本片由 Blender 基金会制作，展示了开源工具在电影制作中的强大能力。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#00bcd4', duration: '14:48', views: 8900000, likes: 215000 },
    { title: 'Tears of Steel — 科幻短片全高清', channel: 'Blender Studio', description: '一部设定在阿姆斯特丹的科幻短片，讲述了关于爱情与机器人的故事。全片使用开放源代码工具制作，视觉效果令人惊叹。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#8bc34a', duration: '12:14', views: 5600000, likes: 182000 },
    { title: 'Spring — Blender 2.8 动画短片', channel: 'Blender Studio', description: 'Spring 是一个关于牧羊女和她的小狗的故事，她们面对远古的自然之灵。这部短片展示了 Blender 2.8 在角色动画上的巨大进步。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#ff9800', duration: '7:44', views: 4300000, likes: 145000 },
    { title: 'Caminandes 3 — 爆笑美洲驼动画', channel: 'Blender Studio', description: '一只美洲驼在南美洲的爆笑冒险。该系列以其幽默感和精致的动画风格赢得了全球观众的喜爱。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#9c27b0', duration: '2:34', views: 3200000, likes: 98000 },
    { title: 'Cosmos Laundromat — 荒诞风格短片', channel: 'Blender Studio', description: '一只山羊被困在一个神奇的洗衣店里，在一台时间机器中穿越不同的世界。荒诞而富有想象力的短片。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#3f51b5', duration: '10:01', views: 2800000, likes: 92000 },
    { title: 'Blender 4.0 新功能全面解析', channel: 'CG Geek', description: 'Blender 4.0 带来了光线追踪、新的几何节点和大幅改进的 UI。本视频详细介绍所有主要功能更新。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#f44336', duration: '22:10', views: 12000000, likes: 456000 },
    { title: '如何用 Blender 制作电影级场景', channel: 'CG Cookie', description: '从零开始搭建一个电影级场景，涵盖建模、纹理、灯光和合成全流程。适合中级用户。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#607d8b', duration: '18:55', views: 3400000, likes: 112000 },
    { title: '开源动画十年回顾', channel: '开源影评', description: '从 Elephants Dream 到今天，回顾开源动画的十年发展历程。开源工具如何改变了独立动画制作的格局。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#795548', duration: '8:30', views: 950000, likes: 34000 },
    { title: 'Blender vs Maya — 独立创作者的终极选择', channel: 'CG Talk', description: '深度对比 Blender 和 Maya 在独立创作工作流中的优劣，涵盖建模、动画、渲染和社区生态。', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnail_color: '#009688', duration: '15:12', views: 4800000, likes: 167000 },
  ];

  const insertMany = db.transaction(() => {
    for (const v of videos) {
      insertVideo.run(v);
    }
    const commentData = [
      [1, '影视爱好者', '画质太棒了！Blender 的渲染质量真的没话说，每一帧都能当壁纸', 342],
      [1, 'CodingLife', '作为开源项目，这个短片真的展示了社区的力量。强烈推荐！', 218],
      [1, '影迷小王', '十年前第一次看就被震撼到了，现在回看依然觉得制作精良。', 156],
      [2, 'TechReview', 'Sintel 的故事真的感人，音乐也很棒', 201],
      [2, '动画师老张', '作为动画师，我反复看了很多遍来学习技术细节', 178],
      [3, '科幻迷', 'Tears of Steel 的视觉效果完全不输好莱坞大片', 199],
      [7, 'Blender新人', '刚学 Blender 一个月，这个视频太有帮助了', 423],
      [7, '3DArtist', '4.0 版本的光线追踪真的是游戏改变者', 312],
      [8, '学习者', '跟着教程做了一遍，收获很大！', 156],
      [10, '独立导演', '作为独立创作者，我两个都用，各有优势', 234],
    ];
    for (const c of commentData) {
      insertComment.run(...c);
    }
    const users = [
      ['Demo用户', '#ff5722'],
      ['管理员', '#2196f3'],
      ['游客', '#4caf50'],
    ];
    for (const u of users) {
      insertUser.run(...u);
    }
  });

  insertMany();
  console.log('[db] Seed data inserted');
}

export default db;
