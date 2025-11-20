const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');

const redis = new Redis();

async function indexDocuments() {
  const dir = './docs';
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.md')) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const key = `doc:${file}`;
      await redis.hset(key, 'content', content);
      console.log(`Indexed: ${file}`);
    }
  }

  redis.disconnect();
}

indexDocuments();