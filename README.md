# Load Balancing Toy

A containerized load balancing demonstration using multiple document search services with separate data stores.

## Project Description

This project simulates true load balancing by spinning up 3 independent document search instances, each with its own Redis database containing different subsets of documents. An NGINX reverse proxy distributes incoming requests across the instances using round-robin load balancing.

## Architecture

- **3 Redis instances** with RediSearch module (ports 6379, 6380, 6381)
- **3 Node.js search services** (each connected to its dedicated Redis instance)
- **NGINX load balancer** (port 8080) distributing requests
- **Identical document datasets** - each instance contains all documents for true redundancy

## Features

- **Round-robin load balancing** via NGINX
- **Replicated data stores** - each instance has identical complete dataset
- **Instance identification** - responses show which service handled the request
- **Automatic data population** - each instance loads its document subset on startup
- **Health monitoring** and document listing endpoints

## Quick Start

1. **Navigate to the doc-search directory:**
   ```bash
   cd doc-search
   ```

2. **Start the load-balanced services:**
   ```bash
   docker-compose up --build
   ```

3. **Test the setup:**
   - Search: `http://localhost:8080/search?q=docker`
   - List documents: `http://localhost:8080/documents`
   - Health check: `http://localhost:8080/health`

## API Endpoints

- **Search**: `GET /search?q=<query>` - Search across documents
- **Documents**: `GET /documents` - List documents in the responding instance
- **Health**: `GET /health` - Service health and instance information

## Testing Load Balancing

Make multiple requests to see different instances responding:

```bash
# Multiple searches will hit different instances
curl "http://localhost:8080/search?q=test"
curl "http://localhost:8080/documents" 
curl "http://localhost:8080/health"
```

Each response includes:
- `servedBy`: Which instance handled the request
- `documentsInIndex`: Number of documents in that instance
- Different document subsets per instance

## Document Distribution

The system replicates all documents to each instance:
- **All Instances**: Complete set of 18 documents (agile-development, api-design, clean-code-principles, cloud-computing-fundamentals, code-review-practices, containerization-docker, database-design, design-patterns, devops-cicd, error-handling-logging, microservices-architecture, performance-optimization, software-architecture-patterns, software-security, software-testing-strategies, solid-principles, test-driven-development, version-control-git)

This simulates a realistic load-balanced system where each node maintains an identical complete dataset for redundancy and high availability.
