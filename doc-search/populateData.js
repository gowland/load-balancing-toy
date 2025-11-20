const Redis = require('ioredis');
const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt();

async function populateInstance() {
  const instanceId = process.env.INSTANCE_ID || '1';
  const redisHost = process.env.REDIS_HOST || 'localhost';
  
  const redis = new Redis({
    host: redisHost,
    port: 6379
  });

  try {
    // Create index
    console.log(`[Instance ${instanceId}] Creating search index...`);
    await redis.call('FT.CREATE', 'idx', 'ON', 'HASH', 'PREFIX', '1', 'doc:', 'SCHEMA', 'content', 'TEXT', 'title', 'TEXT');
    
    // Get all markdown files
    const docsDir = path.join(__dirname, 'docs');
    const files = fs.readdirSync(docsDir).filter(file => file.endsWith('.md'));
    
    // Each instance gets ALL documents (identical replicas)
    console.log(`[Instance ${instanceId}] Processing all ${files.length} documents`);
    
    // Index all documents for this instance
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(docsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const html = md.render(content);
      
      const docId = `doc:${file.replace('.md', '')}`;
      await redis.hset(docId, {
        title: file.replace('.md', '').replace(/-/g, ' '),
        content: content,
        html: html,
        instance: instanceId
      });
      
      console.log(`[Instance ${instanceId}] Indexed: ${file}`);
    }
    
    console.log(`[Instance ${instanceId}] Successfully indexed ${files.length} documents`);
    
  } catch (err) {
    if (err.message.includes('Index already exists')) {
      console.log(`[Instance ${instanceId}] Index already exists, skipping creation`);
    } else {
      console.error(`[Instance ${instanceId}] Error:`, err.message);
    }
  } finally {
    redis.disconnect();
  }
}

populateInstance();