const express = require('express');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  try {
    const results = await redis.call('FT.SEARCH', 'idx', query);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3010, () => console.log('Search service running on http://localhost:3010'));
