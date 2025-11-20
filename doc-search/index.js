const express = require('express');
const Redis = require('ioredis');

const app = express();
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redisearch',
  port: 6379
});

// Generate a unique instance ID for this service
const instanceNumber = process.env.INSTANCE_ID || Math.floor(Math.random() * 1000);
const instanceId = `doc-search-${instanceNumber}`;

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    instanceId: instanceId,
    timestamp: new Date().toISOString() 
  });
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  console.log(`[${instanceId}] Processing search query: ${query}`);

  try {
    const results = await redis.call('FT.SEARCH', 'idx', query);
    
    // Get document count for this instance
    const docCount = await redis.call('FT.INFO', 'idx');
    const numDocs = docCount[docCount.indexOf('num_docs') + 1];
    
    res.json({ 
      results,
      servedBy: instanceId,
      documentsInIndex: numDocs,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error(`[${instanceId}] Search error:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Add an endpoint to list all documents in this instance
app.get('/documents', async (req, res) => {
  try {
    const keys = await redis.keys('doc:*');
    const documents = [];
    
    for (const key of keys) {
      const doc = await redis.hgetall(key);
      documents.push({
        id: key,
        title: doc.title,
        instance: doc.instance
      });
    }
    
    res.json({
      servedBy: instanceId,
      totalDocuments: documents.length,
      documents: documents
    });
  } catch (err) {
    console.error(`[${instanceId}] Error listing documents:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`[${instanceId}] Search service running on http://localhost:${port}`));
