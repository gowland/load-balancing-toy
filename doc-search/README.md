# Document Search Service

A containerized document search service built with Node.js, Express, and Redis with RediSearch module. This service provides full-text search capabilities across a collection of software development documentation.

## Features

- **Full-text search** using Redis RediSearch module
- **Markdown document processing** with HTML conversion
- **Load-balanced architecture** with multiple identical instances
- **Health monitoring** and service discovery endpoints
- **Automatic data population** on service startup
- **RESTful API** for search and document management

## Architecture

The service consists of:
- **Express.js API server** handling HTTP requests
- **Redis with RediSearch** for indexing and searching documents
- **Automatic index creation** and document population
- **Multiple service instances** for load balancing and redundancy

## Document Collection

The service indexes 18 software development documents covering:
- Agile Development
- API Design
- Clean Code Principles
- Cloud Computing Fundamentals
- Code Review Practices
- Containerization & Docker
- Database Design
- Design Patterns
- DevOps & CI/CD
- Error Handling & Logging
- Microservices Architecture
- Performance Optimization
- Software Architecture Patterns
- Software Security
- Software Testing Strategies
- SOLID Principles
- Test-Driven Development
- Version Control with Git

## API Endpoints

### Search Documents
```http
GET /search?q=<query>
```
**Parameters:**
- `q` (required): Search query string

**Response:**
```json
{
  "results": [...],
  "servedBy": "doc-search-1",
  "documentsInIndex": 18,
  "timestamp": "2025-11-20T20:29:35.056Z"
}
```

### List All Documents
```http
GET /documents
```
**Response:**
```json
{
  "servedBy": "doc-search-2",
  "totalDocuments": 18,
  "documents": [
    {
      "id": "doc:agile-development",
      "title": "agile development",
      "instance": "2"
    }
  ]
}
```

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy",
  "instanceId": "doc-search-3",
  "timestamp": "2025-11-20T20:29:35.056Z"
}
```

## Usage

### Development Mode (Single Instance)

1. **Start Redis with RediSearch:**
   ```bash
   docker run -p 6379:6379 redislabs/redisearch:latest
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create index and populate data:**
   ```bash
   node createIndex.js
   node populateData.js
   ```

4. **Start the service:**
   ```bash
   node index.js
   ```

5. **Test the API:**
   ```bash
   curl "http://localhost:3000/search?q=docker"
   ```

### Load-Balanced Mode (Multiple Instances)

Use the parent directory's docker-compose setup which creates:
- 3 Redis instances with RediSearch
- 3 identical doc-search service instances
- NGINX load balancer distributing requests
- Automatic data population on startup

```bash
# From the parent directory
cd ../
docker-compose up --build
```

Access via load balancer:
```bash
curl "http://localhost:8080/search?q=microservices"
curl "http://localhost:8080/documents"
curl "http://localhost:8080/health"
```

## Environment Variables

- `PORT`: Service port (default: 3000)
- `REDIS_HOST`: Redis server hostname (default: localhost)
- `INSTANCE_ID`: Service instance identifier for logging

## Dependencies

- **express**: Web framework for API endpoints
- **ioredis**: Redis client for Node.js
- **markdown-it**: Markdown to HTML conversion
- **redis**: Additional Redis utilities

## Service Behavior

- **Startup**: Waits for Redis availability, creates search index, populates documents
- **Search**: Uses Redis FT.SEARCH for full-text queries across document content
- **Logging**: Includes instance ID in all log messages for debugging
- **Error Handling**: Graceful error responses with appropriate HTTP status codes
- **Health**: Continuous health monitoring via dedicated endpoint