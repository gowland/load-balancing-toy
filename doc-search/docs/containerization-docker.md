# Containerization with Docker

Docker is a platform that uses containerization technology to package applications and their dependencies into portable, lightweight containers that can run consistently across different environments.

## Core Concepts

### Images
Read-only templates used to create containers. Images are built from a series of layers, each representing an instruction in a Dockerfile.

### Containers
Running instances of Docker images. Containers are isolated processes that share the host OS kernel.

### Dockerfile
Text file containing instructions to build a Docker image.

### Docker Hub
Cloud-based registry service for sharing Docker images.

## Basic Docker Commands

### Image Management
```bash
docker build -t myapp:latest .     # Build image from Dockerfile
docker pull nginx:latest           # Download image from registry
docker images                      # List local images
docker rmi image_id               # Remove image
```

### Container Management
```bash
docker run -d -p 8080:80 nginx    # Run container in background
docker ps                         # List running containers
docker stop container_id          # Stop container
docker rm container_id            # Remove container
docker logs container_id          # View container logs
```

## Dockerfile Best Practices

### Use Multi-Stage Builds
```dockerfile
# Build stage
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Minimize Layer Count
- Combine RUN commands where possible
- Use .dockerignore to exclude unnecessary files
- Order instructions from least to most likely to change

### Security Considerations
- Don't run as root user
- Use specific image tags, not 'latest'
- Scan images for vulnerabilities
- Keep base images updated

## Docker Compose

Tool for defining and running multi-container Docker applications using YAML files.

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
  
  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

## Benefits of Containerization

- **Consistency**: Same environment across development, testing, and production
- **Portability**: Run anywhere Docker is supported
- **Efficiency**: Lightweight compared to virtual machines
- **Scalability**: Easy to scale applications horizontally
- **Isolation**: Process and resource isolation between containers