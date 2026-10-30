# @ta/db

Shared database package for the TA Evidence monorepo. Defines the database schema with [Drizzle ORM](https://orm.drizzle.team/) and exposes typed tools for apps and services to read and write data.

## Purpose

`@ta/db` is the single source of truth for **persistence**:

- **Schema** — tables, columns, relations, and indexes
- **Migrations** — versioned changes applied to PostgreSQL
- **Client** — a configured Drizzle instance for queries
- **Seed** — dev fixtures (see `scripts/seed.ts`)

Apps should not define their own schema or open ad hoc database connections. They depend on `@ta/db` for the client and table definitions.

Domain-specific queries (e.g. a securities list for `@ta/api-strategies`) live in the **app or API package** that owns the route, not in `@ta/db`, unless the same query is reused by multiple apps and is still purely about reading/writing rows.

### Package boundaries

Keep `@ta/db` limited to things that are actually about the database. That avoids placing HTTP or API-layer logic here by mistake.

| Belongs in `@ta/db` | Put elsewhere |
|---------------------|---------------|
| Drizzle schema, relations, indexes | Route handlers, Fastify plugins → **apps** (`apps/api/*`) |
| Generated SQL under `drizzle/` | Query param parsing, error response shape → **`@ta/api`** |
| `db` / `closeDb` | List **`meta`**, default/max page size, `page`/`limit` parsing → **`@ta/api`** |
| Seed scripts and migration tooling | Filters and DTO mapping for one REST resource → **that API’s service layer** |

**Composing a paginated HTTP list:** import `db` and tables from `@ta/db`, run `.limit()` and `.offset()` in the service, and take page size from values parsed with `@ta/api` (e.g. `parsePage`, `parseLimit`, and shared paging helpers). Do not add new exports to `@ta/db` for API contracts or query-string rules.

See `packages/api/src/` for shared HTTP helpers (`parsePage`, `parseLimit`, and related paging types).

## Stack

- [Drizzle ORM](https://orm.drizzle.team/) — schema-as-code and type-safe queries
- PostgreSQL — primary datastore for market and filing data

## Usage

Import schema and the database client from `@ta/db` in any workspace app:

```typescript
import { buildPaginationMeta, pageToOffset, parseLimit, parsePage } from '@ta/api';
import { db, securities } from '@ta/db';
import { eq } from 'drizzle-orm';

// In an API service: persistence from @ta/db, paging policy from @ta/api.
const page = parsePage(query.page);
const limit = parseLimit(query.limit);
const offset = pageToOffset(page, limit);

const rows = await db
  .select()
  .from(securities)
  .where(eq(securities.ticker, 'AAPL'))
  .limit(limit)
  .offset(offset);
```

## Development

From the repository root:

```bash
pnpm install
cp .env.example .env
```

### Local database (Docker)

Local development uses PostgreSQL in Docker (`compose.yaml` at the repo root). The container listens on **port 15432** so it does not clash with `cloud-sql-proxy` on 5432 or other local Postgres instances.

```bash
pnpm db:up      # start Postgres and wait until healthy
pnpm db:setup   # alias for db:up (run db:migrate after db:generate)
pnpm db:down    # stop Postgres (data kept in Docker volume)
pnpm db:reset   # wipe volume and start fresh Postgres
```

`DATABASE_URL` in `.env` should match `compose.yaml` (see `.env.example`).

### Migrations (Option 3)

Schema lives in TypeScript; SQL migrations are generated and applied with drizzle-kit:

```bash
# after editing src/schema/
pnpm db:generate  # write SQL to drizzle/
pnpm db:migrate   # apply pending migrations
```

Open Drizzle Studio (local inspection):

```bash
pnpm db:studio
```

For quick local experiments on a throwaway DB you can use `pnpm --filter @ta/db db:push`, but **generate + migrate** is the canonical flow for changes that should land in git.

Seed fixture data from `@ta/mocks` (20 tickers, ~one year of daily bars each):

```bash
pnpm db:seed
```

### Remote databases (Cloud SQL)

For the temporary Cloud SQL instance, use `cloud-sql-proxy` and point `DATABASE_URL` at `localhost:5432`. Do not run the Docker Postgres container at the same time if both would use conflicting ports—or override the proxy port.

## Package layout

```text
packages/db/
├── src/
│   ├── schema/       # Drizzle table definitions
│   ├── client.ts     # Database connection and Drizzle instance
│   └── index.ts      # Public exports
├── scripts/
│   └── seed.ts       # Dev seed (not part of library build)
├── drizzle/          # Generated SQL migrations
└── drizzle.config.ts
```

## License

MIT — see [LICENSE](../../LICENSE) in the repository root.
