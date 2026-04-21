const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Post = require('../models/Post');

// ── Rate limiter: max 3 posts per IP per 60 seconds ──────────────────────────
const postLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 minute window
  max: 3,                      // max 3 posts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down. You can only post 3 messages per minute.' },
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'] || 'unknown',
});

// GET /posts?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(),
    ]);

    res.json({ posts, page, limit, total, hasMore: skip + limit < total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// POST /posts  (rate-limited)
router.post('/', postLimiter, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }
    if (text.trim().length > 500) {
      return res.status(400).json({ error: 'Message too long (max 500 chars)' });
    }
    const post = await Post.create({ text: text.trim() });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

module.exports = router;
