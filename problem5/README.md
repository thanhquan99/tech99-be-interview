# Problem 5: A CRUD Server

CRUD REST API built with **ExpressJS**, **TypeScript**, and **PostgreSQL** (via Prisma ORM).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript 5 |
| Framework | Express 4 |
| ORM | Prisma 7 (PostgreSQL adapter) |
| Validation | Zod 3 |
| API Docs | swagger-ui-express + @asteasolutions/zod-to-openapi |
| Testing | Jest + ts-jest |
| Containerization | Docker + Docker Compose |

---

## Architecture: Vertical Slice (per use case)

Each use case (e.g. `create-item`, `list-items`) is a self-contained slice with its own controller, service, and validation. Shared concerns (repository, routes, model) live at the feature level.

```
Request
  └── Router (item.routes.ts)
        └── Controller          ← parse & respond
              └── Service       ← business logic
                    └── Repository (item.repository.ts)
                          └── Prisma (PostgreSQL)
```

Validation (Zod) runs in the controller before calling the service. Each validation file also registers its route on the shared OpenAPI registry, keeping docs and validation in sync automatically.

---

## Project Structure

```
prisma/
├── schema.prisma                              # Prisma data model
└── migrations/
    └── 20260322052651_create_table_item/
        └── migration.sql
src/
├── api/
│   └── items/
│       ├── create-item/
│       │   ├── create-item.controller.ts   # parse body, call service, respond 201
│       │   ├── create-item.service.ts      # business logic
│       │   └── create-item.validation.ts   # Zod schema + OpenAPI route registration
│       ├── list-items/
│       │   ├── list-items.controller.ts
│       │   ├── list-items.service.ts
│       │   └── list-items.validation.ts
│       ├── get-item/
│       │   ├── get-item.controller.ts
│       │   ├── get-item.service.ts
│       │   └── get-item.openapi.ts         # OpenAPI route registration (no extra validation needed)
│       ├── update-item/
│       │   ├── update-item.controller.ts
│       │   ├── update-item.service.ts
│       │   └── update-item.validation.ts
│       ├── delete-item/
│       │   ├── delete-item.controller.ts
│       │   ├── delete-item.service.ts
│       │   └── delete-item.openapi.ts
│       ├── item.model.ts       # Prisma type re-export
│       ├── item.repository.ts  # all DB access (single Prisma calls)
│       ├── item.routes.ts      # Express router wiring
│       └── item.schema.ts      # shared Zod Item schema registered in OpenAPI
├── config/
│   └── db.ts                   # Prisma client singleton
├── middleware/
│   └── error-handler.ts        # global Express error handler
├── utils/
│   └── api-error.ts            # ApiError class (statusCode + message)
├── openapi-registry.ts         # shared OpenAPIRegistry + extendZodWithOpenApi
├── swagger.ts                  # generates OpenAPI spec from registry
├── app.ts                      # Express app setup (routes, middleware, /docs)
└── server.ts                   # entry point (DB connect + listen)
```

---

## API Docs (Swagger UI)

Once the server is running, open:

```
http://localhost:3000/docs
```

The spec is generated automatically from Zod schemas via `@asteasolutions/zod-to-openapi` — validation rules and API documentation are always in sync.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/items` | Create an item |
| `GET` | `/items` | List items (filter, sort, paginate) |
| `GET` | `/items/:id` | Get item by ID |
| `PUT` | `/items/:id` | Update item |
| `DELETE` | `/items/:id` | Delete item |

### Create an item
```
POST /items
Content-Type: application/json

{ "name": "Widget", "description": "A useful widget", "price": 9.99 }
```

### List items
```
GET /items?name=widget&sortBy=price&order=asc&page=1&limit=10
```

Query parameters (all optional):

| Parameter | Type | Description |
|---|---|---|
| `name` | string | Partial, case-insensitive name filter |
| `sortBy` | string | Field to sort by (default: `createdAt`) |
| `order` | `asc` \| `desc` | Sort direction (default: `desc`) |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Items per page (default: `10`, max: `100`) |

### Get item
```
GET /items/:id
```

### Update item
```
PUT /items/:id
Content-Type: application/json

{ "price": 14.99 }
```
At least one field (`name`, `description`, `price`) must be provided.

### Delete item
```
DELETE /items/:id
```
Returns `204 No Content` on success.

---

## Requirements

- Docker & Docker Compose (recommended), **or**
- Node.js 20+ and a running PostgreSQL instance

---

## Run with Docker (recommended)

```bash
docker-compose up
```

The server starts at `http://localhost:3000`. Migrations are applied automatically on container start.

---

## Run locally

```bash
npm install
```

Set the database URL:

```bash
export DATABASE_URL=postgresql://postgres:postgres@localhost:5432/items_db
```

Apply migrations and generate the Prisma client:

```bash
npm run db:migrate:deploy   # apply existing migrations
npm run db:generate         # generate Prisma client
```

Development mode (ts-node):
```bash
npm run dev
```

Or build and run compiled JS:
```bash
npm run build
npm start
```

---

## Testing

```bash
npm test
```

Tests are in `src/__tests__/` and cover all service-layer use cases. Prisma is mocked so no database is required.

---

## Database Scripts

| Command | Description |
|---|---|
| `npm run db:migrate` | Create & apply a new migration (dev only) |
| `npm run db:migrate:deploy` | Apply existing migrations (production) |
| `npm run db:generate` | Regenerate the Prisma client after schema changes |
| `npm run db:migrate:create -- --name <name>` | Create a migration file without applying it |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Server port |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/items_db` | PostgreSQL connection URL |
