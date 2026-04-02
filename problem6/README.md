# 🏆 Scoreboard API Module – Technical Specification

## 📌 Overview

This module handles **user score updates** and provides a **real-time top 10 leaderboard**.

### Core Requirements

* Maintain a **Top 10 scoreboard**
* Support **real-time updates**
* Handle **user score increments**
* Prevent **unauthorized / malicious score updates**

---

## 🧱 Module Responsibilities

* Accept score update requests
* Validate and authorize users
* Update persistent storage
* Maintain leaderboard (Top 10)
* Broadcast updates to clients in real-time

---

## 🧪 API Contract

### `POST /api/score/update`

**Request**

```json
{
  "userId": "string",
  "actionId": "string"
}
```

**Headers**

```
Authorization: Bearer <token>
```

**Response**

```json
{
  "success": true,
  "newScore": 120
}
```

---

### `GET /api/score/top`

**Response**

```json
{
  "leaders": [
    { "userId": "u1", "score": 200 },
    { "userId": "u2", "score": 180 }
  ]
}
```

---

## 🟢 Approach 1: Simple (Monolithic + Polling)

### Architecture

* Backend: REST API
* Database: SQL (e.g., PostgreSQL)
* Frontend: Poll every N seconds

### Flow

```
Client → POST /score/update → API → DB (update score)
Client → GET /score/top (polling)
```

### Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant DB as Database

    C->>API: 1. POST /score/update
    API->>DB: Update score
    C->>API: 2. GET /score/top (polling)
    API->>DB: Query Top 10
    DB-->>API: Results
    API-->>C: Top 10 leaderboard
```

### Pros

* Simple to implement
* Easy to debug

### Cons

* Not real-time (polling delay)
* High load with many clients polling
* Inefficient for scaling

---

## 🟡 Approach 2: WebSocket (Real-time)

### Architecture

* Add WebSocket server
* Push updates when score changes

### Flow

```
Client → WebSocket connect
Client → POST update score
API → Update DB → Notify WebSocket → Broadcast leaderboard
```

### Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant WS as WebSocket Hub
    participant DB as Database

    C->>API: POST /score/update
    API->>DB: Update score
    API->>WS: Notify score changed
    WS-->>C: PUSH updated leaderboard
```

### Implementation Notes

* Use: Socket.IO / WS / SSE
* On score update:

  * Recompute Top 10
  * Broadcast to all clients

### Pros

* Real-time updates
* Better UX

### Cons

* Still recalculates Top 10 frequently
* Can overload DB under high write volume

---

## 🟠 Approach 3: Cache + Event-driven (Scalable)

### Architecture

* DB (source of truth)
* Redis (leaderboard cache)
* Message Queue (Kafka / RabbitMQ)
* WebSocket server

### Flow

```
Client → API → Publish Event → Queue
Worker → Process → Update DB + Redis
WebSocket → Push updates
```

### Diagram

```mermaid
graph TD
    C[Client] -->|POST /score/update| API[API Server]
    API -->|Publish Event| MQ[Message Queue]
    MQ -->|Consume| W[Worker]
    W -->|Update| DB[Database]
    W -->|Update leaderboard| R[Redis]
    W -->|Notify| WS[WebSocket Server]
    WS -->|PUSH updates| Clients[Clients]
```

### Sequence Diagrams

#### Score Update Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant MQ as Message Queue
    participant W as Worker
    participant DB as Database
    participant R as Redis
    participant WS as WebSocket Server

    C->>API: 1. POST /score/update (JWT + actionId)
    API->>API: 2. Validate JWT & rate limit
    API->>MQ: 3. Publish SCORE_UPDATED event
    API-->>C: 4. 202 Accepted
    MQ->>W: 5. Consume event
    W->>DB: 6. Validate action (idempotency check)
    DB-->>W: 7. Action valid
    W->>DB: 8. UPDATE user score
    W->>R: 9. ZADD leaderboard score userId
    W->>WS: 10. Notify leaderboard changed
    WS-->>C: 11. PUSH updated Top 10
```

#### Leaderboard Read Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as API Server
    participant R as Redis

    C->>API: 1. GET /score/top
    API->>R: 2. ZREVRANGE leaderboard 0 9 WITHSCORES
    R-->>API: 3. Top 10 results
    API-->>C: 4. Return leaderboard JSON
```

#### WebSocket Connection & Live Updates

```mermaid
sequenceDiagram
    participant C as Client
    participant WS as WebSocket Server
    participant R as Redis

    C->>WS: 1. Connect (WS handshake + JWT)
    WS->>WS: 2. Authenticate token
    WS-->>C: 3. Connection established
    WS->>R: 4. ZREVRANGE leaderboard 0 9
    R-->>WS: 5. Current Top 10
    WS-->>C: 6. PUSH initial leaderboard

    Note over WS,C: On score change...
    WS->>R: 7. Fetch updated Top 10
    R-->>WS: 8. New Top 10
    WS-->>C: 9. PUSH updated leaderboard
```

#### Failure & Retry Flow

```mermaid
sequenceDiagram
    participant MQ as Message Queue
    participant W as Worker
    participant DB as Database
    participant DLQ as Dead Letter Queue

    MQ->>W: 1. Consume SCORE_UPDATED event
    W->>DB: 2. Update score
    DB-->>W: 3. ❌ Error (timeout / conflict)
    W->>MQ: 4. NACK – requeue for retry
    MQ->>W: 5. Retry (attempt 2)
    W->>DB: 6. Update score
    DB-->>W: 7. ✅ Success

    Note over MQ,DLQ: If max retries exceeded...
    MQ->>DLQ: 8. Move to Dead Letter Queue
    Note over DLQ: Alert + manual investigation
```

### Implementation Details

#### Redis Leaderboard

Use **Sorted Set (ZSET)**:

```
ZADD leaderboard score userId
ZREVRANGE leaderboard 0 9 WITHSCORES
```

#### Event Example

```json
{
  "type": "SCORE_UPDATED",
  "userId": "u1",
  "increment": 10
}
```

#### Worker Logic

1. Consume event
2. Validate action
3. Update DB
4. Update Redis leaderboard
5. Publish update to WebSocket

---

### Pros

* Scales horizontally
* Fast leaderboard reads (Redis)
* Decoupled system

### Cons

* More complex
* Requires infra (Redis, MQ)

---

## 🔐 Security Considerations

### Prevent Malicious Score Updates

#### 1. Authentication

* Require JWT / OAuth token

#### 2. Action Validation

* Do NOT trust client score
* Server computes score increment

#### 3. Idempotency

* Prevent duplicate actions:

```sql
UNIQUE(actionId, userId)
```

#### 4. Rate Limiting

* Limit requests per user

#### 5. Anti-cheat logic

* Validate action completion server-side
* Example: verify event from trusted service

---

## ⚖️ Comparison of Approaches

| Criteria      | Approach 1 (Polling) | Approach 2 (WebSocket) | Approach 3 (Event + Cache) |
| ------------- | -------------------- | ---------------------- | -------------------------- |
| Complexity    | Low                  | Medium                 | High                       |
| Real-time     | ❌                    | ✅                      | ✅                          |
| Scalability   | ❌                    | ⚠️                     | ✅                          |
| Performance   | ❌                    | ⚠️                     | ✅                          |
| Cost          | Low                  | Medium                 | High                       |
| Best Use Case | MVP                  | Small apps             | Production scale           |

---

## 🚀 Recommended Approach

* Start with **Approach 1 (MVP)**
* Upgrade to **Approach 2** when real-time UX is required
* Move to **Approach 3** when:

  * High traffic
  * Many concurrent updates
  * Need low-latency leaderboard

---

## 🧠 Additional Improvements

### 1. Leaderboard Partitioning

* Weekly / Monthly leaderboard
* Redis keys:

```
leaderboard:global
leaderboard:weekly
```

---

### 2. Pagination for Rankings

* Support rank beyond top 10

---

### 3. Observability

* Metrics:

  * Score update latency
  * WebSocket broadcast time
* Logging:

  * Suspicious activity

---

### 4. Backpressure Handling

* Queue buffering (Kafka)
* Retry failed events

---

### 5. Consistency Strategy

* Eventual consistency (Approach 3)
* Accept slight delay in leaderboard updates

---

### 6. Testing Strategy

* Unit: score calculation
* Integration: DB + Redis sync
* Load test: concurrent updates

---

## 📦 Suggested Tech Stack

* **API**: Node.js (NestJS / Express)
* **DB**: PostgreSQL
* **Cache**: Redis
* **Queue**: Kafka / RabbitMQ
* **Realtime**: WebSocket / Socket.IO
