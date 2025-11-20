# Description

# Usage

## Launch Redisearch service

```
docker-compose up -d
```

## Create the index

```
node createIndex.js
node indexDocuments.js
```

## Launch the search service

```
node index.js
```

## Use the API

```
GET http://localhost:3010/search?q=keyword
```