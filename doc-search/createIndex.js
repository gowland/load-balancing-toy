const Redis = require('ioredis');
const redis = new Redis();

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