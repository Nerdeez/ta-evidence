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
2. From the **repository root**, regenerate Drizzle definitions (includes tables for enabled plugins such as API keys):

   ```bash
   pnpm dlx auth@1.7.7 generate \
     --config packages/auth/src/auth.ts \
     --output packages/db/src/schema/auth.ts \
     --adapter drizzle \
     --dialect pg \
     -y
   ```

   Pin the CLI to the same Better Auth version as the catalog (`better-auth` / `@better-auth/*` in `pnpm-workspace.yaml`).

3. Export any new tables from `packages/db/src/schema/index.ts` if the CLI added them, then apply Drizzle migrations:

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

   For a local reset instead of incremental migrate, use `pnpm db:reset` (see `@ta/db`).

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
