# @ta/web-iam

Next.js app for user signup, sign-in, and authentication for the TA Evidence API. It will include login, signup, forgot password, verify email, and a dashboard for creating API keys.

## Routes

Route groups organize layouts without changing URLs:

- **`(auth)/`** — sign-in flows (`/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`); shared centered layout
- **`/dashboard`** — developer portal (logged-in; API tokens); outside `(auth)` so it can use a different layout and guards later
- **`/`** — account landing

## Development

From the repository root:

```sh
pnpm exec turbo dev --filter=./apps/web/iam
```

Or from this directory:

```sh
pnpm dev
```

The dev server uses Turbopack (`next dev --turbopack`) and serves at [http://localhost:3001](http://localhost:3001) so it does not clash with `@ta/web-strategies` or `@ta/api-ticker` on port 3000.

## Build

```sh
pnpm build
pnpm start
```
