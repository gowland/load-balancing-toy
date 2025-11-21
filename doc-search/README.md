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

## Failure Simulation

The service includes built-in failure simulation endpoints for testing load balancing, health checks, and recovery scenarios. These are particularly useful for demonstrating how nginx handles service failures.

### Simulation Endpoints

#### Make Service Report Unhealthy
```http
POST /simulate/unhealthy
```
Makes the service report as unhealthy in health checks (returns HTTP 500).

#### Restore Service to Healthy State
```http
POST /simulate/healthy
```
Restores the service to report as healthy in health checks.

#### Add Response Delay
```http
POST /simulate/delay/{milliseconds}
```
Adds artificial delay to all responses. Useful for testing timeout handling.

#### Simulate Service Crash
```http
POST /simulate/crash
```
Crashes the service after 2 seconds. Docker will automatically restart it due to restart policies.

#### Simulate Service Hang
```http
POST /simulate/hang
```
Makes the service stop responding (no response sent). Useful for testing timeout scenarios.

#### Check Simulation Status
```http
GET /simulate/status
```
Returns current simulation state (health status, delays, etc.).

### PowerShell Testing Commands

When using Windows PowerShell, use `Invoke-RestMethod` instead of `curl`:

```powershell
# Make a service report unhealthy
Invoke-RestMethod -Uri "http://localhost:8080/simulate/unhealthy" -Method POST

# Add 5-second delay to responses  
Invoke-RestMethod -Uri "http://localhost:8080/simulate/delay/5000" -Method POST

# Simulate service crash
Invoke-RestMethod -Uri "http://localhost:8080/simulate/crash" -Method POST

# Make service hang (stop responding)
Invoke-RestMethod -Uri "http://localhost:8080/simulate/hang" -Method POST

# Check simulation status
Invoke-RestMethod -Uri "http://localhost:8080/simulate/status" -Method GET

# Restore service to healthy state
Invoke-RestMethod -Uri "http://localhost:8080/simulate/healthy" -Method POST

# Remove response delays
Invoke-RestMethod -Uri "http://localhost:8080/simulate/delay/0" -Method POST

# Test search during failures
Invoke-RestMethod -Uri "http://localhost:8080/search?q=docker" -Method GET
```

### Demo Scenarios

**1. Health Check Failure Demo:**
```powershell
# Make one service unhealthy
Invoke-RestMethod -Uri "http://localhost:8080/simulate/unhealthy" -Method POST

# Wait 90+ seconds for health checks to detect failure
# Test load balancer (should route around failed service)
Invoke-RestMethod -Uri "http://localhost:8080/search?q=test" -Method GET

# Restore service
Invoke-RestMethod -Uri "http://localhost:8080/simulate/healthy" -Method POST
```

**2. Performance Degradation Demo:**
```powershell
# Add delay to simulate slow service
Invoke-RestMethod -Uri "http://localhost:8080/simulate/delay/3000" -Method POST

# Some requests will be slow, others normal (random load balancing)
Invoke-RestMethod -Uri "http://localhost:8080/search?q=test" -Method GET

# Remove delay
Invoke-RestMethod -Uri "http://localhost:8080/simulate/delay/0" -Method POST
```

**3. Cache Behavior Demo:**
```powershell
# Make requests to see cache behavior (10-second cache)
Invoke-RestMethod -Uri "http://localhost:8080/search?q=docker" -Method GET  # MISS
Invoke-RestMethod -Uri "http://localhost:8080/search?q=docker" -Method GET  # HIT

# Wait 11+ seconds and try again
Start-Sleep -Seconds 11
Invoke-RestMethod -Uri "http://localhost:8080/search?q=docker" -Method GET  # MISS (expired)
```

### Container-Level Failure Testing

You can also test container failures directly:

```powershell
# Stop a specific service container
docker-compose stop doc-search-1

# Pause (freeze) a container
docker-compose pause doc-search-2

# View service status
docker-compose ps

# Restart services
docker-compose start doc-search-1
docker-compose unpause doc-search-2
```

### Monitoring During Tests

Watch the behavior during failure simulation:

```powershell
# Monitor container health
docker-compose ps

# View logs from specific services
docker-compose logs -f doc-search-1
docker-compose logs -f load-balancer

# Check cache headers in responses
Invoke-WebRequest -Uri "http://localhost:8080/search?q=test" -Method GET | Select-Object Headers
```

## Service Behavior

- **Startup**: Waits for Redis availability, creates search index, populates documents
- **Search**: Uses Redis FT.SEARCH for full-text queries across document content
- **Logging**: Includes instance ID in all log messages for debugging
- **Error Handling**: Graceful error responses with appropriate HTTP status codes
- **Health**: Continuous health monitoring via dedicated endpoint
- **Caching**: Nginx caches responses for 10 seconds to improve performance
- **Load Balancing**: Nginx distributes requests across healthy service instances
- **Auto-Recovery**: Docker automatically restarts failed containers