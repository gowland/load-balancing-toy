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

// Simulation state
let isHealthy = true;
let shouldCrash = false;
let responseDelay = 0;

// Health check endpoint
app.get('/health', (req, res) => {
  if (!isHealthy) {
    return res.status(500).json({ 
      status: 'unhealthy', 
      instanceId: instanceId,
      timestamp: new Date().toISOString() 
    });
  }
  
  res.json({ 
    status: 'healthy', 
    instanceId: instanceId,
    timestamp: new Date().toISOString() 
  });
});

// Failure simulation endpoints
app.post('/simulate/unhealthy', (req, res) => {
  isHealthy = false;
  console.log(`[${instanceId}] Simulating unhealthy state`);
  res.json({ message: `${instanceId} is now unhealthy`, instanceId });
});

app.post('/simulate/healthy', (req, res) => {
  isHealthy = true;
  console.log(`[${instanceId}] Returning to healthy state`);
  res.json({ message: `${instanceId} is now healthy`, instanceId });
});

app.post('/simulate/crash', (req, res) => {
  console.log(`[${instanceId}] Simulating crash in 2 seconds...`);
  res.json({ message: `${instanceId} will crash in 2 seconds`, instanceId });
  setTimeout(() => {
    process.exit(1);
  }, 2000);
});

app.post('/simulate/delay/:ms', (req, res) => {
  responseDelay = parseInt(req.params.ms) || 0;
  console.log(`[${instanceId}] Setting response delay to ${responseDelay}ms`);
  res.json({ message: `${instanceId} now has ${responseDelay}ms delay`, instanceId });
});

app.post('/simulate/hang', (req, res) => {
  console.log(`[${instanceId}] Simulating hang - not responding`);
  // Don't send a response - simulates hanging
});

app.get('/simulate/status', (req, res) => {
  res.json({
    instanceId,
    isHealthy,
    responseDelay,
    timestamp: new Date().toISOString()
  });
});

app.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query parameter' });

  // Apply response delay if set
  if (responseDelay > 0) {
    await new Promise(resolve => setTimeout(resolve, responseDelay));
  }

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
