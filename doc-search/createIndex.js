const Redis = require('ioredis');
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379
});

async function createIndex() {
  try {
    await redis.call('FT.CREATE', 'idx', 'ON', 'HASH', 'PREFIX', '1', 'doc:', 'SCHEMA', 'content', 'TEXT');
    console.log('Index created successfully');
  } catch (err) {
    console.error('Index creation failed:', err.message);
  } finally {
    redis.disconnect();
  }
}

createIndex();