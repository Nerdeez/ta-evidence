# @ta/iam-web

Next.js app for registering users and providing authentication for the TA Evidence API. It will include login, register, forgot password, verify email, and a dashboard for creating API keys.

## Development

From the repository root:

```sh
pnpm exec turbo dev --filter=./apps/iam/web
```

Or from this directory:

```sh
pnpm dev
```

The dev server uses Turbopack (`next dev --turbopack`) and serves at [http://localhost:3001](http://localhost:3001) so it does not clash with the research site or market-data API on port 3000.

## Build

```sh
pnpm build
pnpm start
```
