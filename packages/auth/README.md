# @ta/auth

Shared [Better Auth](https://better-auth.com) configuration for the TA Evidence monorepo. This package defines how users sign in and how sessions are stored; it does **not** own the database schema files (those live in `@ta/db`).

## Purpose

`@ta/auth` is the home for:

- **`betterAuth({ … })`** — plugins, providers, session options, and the Drizzle adapter pointing at `@ta/db`
- **Server helpers** (as we add them) — session lookup, Next.js route handlers, typed `AuthUser` / `AuthSession`
- **Auth CLI input** — the config file Better Auth reads when generating Drizzle tables

The **IAM web app** (`@ta/web-iam`) is the auth **server**: it mounts Better Auth at `/api/auth/*`. Other web apps consume sessions through this package; they should not define their own Better Auth instances.

## Stack

- [Better Auth](https://better-auth.com/docs/installation) — authentication API and session cookies
- [`@better-auth/drizzle-adapter`](https://better-auth.com/docs/adapters/drizzle) — persists users and sessions via Drizzle
- [`@ta/db`](../../db/README.md) — PostgreSQL client and table definitions (including generated auth tables)

## Environment

Set these in the repository root `.env` (see `.env.example` as we add auth-related vars):

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL (required by `@ta/db` and the Drizzle adapter) |
| `BETTER_AUTH_SECRET` | Signing / encryption secret (≥ 32 chars, high entropy) |
| `BETTER_AUTH_URL` | Public origin of `@ta/web-iam` (e.g. `http://localhost:3001`) |
| `NEXT_PUBLIC_WEB_STRATEGIES_URL` | Public origin of `@ta/web-strategies`; included in Better Auth `trustedOrigins` (e.g. `http://localhost:3000`) |

## Generating auth tables in `@ta/db`

Better Auth owns the shape of the `user`, `session`, `account`, and `verification` tables. Do **not** hand-write those Drizzle definitions.

1. Implement `src/auth.ts` here (minimal config is enough to start).
2. From the repo root, run the [Better Auth CLI `generate`](https://better-auth.com/docs/adapters/drizzle#schema-generation--migration) command with `--config` pointing at this file and `--output packages/db/src/schema/auth.ts`.
3. Export the new schema from `@ta/db`, then run `pnpm db:generate` and `pnpm db:migrate` (documented in `@ta/db`).

Regenerate `packages/db/src/schema/auth.ts` whenever you change Better Auth config (plugins, extra user fields, etc.).

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @ta/auth check-types
pnpm --filter @ta/auth build
```

## Package layout

```text
packages/auth/
├── src/
│   └── auth.ts       # betterAuth({ … }) — source for CLI generate and runtime
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT — see [LICENSE](../../LICENSE) in the repository root.
